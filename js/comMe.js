import { changePage, backPage, nowPage } from "../utils/page.js";
import { initDetail } from "./detail.js";
import { initUserHome } from "./userHome.js";
import request from "../api/index.js";
import { user } from "../utils/user.js";

const backBtn = document.querySelector("#comMe_back");
const showPlace = document.querySelector("#comMeShow");

backBtn.onclick = function () {
  showPlace.innerHTML = "";
  backPage();
};
showPlace.onclick = clickItem;

// 更新评论
async function initComMe() {
  let { like } = await request(`/notice/comment?userId=${user.userId}`, "get");
  showPlace.innerHTML = "";

  for (let i = 0, t = 0, len = like.length; i < len; i++) {
    let act = "";
    if (like[i].reviews.parentReviewId) act = "回复了你的评论";
    else act = "评论了你的笔记";

    let articleInfo = like[i].articleInfo;
    let userInfo = like[i].userInfo;
    if (userInfo.userId == user.userId) continue; //不加载自己
    showPlace.innerHTML += `
    <div class="search_users_item" style="animation:rightIn 0.3s ${t * (0.5 / len)}s both;">
      <img from="${userInfo.userId}" class="search_face" src="${userInfo.avatar}">
      <div from="${userInfo.userId}" class="search_userText">
        <div from="${userInfo.userId}" class="userText_name">${userInfo.nickname}</div>
        <div from="${userInfo.userId}" class="userText_description">${act}</div>
      </div>
      <div art="${articleInfo.articleId}" class="lAc_ItemRight">
        <img art="${articleInfo.articleId}" class="lAc_img" src="${articleInfo.images[0]}">
        <i art="${articleInfo.articleId}" class='iconfont icon-jinrujiantou'></i>
      </div>
    </div>
    `;
    t++;
  }
}

function clickItem({ target }) {
  let from = target.getAttribute("from");
  let art = target.getAttribute("art");

  if (from) {
    goToUserHome(from);
  } else if (art) {
    goToDetail(art);
  }
}

function goToDetail(id) {
  request(`/article/byId?articleId=${id}`, "get").then(({ article }) => {
    showPlace.innerHTML = "";
    changePage(nowPage, "detail");
    initDetail(article);
  });
}

function goToUserHome(id) {
  request(`/user/fullInfo?userId=${id}`, "get").then(({ user }) => {
    showPlace.innerHTML = "";
    changePage(nowPage, "userHome");
    initUserHome(user);
  });
}

export { initComMe };
