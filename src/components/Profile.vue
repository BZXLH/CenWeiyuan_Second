<template>
  <div class="container">
    <h1>个人信息</h1>
    <el-button type="primary" class="edit" @click="openEdit">编辑</el-button>
    <div class="headPhotoWrap">
      <el-avatar :size="130" class="headPhoto">
        <img src="@/assets/img/img.jpg" />
      </el-avatar>
    </div>

    <el-descriptions class="margin-top" :column="2" border>
      <!-- 表格内容 -->
      <el-descriptions-item v-for="item in userInfoList" :key="item">
        <template #label>
          <div class="cell-item">
            {{ toZh(item) }}
          </div>
        </template>
        {{ userInfo[item] ? userInfo[item] : "未填写" }}
      </el-descriptions-item>
    </el-descriptions>

    <!-- 编辑弹窗 -->
    <el-dialog v-model="dialogFormVisible" title="编辑" :close-on-click-modal="false">
      <el-avatar :size="130" class="editHeadPhoto">
        <div class="editHeadPhoto_mask">点击编辑</div>
        <img src="@/assets/img/img.jpg" />
      </el-avatar>
      <el-form :model="editInfo" class="editForm" label-width="80px" @change="haveChanged = true">
        <el-form-item label="昵称" class="editItem">
          <el-input v-model="editInfo.nickName" autocomplete="off" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="真实姓名" class="editItem">
          <el-input v-model="editInfo.name" autocomplete="off" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="性别" class="editItem">
          <el-select v-model="editInfo.gender" placeholder="请选择" style="width: 100%">
            <el-option label="男" value="男" />
            <el-option label="女" value="女" />
            <el-option label="未知" value="未知" />
          </el-select>
        </el-form-item>
        <el-form-item label="生日" class="editItem">
          <el-input v-model="editInfo.birthday" autocomplete="off" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="身高(cm)" class="editItem">
          <el-input v-model="editInfo.height" autocomplete="off" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="体重(kg)" class="editItem">
          <el-input v-model="editInfo.weight" autocomplete="off" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="手机号" class="editItem">
          <el-input v-model="editInfo.tel" autocomplete="off" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="体育馆" class="editItem">
          <el-input v-model="editInfo.gymnasium" autocomplete="off" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="地址" class="editItem" style="width: 92.7%">
          <el-input v-model="editInfo.address" autocomplete="off" placeholder="请输入" />
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="editOK">确认编辑</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { changeUserInof } from "@/api";

import { ElMessage } from "element-plus";
import { reactive, ref } from "@vue/reactivity";
import { useStore } from "vuex";
import { computed, nextTick, onMounted, watch } from "@vue/runtime-core";
import { getUserInfo } from "@/api";
import { useRouter } from "vue-router";
export default {
  setup() {
    const store = useStore();
    const router = useRouter();
    let dialogFormVisible = ref(false); // 显示弹窗
    let haveChanged = ref(false); //是否修改信息

    // 用户信息
    const userInfo = reactive({
      nickName: "",
      name: "",
      gender: "",
      birthday: "",
      height: "",
      weight: "",
      tel: "",
      gymnasium: "",
      address: "",
    });
    // 用户信息key数组
    const userInfoList = computed(() => {
      return Object.keys(userInfo);
    });
    //项目名称对应表
    const userTable = {
      nickName: "昵称",
      name: "真实姓名",
      gender: "性别",
      birthday: "生日",
      height: "身高",
      weight: "体重",
      tel: "手机号",
      gymnasium: "体育馆",
      address: "地址",
    };
    //编辑选项列表
    let editInfo = reactive({
      nickName: "",
      headPhoto: "",
      name: "",
      gender: "",
      birthday: "",
      height: "",
      weight: "",
      tel: "",
      gymnasium: "",
      address: "",
    });
    //翻译
    function toZh(word) {
      return userTable[word];
    }
    //打开编辑窗口
    function openEdit() {
      dialogFormVisible.value = true;
      haveChanged.value = false;
      userInfoList.value.forEach((key) => {
        editInfo[key] = userInfo[key];
        if (key == "height") {
          editInfo[key] = editInfo[key].match(/(.*) cm/)[1];
        } else if (key == "weight") {
          editInfo[key] = editInfo[key].match(/(.*) kg/)[1];
        }
      });
    }
    //完成编辑
    function editOK() {
      //编辑表单是否修改
      if (haveChanged.value) {
        changeUserInof(editInfo).then(({ success }) => {
          if (success) {
            ElMessage.success("修改成功");
            store.dispatch("setState");
          } else {
            ElMessage.error("修改失败");
          }
        });
      }

      dialogFormVisible.value = false;
    }

    onMounted(() => {
      /* 获取用户信息 */
      store.dispatch("setState");
    });

    //onChange无法监测selector，使用watch监测性别是否修改
    watch(
      () => editInfo.gender,
      () => {
        haveChanged.value = true;
      }
    );

    //从store获取个人信息
    watch(
      () => store.state.user.loaded,
      () => {
        userInfoList.value.forEach((item) => {
          userInfo[item] = store.state.user[item];
        });
        userInfo.height = store.getters.height + " cm";
        userInfo.weight = store.getters.weight + " kg";
      }
    );
    return {
      userInfoList,
      userInfo,
      toZh,
      dialogFormVisible,
      openEdit,
      editInfo,
      editOK,
      haveChanged,
    };
  },
};
</script>

<style scoped lang="less">
.editHeadPhoto {
  position: relative;
  margin: -10px 50% 10px 50%;
  transform: translate(-50%, 0);
  overflow: hidden;
  .editHeadPhoto_mask {
    position: absolute;
    bottom: 0;
    top: 0;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: black;
    opacity: 0.3;
    font-weight: 300;
    cursor: pointer;
    user-select: none;
  }
}
.editForm {
  display: flex;
  flex-wrap: wrap;
}
.editItem {
  width: 45%;
  margin: 10px 10px;
}
.cell-item {
  line-height: 50px;
}
.edit {
  position: absolute;
  left: 30px;
  top: 190px;
}
.headPhotoWrap {
  display: flex;
  margin-bottom: 50px;
  justify-content: right;
}
</style>
