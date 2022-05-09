import { backPage, changePage, nowPage } from "../utils/page.js";
import { user } from "../utils/user.js";
import request from "../api/index.js";

const backBtn = document.querySelector("#edit_back");
const showImg = document.querySelector(".edit_img");
const mingzi = document.querySelector("#edit_mingzi");
const xingbie = document.querySelector("#edit_xingbie");
const shengri = document.querySelector("#edit_shengri");
const diqv = document.querySelector("#edit_diqv");
const jianjie = document.querySelector("#edit_jianjie");
const beijing = document.querySelector("#edit_beijing");
const pop = document.querySelector(".edit_pop");
const input = document.querySelector(".edit_input");
const title = document.querySelector("#editing");
const save = document.querySelector(".edit_save");

let userInfo = {};
let newForm = {
  nickname: "",
  gender: "",
  birthday: "",
  area: "",
  description: "",
  backGroundPicture: "",
};
let file = null;

backBtn.onclick = function () {
  backPage();
};
save.onclick = saveEdit; //保存编辑
showImg.onclick = goToChangeFace; //修改头像

//初始化
async function initEdit(data) {
  if (!data) {
    data = await request(`/user/baseInfo?userId=${user.userId}`, "get");
    data = data.user;
  }
  userInfo = data;

  newForm.nickname = userInfo.nickname;
  newForm.gender = userInfo.gender;
  newForm.birthday = userInfo.birthday;
  newForm.area = userInfo.area;
  newForm.description = userInfo.description;

  //更新头像
  showImg.src = userInfo.avatar;
  //更新名字
  document.querySelector("#mingzi").innerHTML = userInfo.nickname;
  //更新性别
  if (userInfo.gender == "1") {
    document.querySelector("#xingbie").innerHTML = "男";
  } else if (userInfo.gender == "0") {
    document.querySelector("#xingbie").innerHTML = "女";
  } else {
    document.querySelector("#xingbie").innerHTML = "未知";
  }
  //更新生日
  document.querySelector("#shengri").innerHTML = userInfo.birthday;
  //更新地区
  document.querySelector("#diqv").innerHTML = userInfo.area;
  //更新简介
  document.querySelector("#jianjie").innerHTML = userInfo.description;
  //更新背景图
  if (userInfo.backGroundPicture) document.querySelector("#beijing").src = userInfo.backGroundPicture;
}

mingzi.onclick = function () {
  pop.style.display = "block";
  input.style.display = "block";
  input.focus();
  title.innerHTML = "名字";
};
xingbie.onclick = function () {
  pop.style.display = "block";
  document.querySelector("#sel_xingbie").style.display = "flex";
  title.innerHTML = "性别";
};
shengri.onclick = function () {
  pop.style.display = "block";
  document.querySelector("#sel_shengri").style.display = "flex";
  title.innerHTML = "生日";
};
diqv.onclick = function () {
  pop.style.display = "block";
  input.style.display = "block";
  input.focus();
  title.innerHTML = "地区";
};
jianjie.onclick = function () {
  pop.style.display = "block";
  input.style.display = "block";
  input.focus();
  title.innerHTML = "简介";
};
beijing.onclick = function () {
  pop.style.display = "block";
  let background = document.querySelector("#background");
  background.style.display = "block";
  title.innerHTML = "背景图";
  let fileImg = document.querySelector("#editImg");
  fileImg.oninput = function () {
    file = this.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      let newPho = document.querySelector(".editImgSure");
      newPho.src = reader.result;
      newPho.style.display = "block";
      background.style.display = "none";
      newPho.onclick = function () {
        fileImg.value = "";
        newPho.src = "";
        file = null;
        newPho.style.display = "none";
        background.style.display = "block";
      };
    };
  };
};

//结束编辑
function endEdit() {
  pop.style.display = "none";
  input.style.display = "none";
  input.value = "";
  title.innerHTML = "";
  document.querySelector("#sel_shengri").style.display = "none";
  document.querySelector("#sel_xingbie").style.display = "none";
  document.querySelector("#background").style.display = "none";
  document.querySelector(".editImgSure").style.display = "none";
}

document.querySelector("#edit_yes").onclick = function () {
  if (!input.value && title.innerHTML == "名字") return;

  let nowTitle = title.innerHTML;
  if (nowTitle == "名字") {
    document.querySelector("#mingzi").innerHTML = input.value;
    newForm.nickname = input.value;
  } else if (nowTitle == "性别") {
    let sel = document.querySelector("#selItem_xingbie");
    let selIndex = sel.selectedIndex;
    let val = sel.options[selIndex].value;
    newForm.gender = val;
    document.querySelector("#xingbie").innerHTML = val == "1" ? "男" : "女";
  } else if (nowTitle == "生日") {
    let year = document.querySelector("#year");
    let month = document.querySelector("#month");
    let day = document.querySelector("#day");
    let birStr =
      "" +
      year.options[year.selectedIndex].value +
      "-" +
      month.options[month.selectedIndex].value +
      "-" +
      day.options[day.selectedIndex].value;
    document.querySelector("#shengri").innerHTML = birStr;
    newForm.birthday = birStr;
  } else if (nowTitle == "地区") {
    document.querySelector("#diqv").innerHTML = input.value;
    newForm.area = input.value;
    document.querySelector("#diqv").innerHTML = input.value;
  } else if (nowTitle == "简介") {
    document.querySelector("#jianjie").innerHTML = input.value;
    newForm.description = input.value;
    document.querySelector("#jianjie").innerHTML = input.value;
  } else if (nowTitle == "背景图" && file) {
    document.querySelector("#beijing").src = document.querySelector(".editImgSure").src;
  }
  endEdit();
};

//保存编辑
function saveEdit() {
  request("/user/edit", "post", {
    userId: user.userId,
    nickname: newForm.nickname,
    gender: newForm.gender,
    birthday: newForm.birthday,
    area: newForm.area,
    description: newForm.description,
  }).then(() => {
    if (!file) return;
    let formD = new FormData();
    formD.append("userId", user.userId);
    formD.append("backGroundPicture", file);
    request("/user/upload", "post", formD, "file").then((res) => {
      if (res.status === 200) {
        save.innerHTML = "保存成功";
        save.style.background = "orange";
        setTimeout(() => {
          save.innerHTML = "保存";
          save.style.background = "#009373";
        }, 2000);
      }
    });
  });
}

//取消
document.querySelector("#edit_no").onclick = function () {
  endEdit();
};

//去修改头像
function goToChangeFace() {
  changePage(nowPage, "changeFace");
}
export { initEdit };
