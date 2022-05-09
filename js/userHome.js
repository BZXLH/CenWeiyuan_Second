import { changePage, nowPage, backPage, setDeepUserHome, deepUserHome } from "../utils/page.js";
import { delCookie } from "../utils/cookie.js";
import { user } from "../utils/user.js";
import { initDetail } from "./detail.js";
import { initMessage } from "./message.js";
import { initFollows } from "./follows.js";
import { initSend } from "./send.js";
import { initFans } from "./fans.js";
import { initlAc, getlAc } from "./lAc.js";
import { initEdit } from "./edit.js";
import { setStack } from "../utils/setStackMemory.js";
import request from "../api/index.js";

const userHomeBackBtn = document.querySelector("#userHome_back");
const userFace = document.querySelector(".userHome_face");
const userName = document.querySelector(".userHome_name");
const userFollowsBtn = document.querySelector("#userHome_follows");
const userFollows = document.querySelector("#userHome_follows_num");
const userFansBtn = document.querySelector("#userHome_fans");
const userFans = document.querySelector("#userHome_fans_num");
const lAcBtn = document.querySelector("#userHome_loveAcoll");
const userLike = document.querySelector("#userHome_loveAcoll_num");
const showPlaceOwn = document.querySelectorAll(".userHomeOwn_show_column");
const navBtnList = document.querySelector(".userHome_nav");
const navBtn = document.querySelectorAll(".userHome_nav_btn");
const navFoot = document.querySelector("#userHome_navFoot");
const logoutBtn = document.querySelector("#userHome_logout");
const sendBtn = document.querySelector("#userHome_sendIfo");
const msgBtn = document.querySelector("#userHome_msg");

let userInfo = {
  userId: null,
  nickname: "",
  avatar: "",
  likedArticles: [],
  staredArticles: [],
  likedReviews: [],
  follows: [],
  fans: [],
};
let idList = [];

let artList = [];
let nowNav = "userOwn";

// 返回按钮
userHomeBackBtn.onclick = function () {
  idList.pop();
  setStack("idList", idList);
  backPage();
  clearUserHome();
};
//前往主页
userHome_home.onclick = function () {
  idList.pop();
  setStack("idList", idList);
  changePage(nowPage, "home");
  clearUserHome();
  if (deepUserHome === 1) setDeepUserHome(-1);
};
navBtnList.onclick = clickNavBtn;
logoutBtn.onclick = logout; //退出登录
userFollowsBtn.onclick = goToFollows; //前往关注的人
userFansBtn.onclick = goToFans; //前往粉丝
lAcBtn.onclick = goTolAc; //前往点赞与收藏
msgBtn.onclick = goToMessage;

// 初始化函数
async function initUserHome(data, isShowFoot) {
  clearUserHome();
  if (!data) {
    let LidList = idList[idList.length - 1];
    let res = await request(`/user/fullInfo?userId=${LidList}`, "get");
    idList.pop();
    data = res.user;
  }

  if (isShowFoot) {
    navFoot.style.display = "flex";
    logoutBtn.style.display = "block";
    userHomeBackBtn.style.display = "none";
  } else {
    logoutBtn.style.display = "none";
    userHomeBackBtn.style.display = "block";
    navFoot.style.display = "none";
  }

  userInfo = data;
  idList.push(data.userId);

  //保存栈
  setStack("idList", idList);
  //更新头像
  userFace.src = userInfo.avatar;
  //更新昵称
  userName.innerText = userInfo.nickname;
  //更新粉丝、关注、点赞和收藏数
  userFollows.innerText = userInfo.follows.length;
  userFans.innerText = userInfo.fans.length;
  userLike.innerText = await getlAc(userInfo.userId);
  //检查是发消息还是编辑资料还是关注
  if (userInfo.userId == user.userId) {
    sendBtn.innerText = "编辑资料";
    sendBtn.classList = "userHome_sendIfo";
    sendBtn.onclick = editSelf;
  } else if (user.follows.includes(userInfo.userId) && user.fans.includes(userInfo.userId)) {
    sendBtn.innerText = "发消息";
    sendBtn.classList = "userHome_sendIfo canSend";
    sendBtn.onclick = sendMsg;
  } else if (user.follows.includes(userInfo.userId)) {
    sendBtn.innerText = "已关注";
    sendBtn.classList = "userHome_sendIfo";
    sendBtn.onclick = notFollow;
  } else {
    sendBtn.innerText = "关注TA";
    sendBtn.classList = "userHome_sendIfo userHome_follow";
    sendBtn.onclick = follow;
  }

  //更新文章
  renewArt(nowNav);
}

//更新文章
async function renewArt(artClass) {
  showPlaceOwn[0].innerHTML = "";
  showPlaceOwn[1].innerHTML = "";
  let res;
  let avatar, authorName;
  if (artClass == "userOwn") {
    //自己的文章
    let { articles } = await request(`/article/byAuthor?authorId=${userInfo.userId}`, "get");
    res = articles;
    avatar = userInfo.avatar;
    authorName = userInfo.nickname;
  } else if (artClass == "userColl") {
    // 收藏的文章
    let { staredArticles } = await request(`/article/getStar?userId=${userInfo.userId}`, "get");
    res = staredArticles;
  } else if (artClass == "userLike") {
    // 赞过的文章
    let { likedArticles } = await request(`/article/getLike?userId=${userInfo.userId}`, "get");
    res = likedArticles;
  }

  //加载文章
  artList = res;
  for (let i = 1, j = 0, len = res.length; j < len; j++) {
    if (i) i = 0;
    else i = 1;
    if (artClass != "userOwn") {
      avatar = res[j].avatar;
      authorName = res[j].authorName;
    }
    let showAuthorInfo = await request(`/user/baseInfo?userId=${res[j].authorId}`, "get");
    showAuthorInfo = showAuthorInfo.user;
    let isLike = res[j].likerList.includes(user.userId + "") ? "icon-yishoucang" : "icon-weishoucang";
    let newNode = document.createElement("div");
    newNode.classList.add("home_show_item");
    newNode.style.animation = `showIn 1s ${j * 0.2}s both`;
    // 懒加载
    let img = document.createElement("img");
    img.setAttribute("num", j);
    img.classList = "show_img";
    img.src = res[j].images[0];
    img.onload = function () {
      newNode.replaceChild(img, newNode.firstElementChild);
    };

    newNode.innerHTML = `
    <img class="show_img" src="./assets/break.jpg">
      <div num="${j}" class="show_title">${res[j].title}</div>
      <div class="show_detail">
        <img from="${res[j].authorId}" class="show_face" src="${avatar}"></img>
        <div from="${res[j].authorId}" class="show_username">${authorName}</div>
        <div num="${j}" class="show_aix">
          <i class='iconfont ${isLike}'></i>
          <span>${res[j].likes}</span>
        </div>
      </div>
    `;
    newNode.onclick = goDetail;
    showPlaceOwn[i].appendChild(newNode);
  }
}

//前往详情页或个人主页
function goDetail(event) {
  if (event.target.getAttribute("num")) {
    //前往详情页
    let index = event.target.getAttribute("num");
    clearUserHome();
    changePage(nowPage, "detail");
    initDetail(artList[index]);
  } else if (event.target.getAttribute("from")) {
    //前往个人主页
    request(`/user/fullInfo?userId=${Number(event.target.getAttribute("from"))}`, "get").then(({ user }) => {
      clearUserHome();
      changePage(nowPage, "userHome");
      initUserHome(user);
    });
  }
}

//切换展示
function clickNavBtn({ target }) {
  if (!target.getAttribute("class").includes("userHome_nav_btn")) return;
  if (target.getAttribute("class").includes("userHome_active")) return;
  navBtn.forEach((btn) => {
    if (btn.getAttribute("class").includes("userHome_active")) {
      btn.classList.remove("userHome_active");
    } else if (target == btn) {
      btn.classList.add("userHome_active");
      nowNav = btn.id;
      renewArt(nowNav);
    }
  });
}

//退出登录
function logout() {
  if (confirm("确定退出登录")) {
    request("/logout", "post", { userId: user.userId }).then((res) => {
      clearUserHome();
      delCookie("userId");
      changePage(nowPage, "login");
    });
  }
}

//前往关注的人
function goToFollows() {
  clearUserHome();
  changePage(nowPage, "follows");
  initFollows(userInfo);
}

//前往粉丝
function goToFans() {
  clearUserHome();
  changePage(nowPage, "fans");
  initFans(userInfo);
}

//前往点赞与收藏
function goTolAc() {
  clearUserHome();
  changePage(nowPage, "likeAColl");
  initlAc(userInfo.userId);
}

//编辑个人信息
function editSelf() {
  request(`/user/baseInfo?userId=${userInfo.userId}`, "get").then(({ user }) => {
    clearUserHome();
    changePage(nowPage, "edit");
    initEdit(user);
  });
}

//前往消息页面
function goToMessage() {
  idList.pop();
  setStack("idList", idList);
  changePage(nowPage, "message");
  initMessage();
  clearUserHome();
}

//发消息
function sendMsg() {
  changePage(nowPage, "send");
  initSend(userInfo.userId);
  clearUserHome();
}

//清理
function clearUserHome() {
  userFace.src = "./assets/break.jpg";
  userName.innerText = "";
  userFollows.innerText = "?";
  userFans.innerText = "?";
  userLike.innerText = "?";
  showPlaceOwn[0].innerHTML = "";
  showPlaceOwn[1].innerHTML = "";
}

//关注
function follow() {
  request("/user/follow", "post", { userId: user.userId, followerId: userInfo.userId }).then((res) => {
    if (res.status === 200) {
      if (user.fans.includes(userInfo.userId)) {
        sendBtn.innerText = "发消息";
        sendBtn.classList = "userHome_sendIfo canSend";
      } else {
        sendBtn.innerText = "已关注";
        sendBtn.classList = "userHome_sendIfo";
      }
      sendBtn.onclick = notFollow;
    }
  });
}

//取消关注
function notFollow() {
  request("/user/cancelFollow", "post", { userId: user.userId, followerId: userInfo.userId }).then((res) => {
    if (res.status === 200) {
      sendBtn.innerText = "关注TA";
      sendBtn.onclick = follow;
      sendBtn.classList = "userHome_sendIfo userHome_follow";
    }
  });
}

//更新栈
function renewIdList(NidList) {
  idList = NidList;
}

export { initUserHome, renewIdList };
