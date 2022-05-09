import request from "../api/index.js";
import { user } from "../utils/user.js";
import { initUserHome } from "./userHome.js";
import { setStack } from "../utils/setStackMemory.js";
import { backPage, changePage, nowPage } from "../utils/page.js";

const fansUserPlace = document.querySelector("#fans_users");
const backBtn = document.querySelector("#fans_back");

let nowUser = {};
let fansStack = [];

backBtn.onclick = function () {
  fansStack.pop();
  setStack("fansStack", fansStack);
  backPage();
  fansUserPlace.innerHTML = "";
};

//更新关注的人列表
async function initFans(data) {
  if (!data) {
    let LfansStack = fansStack[fansStack.length - 1];
    data = await request(`/user/fullInfo?userId=${LfansStack}`, "get");
    fansStack.pop();
    data = data.user;
  }
  nowUser = data;
  fansStack.push(data.userId);
  setStack("fansStack", fansStack);
  fansUserPlace.innerHTML = "";
  request(`/user/fanList?userId=${nowUser.userId}`, "get").then(({ fansList }) => {
    fansList.forEach((eachUser, index) => {
      let newNode = document.createElement("div");
      newNode.classList.add("search_users_item");
      newNode.setAttribute("userId", eachUser.userId);
      newNode.style.animation = `rightIn 0.3s ${index * (0.5 / fansList.length)}s both`;
      let isFollow = user.follows.includes(eachUser.userId) ? "已关注" : "关注";
      let isFollowClass = isFollow == "已关注" ? "haveFollow" : "";
      if (isFollow == "已关注" && user.fans.includes(eachUser.userId)) isFollow = "互关";

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
          class="search_followBtn fans_followBtn ${isFollowClass}">${isFollow}</div>
        `;
      fansUserPlace.appendChild(newNode);
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
    fansUserPlace.innerHTML = "";
  });
}

//关注函数
function followOther(target) {
  let targetId = Number(target.getAttribute("guanzhu"));
  let targetIndex = Number(target.getAttribute("guanzhuIndex"));
  //关注或取消关注
  request("/user/follow", "post", { userId: user.userId, followerId: targetId }).then((res) => {
    let followBtn = document.querySelectorAll(".fans_followBtn")[targetIndex];
    if (res.status === 200) {
      //关注
      followBtn.classList.add("haveFollow");
      if (user.fans.includes(targetId)) followBtn.innerText = "互关";
      followBtn.innerText = "已关注";
    } else if (res.status === 406) {
      //取消关注
      request("/user/cancelFollow", "post", { userId: user.userId, followerId: targetId }).then(() => {
        followBtn.classList.remove("haveFollow");
        followBtn.innerText = "关注";
      });
    }
  });
}

function renewFansStack(NfansStack) {
  fansStack = NfansStack;
}

export { initFans, renewFansStack };
