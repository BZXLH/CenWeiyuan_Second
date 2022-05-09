import { user } from "../utils/user.js";
import { changePage, nowPage } from "../utils/page.js";
import { initlAc } from "./lAc.js";
import { initUserHome } from "./userHome.js";
import { initFans } from "./fans.js";
import { initSend } from "./send.js";
import { initLetter } from "./letter.js";
import { initComMe } from "./comMe.js";
import request from "../api/index.js";

const lAcBtn = document.querySelector("#msg_lAc");
const followBtn = document.querySelector("#msg_follows");
const commentBtn = document.querySelector("#msg_comments");
const letterBtn = document.querySelector("#sendMsg");
const homeBth = document.querySelector("#msg_home");
const userBtn = document.querySelector("#msg_own");
const msgPlace = document.querySelector(".recent");

followBtn.onclick = goToFans;
lAcBtn.onclick = goTolAc;
letterBtn.onclick = goToLetter;
homeBth.onclick = function () {
  changePage(nowPage, "home");
  msgPlace.innerHTML = "";
};
userBtn.onclick = function () {
  changePage(nowPage, "userHome");
  initUserHome(user, true);
  msgPlace.innerHTML = "";
};
commentBtn.onclick = function () {
  changePage(nowPage, "comMe");
  initComMe();
};

//初始化
function initMessage() {
  msgPlace.innerHTML = "";
  //更新最近消息
  request(`/chat/getList?userId=${user.userId}`, "get").then(({ chatList }) => {
    chatList.forEach((eachUser, index) => {
      let newNode = document.createElement("div");
      newNode.classList.add("search_users_item");
      newNode.setAttribute("userId", eachUser.userId);
      newNode.style.animation = `rightIn 0.3s ${index * 0.1}s both`;

      newNode.onclick = goToSend;
      newNode.innerHTML += `
        <img class="search_face" src="${eachUser.avatar}">
        <div class="search_userText">
          <div class="userText_name">${eachUser.nickname}</div>
          ${eachUser.description ? `<div class="userText_description">${eachUser.description}</div>` : ""}
        </div>
        <i class='iconfont icon-jinrujiantou msgIcon'></i>
        `;
      msgPlace.appendChild(newNode);
    });
  });
}

function goToFans() {
  changePage(nowPage, "fans");
  initFans(user);
  msgPlace.innerHTML = "";
}

function goTolAc() {
  changePage(nowPage, "likeAColl");
  initlAc(user.userId);
  msgPlace.innerHTML = "";
}

//前往发私信页面
function goToLetter() {
  changePage(nowPage, "letter");
  initLetter();
  msgPlace.innerHTML = "";
}

//前往聊天
function goToSend({ currentTarget }) {
  let id = currentTarget.getAttribute("userId");
  changePage(nowPage, "send");
  initSend(id);
}

export { initMessage };
