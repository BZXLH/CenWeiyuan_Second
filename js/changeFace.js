import { user } from "../utils/user.js";
import request from "../api/index.js";
import { backPage } from "../utils/page.js";

const face = document.querySelector(".changeFace_face");
const faceFile = document.querySelector("#faceFile");
const upFsure = document.querySelector(".upFsure");
const faceBack = document.querySelector("#face_back");
let file = null;

// 返回
faceBack.onclick = function () {
  backPage();
};

//获取当前头像
let facetimer = setInterval(() => {
  if (user.avatar) {
    clearInterval(facetimer);
    face.src = user.avatar;
  }
}, 0);

// 选择头像
faceFile.oninput = function () {
  file = this.files[0];
  let reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = function () {
    face.src = reader.result;
  };
};

// 上传头像
upFsure.onclick = function () {
  if (!file) {
    backPage();
    return;
  }
  let formD = new FormData();
  formD.append("userId", user.userId);
  formD.append("avatar", file);
  request("/user/upload", "post", formD, "file").then(() => {
    backPage();
  });
};
