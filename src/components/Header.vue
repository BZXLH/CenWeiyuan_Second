<template>
  <div class="header">
    <div class="logo"><b>运动健康后台管理</b></div>
    <div class="header-right">
      <div class="header-user-con">
        <!-- 用户名下拉菜单 -->
        <el-dropdown class="user-name" trigger="click" @command="handleCommand">
          <span class="el-dropdown-link">
            <i class="el-icon-s-tools" style="margin-right: 5px; transform: translate(0, 2px); font-size: 20px"></i>
            登录设置
            <i class="el-icon-caret-bottom"></i>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="changePsw">修改密码</el-dropdown-item>
              <el-dropdown-item divided command="loginout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
    <!-- 修改密码弹窗 -->
    <el-dialog v-model="dialogFormVisible" title="修改登录密码" :close-on-click-modal="false" :show-close="false">
      <el-form :model="changePswForm" ref="pswForm" :rules="pswRules" label-width="80px" hide-required-asterisk>
        <el-form-item label="原密码" prop="oldPsw">
          <el-input v-model="changePswForm.oldPsw" autocomplete="off" />
        </el-form-item>
        <el-form-item label="新密码" prop="newPsw">
          <el-input v-model="changePswForm.newPsw" type="password" autocomplete="off" />
        </el-form-item>
        <el-form-item label="确认密码" prop="againNewPsw">
          <el-input v-model="changePswForm.againNewPsw" type="password" autocomplete="off" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closeChangePsw">取消</el-button>
          <el-button type="primary" @click="changePswOK">确认修改</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import { changePsw } from "@/api";
import { computed, reactive, ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
export default {
  setup() {
    const username = "123";
    const message = 2;
    const pswForm = ref(); //获取表单
    let dialogFormVisible = ref(false); //修改密码弹窗

    const store = useStore();
    const collapse = computed(() => store.state.collapse);

    // 用户名下拉菜单选择事件
    const router = useRouter();
    const handleCommand = (command) => {
      if (command == "loginout") {
        localStorage.removeItem("check");
        router.push("/login");
      } else if (command == "changePsw") {
        //修改密码
        openChangePsw();
      }
    };
    //修改密码表单
    const changePswForm = reactive({
      oldPsw: "",
      newPsw: "",
      againNewPsw: "",
    });
    //修改密码验证规则
    const pswRules = {
      oldPsw: [
        {
          required: true,
          message: "请输入原密码",
          trigger: "blur",
        },
      ],
      newPsw: [{ required: true, message: "请输入新密码", trigger: "blur" }],
      againNewPsw: [
        {
          required: true,
          message: "请确认密码",
          trigger: "blur",
        },
      ],
    };
    // 打开修改密码弹窗
    function openChangePsw() {
      dialogFormVisible.value = true;
      changePswForm.oldPsw = "";
      changePswForm.newPsw = "";
      changePswForm.againNewPsw = "";
    }
    //确认修改密码
    function changePswOK() {
      pswForm.value.validate((valid) => {
        if (valid) {
          if (changePswForm.newPsw !== changePswForm.againNewPsw) {
            ElMessage.error("两次密码输入不相同");
          } else if (changePswForm.newPsw == changePswForm.oldPsw) {
            ElMessage.error("新密码不能与原密码相同");
          } else {
            changePsw({
              oldPwd: changePswForm.oldPsw,
              pwd: changePswForm.newPsw,
            }).then(({ code, success, message }) => {
              if (success) {
                ElMessage.success("修改密码成功");
              } else if (code == 405 || code == 401) {
                ElMessage.error(message);
              }
            });
            dialogFormVisible.value = false;
          }
        }
      });
    }
    //关闭弹窗
    function closeChangePsw() {
      pswForm.value.resetFields();
      dialogFormVisible.value = false;
    }

    return {
      username,
      message,
      collapse,
      handleCommand,
      changePswForm,
      dialogFormVisible,
      openChangePsw,
      changePswOK,
      pswForm,
      pswRules,
      closeChangePsw,
    };
  },
};
</script>
<style scoped>
.header {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 70px;
  font-size: 22px;
  color: #fff;
  background: #3c8dbc;
}
.header .logo {
  float: left;
  width: 250px;
  line-height: 70px;
  padding-left: 30px;
  background: #367fa9;
}
.header-right {
  float: right;
  padding-right: 50px;
}
.header-user-con {
  display: flex;
  height: 70px;
  align-items: center;
}
.btn-fullscreen {
  transform: rotate(45deg);
  margin-right: 5px;
  font-size: 24px;
}

.user-name {
  margin-left: 10px;
}
.user-avator {
  margin-left: 20px;
}
.user-avator img {
  display: block;
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
.el-dropdown-link {
  color: #fff;
  cursor: pointer;
}
.el-dropdown-menu__item {
  text-align: center;
}
</style>
