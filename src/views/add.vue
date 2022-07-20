<template>
  <div>
    <div class="top"><b>企业档案新增</b></div>
    <div class="container">
      <el-form label-position="center" label-width="80px">
        <div class="leftFirst">
          <el-form-item label="业户名称:" prop="name">
            <el-input></el-input>
          </el-form-item>
        </div>

        <div class="rightFirst">
          <el-form-item label="业户类别:" prop="kind">
            <el-select v-model="query.kind" placeholder="请选择业户类型">
              <el-option key="1" label="广东省" value="广东省"></el-option>
              <el-option key="2" label="湖南省" value="湖南省"></el-option>
            </el-select>
          </el-form-item>
        </div>

        <div class="leftFirst">
          <el-form-item label="许可证号:" prop="number">
            <el-input></el-input>
          </el-form-item>
        </div>

        <div class="rightFirst"></div>

        <div class="leftSecond">
          <el-form-item label="核发机关:" prop="hefa">
            <el-select v-model="query.hefa" placeholder="请选择核发机关" class="handle-select mr10">
              <el-option key="1" label="广东省" value="广东省"></el-option>
              <el-option key="2" label="湖南省" value="湖南省"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="有效期始:" prop="firstDate">
            <el-input></el-input>
          </el-form-item>
        </div>

        <div class="rightSecond">
          <el-form-item label="核发日期:" prop="name">
            <el-input></el-input>
          </el-form-item>

          <el-form-item label="有效期止:" prop="lastDate">
            <el-input></el-input>
          </el-form-item>
        </div>

        <div class="choose">
          <el-form-item label="经营范围:">
            <el-checkbox-groud>
              <el-checkbox label="汽车综合性能检测站"></el-checkbox>
              <el-checkbox label="道路旅客运输"></el-checkbox>
              <el-checkbox label="道路危险货物运输"></el-checkbox>
              <el-checkbox label="道路普通货运"></el-checkbox>
              <el-checkbox label="班车客运"></el-checkbox>
              <el-checkbox label="包车客运"></el-checkbox>
              <el-checkbox label="汽车维修"></el-checkbox>
            </el-checkbox-groud>
          </el-form-item>
        </div>

        <div class="leftThird">
          <el-form-item label="经济类型:" prop="name">
            <el-select v-model="query.jingji" placeholder="国有经济">
              <el-option key="1" label="国有经济" value="国有经济"></el-option>
              <el-option key="2" label="私有经济" value="私有经济"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="法人姓名:" prop="name">
            <el-input></el-input>
          </el-form-item>

          <el-form-item label="证件类型:" prop="name">
            <el-select v-model="query.shenfen" placeholder="身份证">
              <el-option key="1" label="身份证" value="身份证"></el-option>
              <el-option key="2" label="湖南省" value="湖南省"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="联系电话:" prop="name">
            <el-input></el-input>
          </el-form-item>
        </div>

        <div class="rightThird">
          <el-form-item label="经营状态:" prop="jingying">
            <el-select v-model="query.hefa" placeholder="营运">
              <el-option key="1" label="营运" value="营运"></el-option>
              <el-option key="2" label="湖南省" value="湖南省"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="法人手机:" prop="firstDate">
            <el-input></el-input>
          </el-form-item>

          <el-form-item label="证件号码:" prop="lastDate">
            <el-input></el-input>
          </el-form-item>

          <el-form-item label="所在地址:" prop="name">
            <el-input></el-input>
          </el-form-item>
        </div>

        <div class="bottom">
          <el-button type="primary">保存</el-button>
          <el-button type="primary">取消</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from "vue";

export default {
  name: "file_1",
  data() { },
  methods: {},
  setup() {
    const query = reactive({
      address: "",
      name: "",
      pageIndex: 1,
      pageSize: 10,
    });

    return {
      query,
    };
  },
};
</script>

<style scoped>
.top {
  font-size: 20px;
  text-align: center;
  color: #40566e;
}

.container {
  display: flex;
  margin-left: auto;
  margin-right: auto;
  width: 900px;
}

.leftFirst,
.leftSecond,
.leftThird {
  display: inline-block;
  width: 420px;
}

.rightFirst,
.rightSecond,
.rightThird {
  display: inline-block;
  margin-left: 50px;
  width: 420px;
}

.bottom {
  margin-left: auto;
  margin-right: auto;
  width: 150px;
}
</style>