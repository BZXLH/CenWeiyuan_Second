// 配置路由相关信息
import { createRouter, createWebHashHistory } from "vue-router";
import Home from "../views/Home/Home.vue";

// 创建VueRoster对象
const routes = [
  {
    path: "/",
    redirect: "/user",
  },
  {
    path: "/",
    name: "Home",
    component: Home,
    children: [
      {
        path: "user",
        name: "user",
        meta: {
          title: "个人信息",
        },
        component: () => import("@/views/Me/Me.vue"),
      },
    ],
  },
  {
    path: "/login",
    name: "Login",
    meta: {
      title: "登录",
    },
    component: () => import("@/views/Login/Login.vue"),
  },
  {
    path: "/register1",
    name: "Register1",
    meta: {
      title: "个人注册",
    },
    component: () => import("../views/Register1.vue"),
  },
  {
    path: "/register2",
    name: "Register2",
    meta: {
      title: "企业注册",
    },
    component: () => import(/* webpackChunkName: "login" */ "../views/Register2.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

//校验登录信息
router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title}`;
  const role = localStorage.getItem("check");
  if (!role && to.path !== "/login") {
    next("/login");
  } else if (to.meta.permission) {
    // 如果是管理员权限则可进入，这里只是简单的模拟管理员权限而已
    role === "admin" ? next() : next("/403");
  } else {
    next();
  }
});

export default router;
