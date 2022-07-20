import { getUserInfo } from "@/api";
import { ElMessage } from "element-plus";
import router from "../../router/index";

const state = {
  loaded: 0,
  id: null,
  nickName: "", //昵称
  name: "", //真实姓名
  headPhoto: "", //头像地址
  gender: null, //性别 0-未知，1-男，2-女
  birth: null, //生日（1）
  height: null, //身高
  weight: null, //体重
  totalScore: null, //当前积分
  address: "", //地址
  gymnasiumId: "", //健身房id（1）
  phone: "", //手机号（1）
  password: "", //登录密码
  salt: "", //加密盐
  primaryAccount: null, //0表示主账号，其它数字代表从属用户的id，登录只能使用主账号
  openId: "", //微信提供的open_id
  bodyBasicData: "", //身高+体重
  tel: "", //手机号（2）
  birthday: "", //生日（2）
  gymnasium: "", //健身房id（2）
  uid: null,
};
const mutations = {
  SetState(state, value) {
    Object.keys(value).forEach((item) => {
      state[item] = value[item];
    });
    state.loaded++;
  },
};
const actions = {
  setState({ commit }) {
    getUserInfo().then(({ code, data, success, message }) => {
      if (success) {
        commit("SetState", data);
      } else {
        if (code == 444) {
          localStorage.removeItem("check");
          localStorage.removeItem("closeTime");
          router.replace("/");
        }
        ElMessage.error(message);
      }
    });
  },
};
const getters = {
  height(state) {
    const cm = /(.*)cm/;
    return state.bodyBasicData.match(cm)[1];
  },
  weight(state) {
    const kg = /[,，](.*)kg/;
    return state.bodyBasicData.match(kg)[1];
  },
};

export default {
  state,
  mutations,
  actions,
  getters,
};
