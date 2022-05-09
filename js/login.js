import request from "../api/index.js";
import { setCookie } from "../utils/cookie.js";
import { nowPage, changePage } from "../utils/page.js";

const loginBtn = document.querySelector(".login_submit");
const username = document.querySelector(".login_input");
const password = document.querySelector(".login_input_password");
const registerBtn = document.querySelector(".registerBtn");
const warn = document.querySelector(".login_warn");

loginBtn.onclick = login;
registerBtn.onclick = goToRegister;

function login() {
  let data = {
    username: username.value,
    password: password.value,
  };
  request("/login", "post", data, null, true).then((res) => {
    if (res.status == 200) {
      setCookie("userId", res.userId);
      location.reload();
    } else if (res.status == 406) {
      request("/logout", "post", { userId: res.userId }).then(() => {
        request("/login", "post", data).then((res) => {
          if (res.status == 200) {
            setCookie("userId", res.userId);
            changePage(nowPage, "home");
          }
        });
      });
    } else {
      warn.style.display = "block";
      warn.innerHTML = res.msg;
    }
  });
}

function goToRegister() {
  changePage(nowPage, "register");
  username.value = "";
  password.value = "";
  warn.innerHTML = "";
}
