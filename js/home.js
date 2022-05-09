import { nowPage, changePage } from "../utils/page.js";
import request from "../api/index.js";
import { initDetail } from "./detail.js";
import { initUserHome } from "./userHome.js";
import { user } from "../utils/user.js";
import { initMessage } from "./message.js";

const addArt = document.querySelector("#addArt");
const turnSearch = document.querySelector("#turnSearch");
const showPlace = document.querySelectorAll(".home_show_column");
const homeNav = document.querySelector("#homeNav");
const ownBtn = document.querySelector("#home_own");
const msgBtn = document.querySelector("#home_msg");
const homeView = document.querySelector(".home");
const noMore = document.querySelector("#homeNoMore");

const tagMap = {
  recommend: "推荐",
  food: "美食",
  hufu: "护肤",
  caizhuang: "彩妆",
  travel: "旅游",
  fashion: "时尚",
  gaoxiao: "高效",
};
let nowTag = "recommend";
let whichItem = {}; //发送给详情页面的信息
let page = 0; //分页加载

//动态加载
homeView.addEventListener("scroll", loadList);

//去消息
msgBtn.onclick = function () {
  changePage(nowPage, "message");
  initMessage();
};

//切换顶部导航
homeNav.onclick = function (event) {
  if (event.target == homeNav) return;
  if (event.target.id == nowTag) return;

  let befTag = document.getElementById(nowTag);
  befTag.classList.remove("active");
  event.target.classList.add("active");
  nowTag = event.target.id;
  page = 0;
  renewHome();
};

//切换至个人主页
ownBtn.onclick = function () {
  request(`/user/fullInfo?userId=${user.userId}`, "get").then(({ user }) => {
    changePage(nowPage, "userHome");
    initUserHome(user, true);
  });
};

// 转到发布
addArt.onclick = () => {
  changePage(nowPage, "adding");
};

// 转到搜索
turnSearch.onclick = () => {
  changePage(nowPage, "search");
};

//动态加载函数
function loadList() {
  let hei = homeView.scrollTop + homeView.offsetHeight;
  let bot = homeView.scrollHeight;
  if (bot - hei < 300) {
    if (page) {
      noMore.innerText = "加载中";
      renewHome();
      homeView.removeEventListener("scroll", loadList);
    } else {
      noMore.innerText = "没有更多了";
    }
  }
}

//更新列表
async function renewHome() {
  if (page == 0) {
    showPlace[0].innerHTML = "";
    showPlace[1].innerHTML = "";
  }
  let { articles } = await request(`/article/getHomePageTag?tag=${tagMap[nowTag]}&pages=${page}`, "get");
  if (articles.length == 10) {
    page++;
    noMore.innerText = "没有更多了";
  } else page = 0;
  whichItem = articles;
  let i = 0;
  analyHomeShow(0);
  function analyHomeShow(j) {
    if (j > articles.length - 1) {
      homeView.addEventListener("scroll", loadList);
      return;
    }

    let isLike = articles[j].likerList.includes(user.userId + "") ? "icon-yishoucang" : "icon-weishoucang";
    let newNode = document.createElement("div");
    newNode.classList.add("home_show_item");
    newNode.style.animation = `showIn 1s ${j * 0.2}s both`;
    // 懒加载
    let img = document.createElement("img");
    img.setAttribute("num", j);
    img.classList = "show_img";
    img.src = articles[j].images[0];
    img.onload = function () {
      newNode.replaceChild(img, newNode.firstElementChild);
    };

    newNode.innerHTML += `
      <img class="show_img" src="./assets/break.jpg">
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
    analyHomeShow(j + 1);
  }
}

// 前往详情或个人主页
function goDetail(event) {
  if (event.target.getAttribute("num")) {
    //前往详情
    let index = event.target.getAttribute("num");
    changePage(nowPage, "detail");
    initDetail(whichItem[index]);
  } else if (event.target.getAttribute("from")) {
    //前往个人主页
    changePage(nowPage, "userHome");
    request(`/user/fullInfo?userId=${Number(event.target.getAttribute("from"))}`, "get").then((res) => {
      if (res.status === 200) {
        initUserHome(res.user);
      }
    });
  }
}

export { renewHome };
