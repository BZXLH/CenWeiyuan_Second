import { nowPage, changePage, backPage } from "../utils/page.js";
import { initDetail } from "./detail.js";
import { user } from "../utils/user.js";
import { initUserHome } from "./userHome.js";
import request from "../api/index.js";

const searchBackBtn = document.querySelector("#search_back");
const searchBtn = document.querySelector(".search_btn");
const searchInput = document.querySelector(".search_input");
const searchNav = document.querySelector("#searchNav");
const showPlace = document.querySelectorAll(".search_show_column");
const searchUserPlace = document.querySelector("#search_users");
const searchNone = document.querySelector("#searchNone");

let inputteimer = null;
let nowNav = "wenzhang";
let artList = [];

searchNav.onclick = changeSearchNav;
searchBtn.onclick = searching;
searchInput.oninput = autoSearch;
// 返回主页
searchBackBtn.onclick = function chaSrhTar() {
  backPage();
  initSearch();
};

//初始化函数
function initSearch() {
  showPlace[0].innerHTML = "";
  showPlace[1].innerHTML = "";
  searchInput.value = "";
  searchUserPlace.innerHTML = "";
}
//切换搜索对象函数
function changeSearchNav({ target }) {
  if (target.id == "searchNav") return;
  let searchNavBtn = document.querySelectorAll(".searchNavItem");
  searchNavBtn.forEach((navItem) => {
    if (navItem == target) {
      if (navItem.id == "search_wenzhang") {
        nowNav = "wenzhang";
        document.querySelector("#search_art").style.display = "flex";
        document.querySelector("#search_users").style.display = "none";
      } else {
        nowNav = "yonghu";
        document.querySelector("#search_art").style.display = "none";
        document.querySelector("#search_users").style.display = "block";
      }
      navItem.classList.add("active");
    } else {
      navItem.classList.remove("active");
    }
  });
  if (searchInput.value) checkSearch();
}

//带防抖的自动搜索函数
function autoSearch() {
  if (inputteimer) clearTimeout(inputteimer);
  if (!searchInput.value) return;
  inputteimer = setTimeout(searching, 700);
}

//搜索函数
function searching() {
  if (!searchInput.value) return;
  showPlace[0].innerHTML = "";
  showPlace[1].innerHTML = "";
  request(`/search/byArticle?keyWord=${searchInput.value}`, "get", null, true).then(({ articles }) => {
    artList = articles;
    let i = 0;
    analySearchArt(0);
    function analySearchArt(j) {
      if (j > articles.length - 1) {
        checkSearch();
        return;
      }
      let isLike = articles[j].likerList.includes(user.userId + "") ? "icon-yishoucang" : "icon-weishoucang";
      let newNode = document.createElement("div");
      let isUrl = /^http/; //用于判断图片是否为http型，不是不展示
      newNode.classList.add("home_show_item");
      newNode.style.animation = `showIn 1s ${j * 0.2}s both`;
      newNode.innerHTML = `
            <img num="${j}" class="show_img" src="${
        isUrl.exec(articles[j].images[0]) ? articles[j].images[0] : "./assets/break.jpg"
      }">
            <div num="${j}" class="show_title">${articles[j].title}</div>
            <div class="show_detail">
              <img from="${articles[j].authorId}" class="show_face" src="${articles[j].avatar}"></img>
              <div from="${articles[j].authorId}" class="show_username">${articles[j].authorName}</div>
              <div num="${j}" class="show_aix">
                <i class='iconfont ${isLike}'></i>
                <span>${articles[j].likes}</span>
              </div>
            </div>
            `;
      newNode.onclick = goDetail;
      showPlace[i].appendChild(newNode);
      if (i) i = 0;
      else i = 1;
      analySearchArt(j + 1);
    }
  });

  searchUserPlace.innerHTML = "";
  request(`/search/byUser?keyWord=${searchInput.value}`, "get").then(({ users }) => {
    users.forEach((eachUser, index) => {
      let newNode = document.createElement("div");
      newNode.classList.add("search_users_item");
      newNode.setAttribute("userId", eachUser.userId);
      newNode.style.animation = `rightIn 0.3s ${index * 0.1}s both`;
      let isFollow = user.follows.includes(eachUser.userId) ? "已关注" : "关注";
      let isFollowClass = isFollow == "已关注" ? "haveFollow" : "";

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
          class="search_followBtn ${isFollowClass}">${isFollow}</div>
        `;
      searchUserPlace.appendChild(newNode);
    });
    checkSearch();
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
  });
}

//关注函数
function followOther(target) {
  let targetId = Number(target.getAttribute("guanzhu"));
  let targetIndex = Number(target.getAttribute("guanzhuIndex"));
  //关注或取消关注
  request("/user/follow", "post", { userId: user.userId, followerId: targetId }).then((res) => {
    let followBtn = document.querySelectorAll(".search_followBtn")[targetIndex];
    if (res.status === 200) {
      //已关注
      followBtn.classList.add("haveFollow");
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

//前往详情页
function goDetail(event) {
  if (event.target.getAttribute("num")) {
    let index = event.target.getAttribute("num");
    changePage(nowPage, "detail");
    initDetail(artList[index]);
  }
}

//检测搜索内容是否为空
function checkSearch() {
  if (!showPlace[0].innerHTML && !showPlace[0].innerHTML && nowNav == "wenzhang") {
    searchNone.style.display = "block";
  } else if (!searchUserPlace.innerHTML && nowNav == "yonghu") {
    searchNone.style.display = "block";
  } else searchNone.style.display = "none";
}
