<template>
  <div class="sidebar">
    <!-- 折叠按钮 -->
    <div class="collapse-btn" @click="collapseChage">
      <i v-if="!collapse" class="el-icon-s-fold"></i>
      <i v-else class="el-icon-s-unfold"></i>
    </div>
    <div class="logo">导航菜单</div>
    <!-- 左侧导航栏 -->
    <el-menu
      class="sidebar-el-menu"
      :default-active="onRoutes"
      :collapse="collapse"
      background-color="#324157"
      text-color="#bfcbd9"
      active-text-color="#20a0ff"
      unique-opened
      router
    >
      <template v-for="item in items">
        <!-- 有子导航的导航项 -->
        <template v-if="item.subs">
          <el-submenu :index="item.index" :key="item.index">
            <template #title>
              <i :class="item.icon"></i>
              <span>{{ item.title }}</span>
            </template>

            <template v-for="subItem in item.subs">
              <el-submenu v-if="subItem.subs" :index="subItem.index" :key="subItem.index">
                <template #title>{{ subItem.title }}</template>
                <el-menu-item v-for="(threeItem, i) in subItem.subs" :key="i" :index="threeItem.index">
                  {{ threeItem.title }}</el-menu-item
                >
              </el-submenu>
              <el-menu-item v-else :index="subItem.index" :key="subItem.index">{{ subItem.title }} </el-menu-item>
            </template>
          </el-submenu>
        </template>

        <template v-else>
          <el-menu-item :index="item.index" :key="item.index">
            <template #title>
              <i :class="item.icon"></i>
              {{ item.title }}
            </template>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script>
import { throttle } from "lodash";
import { computed, onMounted } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
export default {
  setup() {
    const items = [
      {
        icon: "el-icon-lx-copy",
        index: "/user",
        title: "个人信息",
      },
    ];

    const route = useRoute();

    const onRoutes = computed(() => {
      return route.path;
    });

    const store = useStore();
    const collapse = computed(() => store.state.collapse);

    // 侧边栏折叠
    const collapseChage = throttle(() => {
      store.commit("handleCollapse", !collapse.value);
    }, 500);

    onMounted(() => {
      if (document.body.clientWidth < 1500) {
        collapseChage();
      }
    });
    return {
      items,
      onRoutes,
      collapse,
      collapseChage,
    };
  },
};
</script>

<style scoped>
.sidebar {
  user-select: none;
  display: block;
  position: absolute;
  left: 0;
  top: 70px;
  bottom: 0;
  overflow-y: scroll;
  border: 1px solid #242f42;
}

.collapse-btn {
  padding: 0 21px;
  cursor: pointer;
  line-height: 50px;
  display: inline-block;
  background: #242f42;
  color: #fff;
}

.logo {
  width: 250px;
  line-height: 50px;
  display: inline-block;
  background: #242f42;
  color: #fff;
  padding-left: 30px;
}

.sidebar::-webkit-scrollbar {
  width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
  width: 250px;
}
.sidebar > ul {
  height: 100%;
}
</style>
