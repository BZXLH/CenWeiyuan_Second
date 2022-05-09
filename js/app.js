const app = document.querySelector("#app");
import { getCookie } from "../utils/cookie.js";
import { renewUser } from "../utils/user.js";
import { setPage } from "../utils/page.js";

NProgress.configure({ showSpinner: false });

if (!_isMobile()) {
  app.style.display = "none";
  document.body.innerHTML = "请用手机打开";
}

//判断是否手机登录
function _isMobile() {
  let flag = navigator.userAgent.match(
    /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
  );
  return flag;
}

document.body.style.height = window.innerHeight + "px";

//获取用户信息
let userId = getCookie("userId");
if (userId) {
  renewUser(userId);
  setPage("home");
} else {
  setPage("login");
}
