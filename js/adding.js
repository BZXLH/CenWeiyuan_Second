import { backPage } from "../utils/page.js";
import request from "../api/index.js";
import { user } from "../utils/user.js";

const fileImg = document.querySelector("#fileImg");
const imgPlace = document.querySelector(".add_photo");
const back = document.querySelector("#adding_back");
const addTopic = document.querySelector("#addTopic");
const tagList = document.querySelector(".readyTag");
const tagText = document.querySelector("#tagText");
const pop = document.querySelector("#tagPop");
const sure = document.querySelector("#tagSure");
const noS = document.querySelector("#tagNo");
const subBtn = document.querySelector(".sub_btn");
const addTitle = document.querySelector(".add_title");
const addContent = document.querySelector(".add_content");
const aiteBtn = document.querySelector("#aite");
const aitePop = document.querySelector("#aitePop");
const aiteSure = document.querySelector("#aite_sure");
const aiteNo = document.querySelector("#aite_no");
const aiteText = document.querySelector("#aiteText");
let tags = [];
let files = [];
let fileIndex = -1;
let doneFile = [];
let subTimer = null;

// 返回主页
back.onclick = backToHome;
function backToHome() {
  backPage();
  tags = [];
  files = [];
  fileIndex = -1;
  doneFile = [];
  document.querySelectorAll(".temporary").forEach((ele) => {
    imgPlace.removeChild(ele);
  });
  tagList.innerHTML = "";
  addTitle.value = "";
  addContent.value = "";
}

//添加标签
addTopic.onclick = function () {
  pop.style.display = "block";
};
//@用户
aiteBtn.onclick = function () {
  aitePop.style.display = "block";
};

// 确认/取消添加标签
sure.onclick = function () {
  let newTag = document.createElement("span");
  if (!tagText.value) {
    pop.style.display = "none";
    return;
  }
  newTag.onclick = function (event) {
    let index = tags.findIndex((tag) => {
      return event.target.innerText.includes(tag);
    });
    tags.splice(index, 1);
    tagList.removeChild(event.target);
  };
  newTag.innerText = "#" + tagText.value + " ";
  tagList.appendChild(newTag);
  tags.push(tagText.value);
  pop.style.display = "none";
  tagText.value = "";
};
noS.onclick = function () {
  pop.style.display = "none";
  tagText.value = "";
};

//确认/取消@
aiteSure.onclick = function () {
  if (!aiteText.value.length) {
    aitePop.style.display = "none";
    return;
  }
  let text = `@${aiteText.value}\n`;
  text += addContent.value;
  console.log(text);
  addContent.value = text;
  aiteText.value = "";
  aitePop.style.display = "none";
};
aiteNo.onclick = function () {
  aitePop.style.display = "none";
  aiteText.value = "";
};

//上传图片
fileImg.oninput = function () {
  let file = this.files[0];
  fileIndex++;
  files.push(file);
  let reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = function () {
    let newPho = document.createElement("img");
    newPho.classList.add("temporary");
    newPho.src = reader.result;
    newPho.ind = fileIndex;
    newPho.onclick = function (event) {
      files[event.target.ind] = null;
      imgPlace.removeChild(event.target);
    };
    imgPlace.appendChild(newPho);
    fileImg.value = "";
  };
};

//发布笔记
subBtn.onclick = function () {
  //防抖
  if (subTimer) clearTimeout(subTimer);
  subTimer = setTimeout(() => {
    sub();
    subTimer = null;
  }, 1000);

  function sub() {
    send(0);
    function send(fileIndex) {
      if (fileIndex > files.length - 1) {
        let data = {
          userId: user.userId,
          title: addTitle.value,
          content: addContent.value,
          tags: tags,
          images: doneFile,
        };
        4;
        //如果一张图片都没有就不发
        if (!data.images.length) {
          console.log(1);
          alert("至少要添加一张图片!");
          return;
        }
        request("/article", "post", data, "json").then((res) => {
          if (res.status === 200) {
            addTitle.value = "";
            addContent.value = "";
            backToHome();
          }
        });
      }
      if (files[fileIndex]) {
        let formD = new FormData();
        formD.append("image", files[fileIndex]);
        request("/upload/image", "post", formD, "file").then((res) => {
          doneFile.push(res.url);
          send(fileIndex + 1);
        });
      }
    }
  }
};
