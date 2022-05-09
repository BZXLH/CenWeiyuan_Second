import { backPage, changePage, nowPage } from "../utils/page.js";
import { user } from "../utils/user.js";
import { initUserHome } from "./userHome.js";
import { setStack } from "../utils/setStackMemory.js";
import request from "../api/index.js";

document.querySelector(".detail").style.height = window.innerHeight + "px";

const authorFace = document.querySelector(".datail_authorFace");
const authorName = document.querySelector(".detail_name");
const detailBtn = document.querySelector("#detail_back");
const swiper = document.querySelector(".rotation_swiper");
const view = document.querySelector(".rotation_view");
const swiperBtnList = document.querySelector(".rotation_btnList");
const followBtn = document.querySelector(".detail_follow");
const commentsList = document.querySelector(".commentsList");
const commentInput = document.querySelector(".detail_input");
const inputBtn = document.querySelector("#detail_com");
const axpl = document.querySelector(".detail_write_right");
const sendBtn = document.querySelector(".detail_input_sure");
const articleLike = document.querySelector("#detail_aix");
const start = document.querySelector("#detail_col");
const authorBtn = document.querySelector(".detail_author");

let downX, moveX;
let photoList = [];
let viewPage = 0;
let commentsPage = 0;
let commentsArr;
let comId = null; //选中的评论的id

// 文章信息
let detailIfo = {
  articleId: null,
  authorId: null,
  content: "",
  images: [],
  likerList: [],
  likes: null,
  postDate: "",
  reviewList: [],
  reviews: null,
  starerList: [],
  stars: null,
  tags: [],
  title: "",
};
// 作者信息
let authorIfo = {};
let detailList = [];

//评论
commentInput.onfocus = toInput;
commentInput.addEventListener("focus", checkInputState);
commentInput.oninput = checkInputState;
function checkInputState(event) {
  if (!event.target.value) {
    sendBtn.classList.remove("issure");
    sendBtn.innerText = "取消";
  } else {
    sendBtn.classList.add("issure");
    sendBtn.innerText = "发送";
  }
}
inputBtn.onclick = toInput;

//评论状态
function toInput() {
  axpl.style.display = "none";
  sendBtn.style.display = "block";
  commentInput.focus();
}
//取消评论状态
function clearInput() {
  commentInput.value = "";
  axpl.style.display = "flex";
  sendBtn.style.display = "none";
  commentInput.placeholder = "说点什么";
}

//发送/取消评论
sendBtn.onclick = function () {
  if (sendBtn.innerText == "取消") clearInput();
  else {
    let inpVal = commentInput.value;
    clearInput();
    request(
      "/review",
      "post",
      {
        authorId: user.userId,
        replyToArticleId: detailIfo.articleId,
        parentReviewId: comId,
        authorId: detailIfo.authorId,
        content: inpVal,
      },
      "json"
    ).then((res) => {
      if (res.status === 200) {
        if (comId) comId = null;
        renewComments();
      }
    });
  }
};
// 滑动
view.addEventListener("touchstart", ({ touches }) => {
  downX = touches[0].clientX;
  view.addEventListener("touchmove", moveFun);
});

// 拖动回调
function moveFun({ touches }) {
  moveX = touches[0].clientX;
  let reX = moveX - downX;
  if (reX < -100) {
    view.removeEventListener("touchmove", moveFun);
    swiperPage(viewPage + 1);
  } else if (reX > 100) {
    view.removeEventListener("touchmove", moveFun);
    swiperPage(viewPage - 1);
  }
}

// 换页
function swiperPage(nextPage) {
  const swiperBtn = document.querySelectorAll(".rotation_btn");
  if (nextPage < 0 || nextPage > photoList.length - 1) return;
  swiper.style.transform = `translate(-${nextPage * 100}vw,0)`;

  for (let i = 0, len = swiperBtn.length; i < len; i++) {
    if (i === nextPage) {
      swiperBtn[i].classList.add("active");
    } else {
      swiperBtn[i].classList.remove("active");
    }
  }
  viewPage = nextPage;
}

//获取详情信息，更新页面
async function initDetail(data) {
  if (!data) {
    let LdetailList = detailList[detailList.length - 1];
    data = await request(`/article/byId?articleId=${LdetailList}`, "get");
    detailList.pop();
    data = data.article;
  }
  swiper.innerHTML = "";
  swiperBtnList.innerHTML = "";
  detailIfo = data;
  detailList.push(data.articleId);
  setStack("detailList", detailList);
  photoList = detailIfo.images;
  // 获取作者信息
  authorIfo = await request(`/user/fullInfo?userId=${detailIfo.authorId}`, "get");
  authorIfo = authorIfo.user;
  //更新作者头像和名字
  authorFace.src = authorIfo.avatar;
  authorName.innerText = authorIfo.nickname;
  //更新关注按钮状态或删除文章
  followBtn.classList = "detail_follow";
  if (authorIfo.fans.includes(Number(user.userId))) {
    followBtn.classList.add("have");
    followBtn.innerText = "已关注";
  } else if (user.userId == detailIfo.authorId) {
    followBtn.classList.add("remove");
    followBtn.innerText = "删除";
  } else {
    followBtn.classList.remove("have");
    followBtn.innerText = "关注";
  }
  //更新轮播图即进度条
  photoList.forEach((photo) => {
    swiperBtnList.innerHTML += ` <span class="rotation_btn"></span>`;
    swiper.innerHTML += `<img class="rotation_img" src="${photo}">`;
  });
  swiperPage(0);
  //更新标题和内容
  document.querySelector(".detail_title").innerText = detailIfo.title;
  document.querySelector(".detail_content").innerText = detailIfo.content;
  //更新标签
  document.querySelector(".detail_tagList").innerHTML = "";
  detailIfo.tags.forEach((tag) => {
    document.querySelector(".detail_tagList").innerHTML += `
      <span class="detail_tag">#${tag}</span>
      `;
  });
  //更新发布时间
  document.querySelector(".detail_time").innerText = getTime(detailIfo.postDate);
  //更新评论
  renewComments();
  //更新星星
  document.querySelector("#detail_col_num").innerText = detailIfo.stars;
  if (detailIfo.starerList.includes(user.userId + "")) {
    start.classList = "iconfont icon-yishoucang1";
  } else {
    start.classList = "iconfont icon-weishoucang1";
  }
  //更新爱心
  document.querySelector("#detail_aix_num").innerText = detailIfo.likes;
  if (detailIfo.likerList.includes(user.userId + "")) {
    articleLike.classList = "iconfont icon-yishoucang";
  } else {
    articleLike.classList = "iconfont icon-weishoucang";
  }
}

// 更新评论函数
function renewComments() {
  commentsPage = 0;
  commentsArr = [];
  commentsList.innerHTML = "";
  request(`/article/byId?articleId=${detailIfo.articleId}`, "get").then((res) => {
    document.querySelector("#detail_com_num").innerText = document.querySelector(".detail_sum").innerText = res.article.reviews;
  });
  request(`/review/byArticle?articleId=${detailIfo.articleId}&pages=${commentsPage}`, "get").then((res) => {
    commentsArr = res.reviews;
    let Fani = 0;
    let Sani = 0;
    analyCom(0);
    function analyCom(comObjIndex) {
      if (comObjIndex > commentsArr.length - 1) return;
      let comObj = commentsArr[comObjIndex];
      // 添加评论
      request(`/user/baseInfo?userId=${comObj.authorId}`, "get").then((res) => {
        let reviewerName = res.user.nickname;
        let reviewerFace = res.user.avatar;
        //是否具有删除评论功能
        let showDel = comObj.authorId == user.userId ? "" : 'style="display:none;"';
        let isLike = comObj.likerList.includes(user.userId + "") ? "icon-yishoucang" : "icon-weishoucang";
        let newLi = document.createElement("li");
        newLi.classList.add("Fcomment");
        newLi.style = `animation: showIn 0.3s ${Fani++ * 0.2}s both;`;
        newLi.innerHTML = `
          <div class="Fcomment_content">
            <img class="datail_authorFace" face="${comObj.authorId}" src="${reviewerFace}">
            <div class="comment_text">
              <div comName="${reviewerName}" comId="${comObj.reviewId}" class="comment_name">${reviewerName}
                <span clear="${comObj.reviewId}" ${showDel} class="comment_clear">删除该评论</span>
              </div> 
              <div comName="${reviewerName}" comId="${comObj.reviewId}" class="comment_content">${comObj.content}</div>
              <div comName="${reviewerName}" comId="${comObj.reviewId}" class="comment_time">${getTime(comObj.postDate)}</div>
            </div>
            <div class="comment_aix">
              <div><i aix="${comObj.reviewId}" aixIndex="${Fani + Sani - 1}"
              class='iconfont ${isLike}' style="transition: 0.3s;"></i></div>
              <div class="comment_aixNum comment_like">${comObj.likes}</div>
            </div>
          </div>
          `;
        if (comObj.reviewList.length) {
          let childComList = comObj.reviewList;
          childComList.forEach((childCom, index) => {
            request(`/user/baseInfo?userId=${childCom.authorId}`, "get").then((res) => {
              let reviewerName = res.user.nickname;
              let reviewerFace = res.user.avatar;
              //是否具有删除评论功能
              let showDel = childCom.authorId == user.userId ? "" : 'style="display:none;"';
              let isLike = childCom.likerList.includes(user.userId + "") ? "icon-yishoucang" : "icon-weishoucang";
              newLi.innerHTML += `
                <div class="Scomment" style="animation: showIn 0.3s ${(Fani / 5 + Sani++) * (0.5 / childComList.length)}s both; ">
                  <img class="datail_authorFace" face="${childCom.authorId}" src="${reviewerFace}"> 
                  <div class="comment_text">
                    <div class="comment_name">${reviewerName} 
                       <span clear="${childCom.reviewId}" ${showDel} class="comment_clear">删除该评论</span>
                     </div>
                    <div class="comment_content">${childCom.content}
                    <div class="comment_time">${getTime(childCom.postDate)}</div>
                    </div>
                  </div>
                  <div class="comment_aix">
                    <div><i aix="${childCom.reviewId}" aixIndex="${Fani + Sani - 1}"
                    class='iconfont ${isLike}' style="transition: 0.3s;"></i></div>
                    <div class="comment_aixNum comment_like">${childCom.likes}</div>
                  </div>
                </div>
                `;
              if (index == childComList.length - 1) {
                analyCom(comObjIndex + 1);
                commentsList.appendChild(newLi);
              }
            });
          });
        } else {
          analyCom(comObjIndex + 1);
          commentsList.appendChild(newLi);
        }
      });
    }
  });
}

// 回复评论或点赞评论或删除评论
commentsList.onclick = function ({ target }) {
  //点赞
  if (target.getAttribute("clear")) {
    request("/review/delete", "post", { reviewId: target.getAttribute("clear") }, "json").then((res) => {
      renewComments();
    });
  } else if (target.getAttribute("comName")) {
    //评论
    toInput();
    comId = Number(target.getAttribute("comId"));
    commentInput.placeholder = "回复 " + target.getAttribute("comName");
  } else if (target.getAttribute("aix")) {
    // 取消点赞
    if (target.getAttribute("class").includes("icon-yishoucang")) {
      request("/review/unlike", "post", { userId: user.userId, reviewId: target.getAttribute("aix") }).then(() => {
        target.classList = "iconfont icon-weishoucang";
        document.querySelectorAll(".comment_like")[Number(target.getAttribute("aixIndex"))].innerText =
          Number(document.querySelectorAll(".comment_like")[Number(target.getAttribute("aixIndex"))].innerText) - 1;
      });
    } else {
      //点赞
      request("/review/like", "post", { userId: user.userId, reviewId: target.getAttribute("aix") }).then((res) => {
        target.classList = "iconfont icon-yishoucang";
        document.querySelectorAll(".comment_like")[Number(target.getAttribute("aixIndex"))].innerText =
          Number(document.querySelectorAll(".comment_like")[Number(target.getAttribute("aixIndex"))].innerText) + 1;
      });
    }
  } else if (target.getAttribute("face")) {
    request(`/user/fullInfo?userId=${target.getAttribute("face")}`, "get").then(({ user }) => {
      changePage(nowPage, "userHome");
      initUserHome(user);
    });
  }
};

//点关注或删除
followBtn.onclick = function () {
  let classArr = followBtn.getAttribute("class");
  if (classArr.includes("remove")) {
    request("/article/delete", "post", { articleId: detailIfo.articleId }).then((res) => {
      if (res.status === 200) {
        backPage();
      }
    });
  } else if (classArr.includes("have")) {
    request("/user/cancelFollow", "post", { userId: user.userId, followerId: detailIfo.authorId }).then((res) => {
      if (res.status === 200) {
        followBtn.classList.remove("have");
        followBtn.innerText = "关注";
      }
    });
  } else if (!classArr.includes("have")) {
    request("/user/follow", "post", { userId: user.userId, followerId: detailIfo.authorId }).then((res) => {
      if (res.status === 200) {
        followBtn.classList.add("have");
        followBtn.innerText = "已关注";
      }
    });
  }
};

//点星星
start.onclick = function () {
  // 取消星星
  if (start.getAttribute("class").includes("icon-yishoucang1")) {
    request("/article/unlike", "post", { userId: user.userId, articleId: detailIfo.articleId }, "json").then(() => {
      start.classList = "iconfont icon-weishoucang1";
      document.querySelector("#detail_col_num").innerText = Number(document.querySelector("#detail_col_num").innerText) - 1;
    });
  } else {
    //点亮星星
    request("/article/star", "post", { userId: user.userId, articleId: detailIfo.articleId }, "json").then(() => {
      start.classList = "iconfont icon-yishoucang1";
      document.querySelector("#detail_col_num").innerText = Number(document.querySelector("#detail_col_num").innerText) + 1;
    });
  }
};

//点爱心
articleLike.onclick = function () {
  // 取消爱心
  if (articleLike.getAttribute("class").includes("icon-yishoucang")) {
    request("/article/unlike", "post", { userId: user.userId, articleId: detailIfo.articleId }, "json").then(() => {
      articleLike.classList = "iconfont icon-weishoucang";
      document.querySelector("#detail_aix_num").innerText = Number(document.querySelector("#detail_aix_num").innerText) - 1;
    });
  } else {
    //点亮爱心
    request("/article/like", "post", { userId: user.userId, articleId: detailIfo.articleId }, "json").then(() => {
      articleLike.classList = "iconfont icon-yishoucang";
      document.querySelector("#detail_aix_num").innerText = 1 + Number(document.querySelector("#detail_aix_num").innerText);
    });
  }
};

//跳转个人主页（作者）
authorBtn.onclick = function () {
  changePage(nowPage, "userHome");
  initUserHome(authorIfo);
};

// 整合时间函数
function getTime(befTime) {
  let time = new Date(befTime);
  let timeStr = time.getMonth() + 1 + "-";
  timeStr += time.getDate();
  return timeStr;
}

// 返回
detailBtn.onclick = function () {
  detailList.pop();
  setStack("detailList", detailList);
  backPage();
};

//更新详情栈
function renewDetailList(NdetailList) {
  detailList = NdetailList;
}

export { initDetail, renewDetailList };
