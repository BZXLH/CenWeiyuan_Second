<template>
  <div>
    <div class="top">
      <div class="top1">道路运输智能服务平台</div>
      <div class="top2">
        已经注册？ |
        <el-link
          type="primary"
          class="reg"
          :underline="false"
          @click="Tologin()"
          >登录</el-link
        >
      </div>
    </div>
    <div class="crumbs">欢迎注册道路运输智能服务平台！</div>
    <div class="container">
      <div class="form-box">
        <el-form ref="formRef" :rules="rules" :model="form" label-width="80px">
          <el-form-item label="姓名:" prop="name">
            <el-input
              v-model="form.name"
              placeholder="请输入真实姓名"
            ></el-input>
          </el-form-item>
          <el-form-item label="单位名称:" prop="company">
            <el-input
              v-model="form.company"
              placeholder="请输入单位名称进行搜索"
            >
              <template v-slot:append>
                <el-button
                  icon="el-icon-search"
                  style="background-color: #dff0fa; color: #539bc5"
                ></el-button>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label="所属部门" prop="region">
            <el-select v-model="form.region">
              <el-option key="bbk" label="a" value="bbk"></el-option>
              <el-option key="xtc" label="b" value="xtc"></el-option>
              <el-option key="imoo" label="c" value="imoo"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="手机号码:" prop="number">
            <el-input
              v-model="form.number"
              placeholder="请输入手机号码"
            ></el-input>
          </el-form-item>
          <el-form-item label="验证码:" prop="yanzheng">
            <el-input v-model="form.yanzheng" placeholder="请输入手机验证码">
              <template v-slot:append
                ><el-button style="background-color: #dff0fa; color: #539bc5"
                  >发送验证码</el-button
                ></template
              >
            </el-input>
          </el-form-item>

          <el-form-item label="登录密码:" prop="pass">
            <el-input
              show-password
              v-model="form.pass"
              placeholder="请输入6-20位密码"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="确认密码:" prop="checkPass">
            <el-input
              show-password
              v-model="form.checkPass"
              placeholder="请再输入一次密码"
              autocomplete="off"
            ></el-input>
          </el-form-item>

          <el-form-item>
            <el-button
              @click="register()"
              style="background-color: #3c8dbc; color: #fff"
              >立即注册</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
import { reactive, ref } from "vue";
export default {
  name: "baseform",

  setup() {
    const router = useRouter();
    const form = reactive({
      name: "",
      company: "",
      number: "",
      yanzheng: "",
      pass: "",
      checkPass: "",
      region: "",
    });
    return {
      form,
    };
  },
  methods: {
    register() {
      this.$router.push("/login");
    },
    Tologin() {
      this.$router.push("/login");
    },
  },
};
</script>

<style scoped>
.top {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  font-size: 20px;
  margin-left: 20px;
}

.top2 {
  font-size: 13px;
  margin-right: 25px;
}

.reg {
  font-size: 13px;
}

.crumbs {
  background-color: #3c8dbc;
  color: #fff;
  height: 50px;
  display: flex;
  align-items: center;
  padding-left: 20px;
  margin: 0;
}

form.el-form {
  margin-left: 150px;
}

.form-box {
  width: 50%;
}

.container {
  border-radius: 0;
}

el-button .btn {
  background-color: #dff0fa;
  color: #539bc5;
}

.el-select {
  display: block;
}
</style>