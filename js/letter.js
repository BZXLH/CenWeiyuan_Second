import { changePage, nowPage, backPage } from "../utils/page.js";
import { initSend } from "./send.js";
import { user } from "../utils/user.js";
import request from "../api/index.js";

const letterPlace = document.querySelector("#letter_list");
const backBtn = document.querySelector("#letter_back");

// 返回
backBtn.onclick = function () {
  backPage();
  clearLetter();
};

//清空列表
function clearLetter() {
  letterPlace.innerHTML = "";
}

// 初始化私信对象
function initLetter() {
  letterPlace.innerHTML = "";
  let followsList = user.follows;
  let fansList = user.fans;
  let t = 0;
  let fragment = document.createDocumentFragment();
  analyMutual(0);

  async function analyMutual(idIndex) {
    if (idIndex > followsList.length - 1) {
      letterPlace.appendChild(fragment);
      return;
    }

    if (fansList.includes(followsList[idIndex])) {
      let other = await request(`/user/fullInfo?userId=${followsList[idIndex]}`, "get");
      other = other.user;
      let newNode = document.createElement("div");
      newNode.classList = "search_users_item";
      newNode.style.animation = `rightIn 0.3s ${t * 0.2}s both`;
      newNode.setAttribute("from", other.userId);
      newNode.onclick = startSend;
      newNode.innerHTML += `
          <img class="search_face" src="${other.avatar}">
          <div  class="search_userText">
            <div  class="userText_name" style="font-size:large;">${other.nickname}</div>
          </div>
          <div class="lAc_ItemRight">
            <i class='iconfont icon-jinrujiantou'></i>
          </div>
        `;
      fragment.appendChild(newNode);
      t++;
      analyMutual(idIndex + 1);
    } else analyMutual(idIndex + 1);
  }
}

//开始发消息
function startSend({ currentTarget }) {
  clearLetter();
  changePage(nowPage, "send");
  initSend(currentTarget.getAttribute("from"));
}

export { initLetter };
