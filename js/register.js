import request from "../api/index.js";
import { setCookie } from "../utils/cookie.js";
import { nowPage, changePage, backPage } from "../utils/page.js";
import { renewUser } from "../utils/user.js";

const registerBtn = document.querySelector(".register_submit");
const username = document.querySelector(".register_input");
const password1 = document.querySelectorAll(".register_input_password")[0];
const password2 = document.querySelectorAll(".register_input_password")[1];
const loginBtn = document.querySelector(".loginBtn");
const warn = document.querySelector(".register_warn");

let isOk = false;

password2.onblur = checkPsw;

loginBtn.onclick = goToLogin;

registerBtn.onclick = register;

function register() {
  let data = {
    username: username.value,
    password: password1.value,
  };
  request("/register", "post", data).then((res) => {
    if (res.status == 200) {
      password1.value = "";
      password2.value = "";
      username.value = "";
      changePage(nowPage, "changeFace");
      request("/login", "post", data).then((res) => {
        let userId = res.userId;
        setCookie("userId", userId);
        renewUser(userId);
      });
    } else {
      warn.style.display = "block";
      warn.innerHTML = res.msg;
    }
  });
}

function goToLogin() {
  backPage();
  password1.value = "";
  password2.value = "";
  username.value = "";
}
function checkPsw() {
  if (password1.value !== password2.value) {
    warn.style.display = "block";
    warn.innerHTML = "两次密码不相同";
  } else {
    warn.style.display = "none";
    isOk = true;
  }
}
