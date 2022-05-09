import request from "../api/index.js";
import { user } from "../utils/user.js";
import { initUserHome } from "./userHome.js";
import { setStack } from "../utils/setStackMemory.js";
import { backPage, changePage, nowPage } from "../utils/page.js";

const followUserPlace = document.querySelector("#follows_users");
const backBtn = document.querySelector("#follows_back");

let nowUser = {};
let followsStack = [];

backBtn.onclick = function () {
  followsStack.pop();
  setStack("followsStack", followsStack);
  backPage();
  followUserPlace.innerHTML = "";
};

//更新关注的人列表
async function initFollows(data) {
  if (!data) {
    let LfollowsStack = followsStack[followsStack.length - 1];
    data = await request(`/user/fullInfo?userId=${LfollowsStack}`, "get");
    followsStack.pop();
    data = data.user;
  }
  nowUser = data;
  followsStack.push(data.userId);
  setStack("followsStack", followsStack);
  followUserPlace.innerHTML = "";
  request(`/user/followerList?userId=${nowUser.userId}`, "get").then(({ followsList }) => {
    followsList.forEach((eachUser, index) => {
      let newNode = document.createElement("div");
      newNode.classList.add("search_users_item");
      newNode.setAttribute("userId", eachUser.userId);
      newNode.style.animation = `rightIn 0.3s ${index * (0.5 / followsList.length)}s both`;
      let isFollow = user.follows.includes(eachUser.userId) ? "已关注" : "关注";
      let isFollowClass = isFollow == "已关注" ? "haveFollow" : "";
      if (isFollow && user.fans.includes(eachUser.userId)) isFollow = "互关";

      //看是不是自己，是就不显示关注按钮
      let isOwn = eachUser.userId == user.userId ? "style='display:none;'" : "";

      newNode.onclick = clickOther; //为关注按钮和进入个人主页绑定事件
      newNode.innerHTML += `
        <img class="search_face" src="${eachUser.avatar}">
        <div class="search_userText">
          <div class="userText_name">${eachUser.nickname}</div>
          ${eachUser.description ? `<div class="userText_description">${eachUser.description}</div>` : ""}
        </div>
        <div
         ${isOwn}
          guanzhu="${eachUser.userId}"
          guanzhuIndex="${index}"
          class="search_followBtn follows_followBtn ${isFollowClass}">${isFollow}</div>
        `;
      followUserPlace.appendChild(newNode);
    });
  });
}

//点击搜索用户事件
function clickOther({ target, currentTarget }) {
  if (target.getAttribute("guanzhu")) {
    followOther(target);
  } else {
    goToUserHome(currentTarget);
  }
}

//进入个人主页
function goToUserHome(currentTarget) {
  let id = currentTarget.getAttribute("userId");
  request(`/user/fullInfo?userId=${id}`, "get").then(({ user }) => {
    changePage(nowPage, "userHome");
    initUserHome(user);
    followUserPlace.innerHTML = "";
  });
}

//关注函数
function followOther(target) {
  let targetId = Number(target.getAttribute("guanzhu"));
  let targetIndex = Number(target.getAttribute("guanzhuIndex"));
  //关注或取消关注
  request("/user/follow", "post", { userId: user.userId, followerId: targetId }).then((res) => {
    let followBtn = document.querySelectorAll(".follows_followBtn")[targetIndex];
    if (res.status === 200) {
      //已关注
      followBtn.classList.add("haveFollow");
      if (user.fans.includes(targetId)) followBtn.innerText = "互关";
      else followBtn.innerText = "已关注";
    } else if (res.status === 406) {
      //取消关注
      request("/user/cancelFollow", "post", { userId: user.userId, followerId: targetId }).then(() => {
        followBtn.classList.remove("haveFollow");
        followBtn.innerText = "关注";
      });
    }
  });
}

function renewFollowsStack(NfollowsStack) {
  followsStack = NfollowsStack;
}

export { initFollows, renewFollowsStack };
