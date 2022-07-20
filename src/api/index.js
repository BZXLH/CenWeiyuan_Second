import request from "./request";
import store from "../store/index";

// 原框架的东西
export const fetchData = (query) => {
  return request({
    url: "",
    method: "get",
    params: query,
    baseURL,
  });
};

//账号密码登录
export function accountLogin(loginData) {
  return request({
    url: "/user/login/pwd",
    method: "post",
    params: loginData,
  });
}

//查询个人信息
export function getUserInfo() {
  return request({
    url: "/user/info",
    method: "get",
  });
}

//修改个人信息
export function changeUserInof(userInfo) {
  /* 键名调整 */
  let gender;
  let birth = userInfo.birthday;
  let gymnasiumId = userInfo.gymnasium;
  if (userInfo.gender == "男") gender = 1;
  else if (userInfo.gender == "女") gender = 2;
  else gender = 0;
  /*  */
  let data = {
    headPhoto: userInfo.headPhoto,
    nickName: userInfo.nickName,
    name: userInfo.name,
    gender,
    birth,
    height: userInfo.height,
    weight: userInfo.weight,
    address: userInfo.address,
    gymnasiumId,
    uid: store.state.user.uid,
  };
  console.log(data);
  return request({
    url: "/user/modify",
    method: "post",
    data,
  });
}

//修改密码
export function changePsw(pswData) {
  return request({
    url: "/user/reset/pwd",
    method: "post",
    params: pswData,
  });
}
