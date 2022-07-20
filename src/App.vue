<template>
  <router-view />
</template>

<script>
import { getUserInfo } from "@/api";
import { useStore } from "vuex";
export default {
  setup() {
    const store = useStore();

    let token = localStorage.getItem("check");
    if (token) {
      let ddl = localStorage.getItem("closeTime");
      let startTime = new Date().getTime();
      ddl = ddl * 1;
      if (startTime > ddl) {
        localStorage.removeItem("check");
        localStorage.removeItem("closeTime");
      } else {
      }
    }
    return {};
  },
};
</script>

<style>
@import "./assets/css/main.css";
@import "./assets/css/color-dark.css";
</style>
