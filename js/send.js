import { user } from "../utils/user.js";
import { initUserHome } from "./userHome.js";
import { changePage, nowPage, backPage } from "../utils/page.js";
import { sendMessage } from "./ws.js";
import { setStack } from "../utils/setStackMemory.js";
import request from "../api/index.js";

const backBtn = document.querySelector("#send_back");
const title = document.querySelector("#send_title");
const sendPlace = document.querySelector(".send_main");
const sendBtn = document.querySelector(".sendBtn");
const sendInput = document.querySelector("#sendInput");

let targetInfo = {};
let idList = [];
let page = 1;

//返回
backBtn.onclick = function () {
  idList.pop();
  setStack("SidList", idList);
  backPage();
  clearSend();
};

sendPlace.onclick = goToUserHome; //点头像跳转到个人主页
sendBtn.onclick = sendMsg;
sendInput.oninput = function () {
  if (sendInput.value) {
    sendBtn.style.display = "block";
  } else {
    sendBtn.style.display = "none";
  }
};

//清除聊天页面
function clearSend() {
  sendPlace.innerHTML = "";
  sendInput.value = "";
  sendBtn.style.display = "none";
}

//初始化私信页面
async function initSend(id) {
  if (!id) {
    id = idList.pop();
  }

  //获取对方信息
  targetInfo = await request(`/user/fullInfo?userId=${id}`, "get");
  targetInfo = targetInfo.user;
  idList.push(targetInfo.userId);
  setStack("SidList", idList);

  //更新顶部名字
  title.innerHTML = targetInfo.nickname;
  //更新聊天记录
  sendPlace.innerHTML = "";
  request(`/chat/getRecord?userId=${user.userId}&receiverId=${targetInfo.userId}&page=${page}`, "get").then(({ newRecord }) => {
    newRecord.forEach((msg, index) => {
      let newNode = document.createElement("div");
      let face = "";
      newNode.classList = "sendItem";
      if (msg.userId == user.userId) {
        newNode.classList.add("reItem");
        face = user.avatar;
        newNode.style.animation = `MrightIn 0.3s ${index * (0.5 / newRecord.length)}s both`;
      } else {
        face = targetInfo.avatar;
        newNode.style.animation = `MleftIn 0.3s ${index * (0.5 / newRecord.length)}s both`;
      }
      newNode.innerHTML = `
        <img class="sendImg" from="${msg.userId}" src="${face}">
        <div class="sendText">${msg.message}</div>
        `;
      sendPlace.appendChild(newNode);
    });
    sendPlace.scrollTop = sendPlace.scrollHeight;
  });
}

//发送消息
function sendMsg() {
  let msg = sendInput.value;
  sendInput.value = "";
  sendBtn.style.display = "none";
  request("/chat/send", "post", { userId: user.userId, receiverId: targetInfo.userId, message: msg }).then((res) => {
    if (res.status === 200) {
      let msg = res.newMessage;
      let newNode = document.createElement("div");
      newNode.classList = "sendItem reItem";
      newNode.style.animation = `MrightIn 0.3s both`;
      newNode.innerHTML = `
      <img class="sendImg" src="${user.avatar}">
      <div class="sendText">${msg.message}</div>
      `;
      sendPlace.appendChild(newNode);
      sendPlace.scrollTop = sendPlace.scrollHeight;
      sendMessage(user.userId, targetInfo.userId, msg.message);
    }
  });
}

//追加对方信息
function renewMsg(msg) {
  let newNode = document.createElement("div");
  newNode.classList = "sendItem";
  newNode.style.animation = `MleftIn 0.3s both`;
  newNode.innerHTML = `
  <img class="sendImg" src="${targetInfo.avatar}">
  <div class="sendText">${msg}</div>
  `;
  sendPlace.appendChild(newNode);
  sendPlace.scrollTop = sendPlace.scrollHeight;
}

//前往个人主页
function goToUserHome({ target }) {
  let from = Number(target.getAttribute("from"));
  if (from != targetInfo.userId) {
    return;
  }
  changePage(nowPage, "userHome");
  initUserHome(targetInfo);
}

function renewSidList(NidList) {
  idList = NidList;
}

export { initSend, renewMsg, renewSidList };
