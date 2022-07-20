<template>
  <div class="login-container">
    <el-form
      ref="accLogin"
      :model="accountLoginParams"
      :rules="accountRules"
      class="login-form"
      autocomplete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">登录</h3>
      </div>

      <el-form-item prop="account">
        <span class="svg-container">
          <i class="el-icon-user"></i>
        </span>
        <el-input
          v-model="accountLoginParams.account"
          placeholder="请输入手机号"
          name="username"
          type="text"
          tabindex="1"
          autocomplete="on"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <i class="el-icon-lock"></i>
        </span>
        <el-input
          type="password"
          placeholder="请输入密码"
          name="password"
          tabindex="2"
          autocomplete="on"
          v-model="accountLoginParams.password"
          @keyup.enter.native="submitForm"
        />
      </el-form-item>

      <el-form-item prop="role">
        <span class="svg-container">
          <i class="el-icon-medal"></i>
        </span>
        <el-select v-model="accountLoginParams.role" class="roleSelect" placeholder="选择身份">
          <el-option v-for="item in roleOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>

      <el-button type="primary" style="width: 100%; margin-bottom: 30px" @click="submitForm" :loading="loading"> 登录 </el-button>
    </el-form>
  </div>
</template>

<script>
import { ref, reactive } from "@vue/reactivity";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";

import { accountLogin } from "@/api";
export default {
  setup() {
    const router = useRouter();
    const store = useStore();
    const accLogin = ref(null); //获取表单
    let loading = ref(false);
    //表单信息
    const accountLoginParams = reactive({
      account: "19928461353",
      password: "123456",
      role: "",
    });
    //身份选项
    const roleOptions = reactive([
      { value: 1, label: "教练" },
      { value: 2, label: "工作人员" },
      { value: 3, label: "管理员" },
    ]);
    //表单验证规则
    const accountRules = {
      account: [
        {
          required: true,
          message: "请输入账号",
          trigger: "blur",
        },
      ],
      password: [{ required: true, message: "请输入密码", trigger: "blur" }],
      role: [
        {
          required: true,
          message: "请选择身份",
          trigger: "blur",
        },
      ],
    };
    // 提交表单
    const submitForm = () => {
      if (loading.value) return;
      accLogin.value.validate((valid) => {
        if (valid) {
          loading.value = true;
          //发送登录请求
          accountLogin({
            phone: accountLoginParams.account, //账号（手机号）
            pwd: accountLoginParams.password, //密码
            role: accountLoginParams.role, //登录角色（默认为1），1-app用户，2-管理员，3-超管，4工作人员
          }).then(
            ({ success, message, data }) => {
              loading.value = false;
              if (success) {
                ElMessage.success("登录成功");
                /* 设置token和过期时间 */
                localStorage.setItem("check", data.token);
                localStorage.setItem("closeTime", data.expireAt);
                router.replace("/");
              } else ElMessage.error(message);
            },
            (err) => {
              console.log("登录请求失败");
            }
          );
        } else {
          return false;
        }
      });
    };
    // 清除tag
    store.commit("clearTags");
    return {
      submitForm,
      accountRules,
      accLogin,
      roleOptions,
      accountLoginParams,
      loading,
    };
  },
};
</script>

<style lang="less">
i {
  font-size: large;
}

@supports (-webkit-mask: none) and (not (cater-color: #fff)) {
  .login-container .el-input input {
    color: #fff;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: #eee;
      height: 47px;
      caret-color: #fff;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px #2d3a4b inset !important;
        -webkit-text-fill-color: #fff !important;
      }
    }
  }

  .el-form-item {
    flex-wrap: nowrap;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
.roleSelect {
  position: absolute;
  right: 0;
  left: 50px;
  .el-input {
    width: 100%;
  }
  span {
    margin-top: 7px;
  }
}
</style>

<style lang="less" scoped>
.login-container {
  min-height: 100%;
  width: 100%;
  background-color: #2d3a4b;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 500px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 0px 6px 20px;
    color: #889aa4;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: #eee;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }

    .set-language {
      color: #fff;
      position: absolute;
      top: 3px;
      font-size: 18px;
      right: 0px;
      cursor: pointer;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: #889aa4;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>
