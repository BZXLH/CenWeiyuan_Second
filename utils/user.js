import request from "../api/index.js";

let user = {
  userId: null,
  nickname: "",
  avatar: "",
  likedArticles: [],
  staredArticles: [],
  likedReviews: [],
  follows: [],
  fans: [],
};

//更新个人信息
function renewUser(id) {
  let Muser = sessionStorage.getItem("userMemory");
  if (Muser) user = JSON.parse(Muser);
  request(`/user/fullInfo?userId=${id}`, "get").then((res) => {
    if (res.status === 200) {
      user = res.user;
      user.userId = id;
    }
  });
}

export { renewUser, user };
