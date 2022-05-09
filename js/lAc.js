import request from "../api/index.js";
import { user } from "../utils/user.js";
import { initUserHome } from "./userHome.js";
import { initDetail } from "./detail.js";
import { setStack } from "../utils/setStackMemory.js";
import { backPage, changePage, nowPage } from "../utils/page.js";

const backBtn = document.querySelector("#lAc_back");
const likePlace = document.querySelector("#lAc_like");
const starPlace = document.querySelector("#lAc_star");
const lAcNav = document.querySelector(".lAcNav");
const likeAColl = document.querySelector(".likeAColl");
const btnList = document.querySelectorAll(".lAcNavItem");

likeAColl.style.height = window.innerHeight + "px";

let lAcStack = [];
let nowState = "zan";

backBtn.onclick = function () {
  starPlace.innerHTML = "";
  likePlace.innerHTML = "";
  lAcStack.pop();
  setStack("lAcStack", lAcStack);
  backPage();
};
likePlace.onclick = clickItem;
starPlace.onclick = clickItem;
lAcNav.onclick = changeState; //切换导航

// 更新获赞与收藏
async function initlAc(id) {
  if (!id) {
    //自动更新
    id = lAcStack.pop();
  }

  lAcStack.push(id);
  setStack("lAcStack", lAcStack);

  checkState();

  let { like } = await request(`/notice/article/like?userId=${id}`, "get");
  let { star } = await request(`/notice/article/star?userId=${id}`, "get");

  likePlace.innerHTML = "";
  starPlace.innerHTML = "";

  // 加载获赞
  for (let i = 0, t = 0, len = like.length; i < len; i++) {
    let articleInfo = like[i].articleInfo;
    let userInfo = like[i].userInfo;
    if (userInfo.userId == user.userId) continue; //不加载自己
    likePlace.innerHTML += `
    <div class="search_users_item" style="animation:rightIn 0.3s ${t * (0.5 / len)}s both;">
      <img from="${userInfo.userId}" class="search_face" src="${userInfo.avatar}">
      <div from="${userInfo.userId}" class="search_userText">
        <div from="${userInfo.userId}" class="userText_name">${userInfo.nickname}</div>
        <div from="${userInfo.userId}" class="userText_description">赞了你的笔记</div>
      </div>
      <div art="${articleInfo.articleId}" class="lAc_ItemRight">
        <img art="${articleInfo.articleId}" class="lAc_img" src="${articleInfo.images[0]}">
        <i art="${articleInfo.articleId}" class='iconfont icon-jinrujiantou'></i>
      </div>
    </div>
    `;
    t++;
  }
  //加载收藏
  for (let i = 0, t = 0, len = star.length; i < len; i++) {
    let articleInfo = star[i].articleInfo;
    let userInfo = star[i].userInfo;
    if (userInfo.userId == user.userId) continue; //不加载自己
    starPlace.innerHTML += `
    <div class="search_users_item" style="animation:rightIn 0.3s ${t * (0.5 / len)}s both;">
      <img from="${userInfo.userId}" class="search_face" src="${userInfo.avatar}">
      <div from="${userInfo.userId}" class="search_userText">
        <div from="${userInfo.userId}" class="userText_name">${userInfo.nickname}</div>
        <div from="${userInfo.userId}" class="userText_description">收藏你的笔记</div>
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

//点击事件
function clickItem({ target }) {
  let from = target.getAttribute("from");
  let art = target.getAttribute("art");

  if (from) {
    goToUserHome(from);
  } else if (art) {
    goToDetail(art);
  }
}

//进入个人主页
function goToUserHome(id) {
  request(`/user/fullInfo?userId=${id}`, "get").then(({ user }) => {
    likePlace.innerHTML = "";
    starPlace.innerHTML = "";
    changePage(nowPage, "userHome");
    initUserHome(user);
  });
}

//进入详情页
function goToDetail(id) {
  request(`/article/byId?articleId=${id}`, "get").then(({ article }) => {
    likePlace.innerHTML = "";
    starPlace.innerHTML = "";
    changePage(nowPage, "detail");
    initDetail(article);
  });
}

//切换导航
function changeState({ target }) {
  if (!target.getAttribute("class").includes("searchNavItem")) return;
  if (target.getAttribute("class").includes("active")) return;
  btnList.forEach((btn) => {
    if (btn == target) {
      btn.classList.add("active");
      nowState = btn.id;
      checkState();
    } else {
      btn.classList.remove("active");
    }
  });
}

//切换状态
function checkState() {
  if (nowState == "zan") {
    likePlace.style.display = "block";
    starPlace.style.display = "none";
  } else {
    likePlace.style.display = "none";
    starPlace.style.display = "block";
  }
}

//获得获赞和收藏数
async function getlAc(id) {
  let { like } = await request(`/notice/article/like?userId=${id}`, "get");
  let { star } = await request(`/notice/article/star?userId=${id}`, "get");
  return like.length + star.length;
}

function renewlAcStack(NlAcStack) {
  lAcStack = NlAcStack;
}

export { initlAc, getlAc, renewlAcStack };
