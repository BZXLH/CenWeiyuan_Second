import { renewHome } from "../js/home.js";
import { initUserHome, renewIdList } from "../js/userHome.js";
import { initDetail, renewDetailList } from "../js/detail.js";
import { initFollows, renewFollowsStack } from "../js/follows.js";
import { initFans, renewFansStack } from "../js/fans.js";
import { initlAc, renewlAcStack } from "../js/lAc.js";
import { initEdit } from "../js/edit.js";
import { initMessage } from "../js/message.js";
import { initLetter } from "../js/letter.js";
import { initComMe } from "../js/comMe.js";
import { renewUser, user } from "./user.js";
import { renewSidList, initSend } from "../js/send.js";

let deepUserHome = 0; //判断是否带导航的个人主页

function setDeepUserHome(num) {
  deepUserHome += num;
}

// 跳转页面
function changePage(from, to) {
  renewUser(user.userId);
  if (to == "home") renewHome();
  if (to == "userHome" && (deepUserHome || from == "home" || from == "message")) {
    deepUserHome++;
  }
  const fromP = document.querySelector(`.${from}`);
  const toP = document.querySelector(`.${to}`);
  fromP.style.display = "none";
  toP.style.display = "block";

  if (to == "home" || to == "message") {
    if (befPages[befPages.length - 1] == "home" || befPages[befPages.length - 1] == "message") {
      befPages.pop();
    }
    if (from != "home" && from != "message" && from != "userHome") {
      befPages.push(from);
    }
  } else befPages.push(from);

  nowPage = to;
  sessionStorage.setItem(
    "pagesMemory",
    JSON.stringify({
      deepUserHome,
      nowPage,
      befPages,
    })
  );

  sessionStorage.setItem("userMemory", JSON.stringify(user));
}

//返回之前的页面
function backPage() {
  if (befPages.length === 0) return;
  renewUser(user.userId);

  const fromP = document.querySelector(`.${nowPage}`);
  let to = befPages.pop();

  if (to == "register") to = "home";
  if (to == "home") renewHome();
  else if (to == "userHome") {
    let befP = befPages[befPages.length - 1];
    if (deepUserHome && (befP == "home" || befP == "message")) {
      initUserHome(null, true);
      deepUserHome = 1;
    } else {
      deepUserHome--;
      initUserHome();
    }
  } else if (to == "detail") initDetail();
  else if (to == "follows") initFollows();
  else if (to == "fans") initFans();
  else if (to == "likeAColl") initlAc();
  else if (to == "edit") initEdit();
  else if (to == "letter") initLetter();
  else if (to == "message") initMessage();
  else if (to == "comMe") initComMe();
  else if (to == "send") initSend();

  const toP = document.querySelector(`.${to}`);
  fromP.style.display = "none";
  toP.style.display = "block";
  nowPage = to;
  sessionStorage.setItem(
    "pagesMemory",
    JSON.stringify({
      deepUserHome,
      nowPage,
      befPages,
      user,
    })
  );

  sessionStorage.setItem("userMemory", JSON.stringify(user));
}

// 设置页面
function setPage(page) {
  let pagesMemory = JSON.parse(sessionStorage.getItem("pagesMemory"));
  let stackMemory = JSON.parse(sessionStorage.getItem("stackMemory"));
  if (pagesMemory) {
    befPages = pagesMemory.befPages || [];
    page = nowPage = pagesMemory.nowPage || "";
    deepUserHome = pagesMemory.deepUserHome || 0;
    if (stackMemory) {
      renewIdList(stackMemory.idList);
      renewDetailList(stackMemory.detailList);
      renewFollowsStack(stackMemory.followsStack);
      renewFansStack(stackMemory.fansStack);
      renewlAcStack(stackMemory.lAcStack);
      renewSidList(stackMemory.SidList);
    }
  }

  if (page == "home") renewHome();
  else if (page == "detail") initDetail();
  else if (page == "follows") initFollows();
  else if (page == "fans") initFans();
  else if (page == "likeAColl") initlAc();
  else if (page == "edit") initEdit();
  else if (page == "letter") initLetter();
  else if (page == "message") initMessage();
  else if (page == "comMe") initComMe();
  else if (page == "send") initSend();
  else if (page == "userHome") {
    let MidList = sessionStorage.getItem("stackMemory");
    let befP = befPages[befPages.length - 1];
    if (deepUserHome && (befP == "home" || befP == "message")) {
      initUserHome(null, true, MidList);
    } else {
      initUserHome(null, false, MidList);
    }
  }

  const pageP = document.querySelector(`.${page}`);
  pageP.style.display = "block";
  nowPage = page;
}

// 当前页面
let nowPage = "";
// 之前的页面
let befPages = [];

export { backPage, nowPage, changePage, setPage, setDeepUserHome, deepUserHome };
