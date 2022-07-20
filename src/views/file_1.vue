<template>
  <div>
    <div class="container">
      <div class="handle-box">
        <el-form :inline="true" size="mini" label-wid>
          <el-form-item label="核发机关:" prop="hefa">
            <el-select v-model="tableData.hefa" placeholder="请选择核发机关" class="handle-select mr10">
              <el-option key="1" label="赣州市道路运输管理局" value="赣州市道路运输管理局"></el-option>
              <el-option key="2" label="湖南省" value="湖南省"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="业户名称:" prop="name">
            <el-input class="handle-input mr10"></el-input>
          </el-form-item>

          <el-form-item label="业户类型:" prop="kind">
            <el-select v-model="tableData.kind" placeholder="所有业户类型" class="handle-select mr10">
              <el-option key="1" label="广东省" value="广东省"></el-option>
              <el-option key="2" label="湖南省" value="湖南省"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="许可证号:" prop="number">
            <el-input class="handle-input mr10"></el-input>
          </el-form-item>

          <el-form-item label="经营状态:" prop="jingying">
            <el-select v-model="tableData.jingying" placeholder="营运" class="handle-select mr10">
              <el-option key="1" label="营运" value="营运"></el-option>
              <el-option key="2" label="湖南省" value="湖南省"></el-option>
            </el-select>
            <div class="btn">
              <el-button type="primary" size="mini">查询</el-button>
              <el-button type="primary" size="mini">新增</el-button>
              <el-button type="success" size="mini">重置</el-button>
            </div>
          </el-form-item>
        </el-form>
      </div>

      <el-table :data="tableData" border stripe height="540" class="table" ref="multipleTable" header-cell-class-name="table-header" :default-sort="{ prop: 'id' }">
        <el-table-column prop="id" sortable width="55" align="center"></el-table-column>
        <el-table-column prop="name" label="业户名称" align="center"></el-table-column>
        <el-table-column prop="kind" label="业户类型" align="center">
        </el-table-column>
        <el-table-column prop="rank" label="经营范围" align="center">
        </el-table-column>
        <el-table-column prop="number" label="许可证" align="center"></el-table-column>
        <el-table-column prop="firstDate" sortable label="有效期起" align="center">
        </el-table-column>
        <el-table-column prop="lastDate" sortable label="有效期至" align="center">
        </el-table-column>
        <el-table-column prop="hefa" label="核发机关" align="center">
        </el-table-column>
        <el-table-column prop="jingying" label="经营状态" align="center">
        </el-table-column>
        <el-table-column prop="inTime" sortable label="入库时间" align="center">
        </el-table-column>
        <el-table-column prop="updateTime" label="更新时间" align="center">
        </el-table-column>

        <el-table-column label="操作" width="180" align="center">
          <template #default="scope">
            <el-button type="text" @click="check(scope.$index, scope.row)">查看详情
            </el-button>
            <el-button type="text" @click="handleEdit(scope.$index, scope.row)">编辑
            </el-button>
            <el-button type="text" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination background layout="total, prev, pager, next" :current-page="10" :page-size="1" :total="pageTotal" @current-change="handlePageChange"></el-pagination>
      </div>
    </div>

    <!-- 编辑弹出框 -->
    <el-dialog title="详情" v-model="editVisible" width="60%">
      <div class="con">
        <div class="left">
          <el-form label-position="center" label-width="80px">
            <el-form-item label="业户名称:" prop="name">
              <el-input v-model="dat.name"></el-input>
            </el-form-item>

            <el-form-item label="许可证号:" prop="number">
              <el-input v-model="dat.number"></el-input>
            </el-form-item>

            <el-form-item label="有效期始:" prop="firstDate">
              <el-input v-model="dat.firstDate"></el-input>
            </el-form-item>

            <el-form-item label="有效期止:" prop="lastDate">
              <el-input v-model="dat.lastDate"></el-input>
            </el-form-item>

            <el-form-item label="核发机关:" prop="hefa">
              <el-input v-model="dat.hefa"></el-input>
            </el-form-item>

            <el-form-item label="核发日期:" prop="hefaDate">
              <el-input v-model="dat.hefaDate"></el-input>
            </el-form-item>

            <el-form-item label="经济类型:" prop="jingji">
              <el-input v-model="dat.jingji"></el-input>
            </el-form-item>

            <el-form-item label="法人姓名:" prop="name2">
              <el-input v-model="dat.name2"></el-input>
            </el-form-item>

            <el-form-item label="证件类别:" prop="zhengjian">
              <el-input v-model="dat.zhengjian"></el-input>
            </el-form-item>

            <el-form-item label="联系地址:" prop="address">
              <el-input v-model="dat.address"></el-input>
            </el-form-item>
          </el-form>
        </div>

        <div class="right">
          <el-form label-position="left" label-width="80px">
            <el-form-item label="业户类别:" prop="yehu">
              <el-input v-model="dat.yehu"></el-input>
            </el-form-item>

            <el-form-item label="经营范围:" prop="rank">
              <el-input type="textarea" :rows="13" v-model="dat.rank" style="margin-bottom: 5px">
              </el-input>
            </el-form-item>

            <el-form-item label="经营状态:" prop="jingying">
              <el-input v-model="dat.jingying"></el-input>
            </el-form-item>

            <el-form-item label="法人手机:" prop="phone">
              <el-input v-model="dat.phone"></el-input>
            </el-form-item>

            <el-form-item label="证件号:" prop="num">
              <el-input v-model="dat.num"></el-input>
            </el-form-item>

            <el-form-item label="联系电话:" prop="phoneNum">
              <el-input v-model="dat.phoneNum"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveEdit">确 定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 查看详情框弹出 -->
    <el-dialog title="详情" v-model="checkVisible" width="60%">
      <div class="con">
        <div class="left">
          <el-form label-position="center" label-width="80px">
            <el-form-item label="业户名称:" prop="name">
              <el-input v-model="dat2.name" disabled="disabled"></el-input>
            </el-form-item>

            <el-form-item label="许可证号:" prop="number">
              <el-input v-model="dat2.number" disabled="disabled"></el-input>
            </el-form-item>

            <el-form-item label="有效期始:" prop="firstDate">
              <el-input v-model="dat2.firstDate" disabled="disabled"></el-input>
            </el-form-item>

            <el-form-item label="有效期止:" prop="lastDate">
              <el-input v-model="dat2.lastDate" disabled="disabled"></el-input>
            </el-form-item>

            <el-form-item label="核发机关:" prop="hefa">
              <el-input v-model="dat2.hefa" disabled="disabled"></el-input>
            </el-form-item>

            <el-form-item label="核发日期:" prop="hefaDate">
              <el-input v-model="dat2.hefaDate" disabled="disabled"></el-input>
            </el-form-item>

            <el-form-item label="经济类型:" prop="jingji">
              <el-input v-model="dat2.jingji" disabled="disabled"></el-input>
            </el-form-item>

            <el-form-item label="法人姓名:" prop="name2">
              <el-input v-model="dat2.name2" disabled="disabled"></el-input>
            </el-form-item>

            <el-form-item label="证件类别:" prop="zhengjian">
              <el-input v-model="dat2.zhengjian" disabled="disabled"></el-input>
            </el-form-item>

            <el-form-item label="联系地址:" prop="address">
              <el-input v-model="dat2.address" disabled="disabled"></el-input>
            </el-form-item>
          </el-form>
        </div>

        <div class="right">
          <el-form label-position="left" label-width="80px">
            <el-form-item label="业户类别:" prop="yehu">
              <el-input v-model="dat2.yehu" disabled="disabled"></el-input>
            </el-form-item>

            <el-form-item label="经营范围:" prop="rank">
              <el-input type="textarea" :rows="13" v-model="dat2.rank" style="margin-bottom: 5px" disabled="disabled">
              </el-input>
            </el-form-item>

            <el-form-item label="经营状态:" prop="jingying">
              <el-input v-model="dat2.jingying" disabled="disabled"></el-input>
            </el-form-item>

            <el-form-item label="法人手机:" prop="phone">
              <el-input v-model="dat2.phone" disabled="disabled"></el-input>
            </el-form-item>

            <el-form-item label="证件号:" prop="num">
              <el-input v-model="dat2.num" disabled="disabled"></el-input>
            </el-form-item>

            <el-form-item label="联系电话:" prop="phoneNum">
              <el-input v-model="dat2.phoneNum" disabled="disabled"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-dialog>
  </div>
</template>



<script>
import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { fetchData } from "../api/index";
import axios from "axios";

export default {
  name: "file_1",
  data() {
    return {
      editVisible: false,
      checkVisible: false,
      eidtFormChanged: false,
      tableData: [
        {
          id: 1,
          name: "温世杰",
          kind: "",
          rank: "道路普通货物运输",
          number: "00000000",
          firstDate: "2015-7-27",
          lastDate: "2019-7-26",
          hefa: "赣州市道路运输管理局",
          jingying: "营运",
          inTime: "2018-11-3",
          updateTime: "",
          hefaDate: "2018-8-9",
          jingji: "个体经济",
          name2: "温世杰",
          zhengjian: "身份证",
          address: "xx市xx县xxxxxx",
          phone: "11111111111",
          num: "1235566666",
          phoneNum: "1111111111",
        },
        {
          id: 2,
          name: "柳长青",
          kind: "",
          rank: "道路普通货物运输",
          number: "00000000",
          firstDate: "2016-7-27",
          lastDate: "2018-7-26",
          hefa: "赣州市道路运输管理局",
          jingying: "营运",
          inTime: "2018-11-3",
          updateTime: "",
        },
        {
          id: 3,
          name: "林利萍",
          kind: "",
          rank: "道路普通货物运输",
          number: "00000000",
          firstDate: "2018-7-27",
          lastDate: "2020-7-26",
          hefa: "赣州市道路运输管理局",
          jingying: "营运",
          inTime: "2018-11-3",
          updateTime: "",
        },
        {
          id: 4,
          name: "朱永春",
          kind: "",
          rank: "道路普通货物运输",
          number: "00000000",
          firstDate: "2015-7-27",
          lastDate: "2018-7-26",
          hefa: "赣州市道路运输管理局",
          jingying: "营运",
          inTime: "2018-11-3",
          updateTime: "",
        },
        {
          id: 5,
          name: "胡海东",
          kind: "",
          rank: "道路普通货物运输",
          number: "00000000",
          firstDate: "2017-7-27",
          lastDate: "2019-7-26",
          hefa: "赣州市道路运输管理局",
          jingying: "营运",
          inTime: "2018-11-3",
          updateTime: "",
        },
        {
          id: 6,
          name: "柳长青",
          kind: "",
          rank: "道路普通货物运输",
          number: "00000000",
          firstDate: "2012-7-27",
          lastDate: "2019-7-26",
          hefa: "赣州市道路运输管理局",
          jingying: "营运",
          inTime: "2018-11-3",
          updateTime: "",
        },
      ],
      pageTotal: 20,
      //   用于编辑时读取数据
      dat: {
        id: "",
        name: "",
        kind: "",
        rank: "",
        number: "",
        firstDate: "",
        lastDate: "",
        hefa: "",
        jingying: "",
        inTime: "",
        updateTime: "",
        hefaDate: "",
        jingji: "",
        name2: "",
        zhengjian: "",
        address: "",
        phone: "",
        num: "",
        phoneNum: "",
      },
      //   用于查看详情时读取数据
      dat2: {
        id: "",
        name: "",
        kind: "",
        rank: "",
        number: "",
        firstDate: "",
        lastDate: "",
        hefa: "",
        jingying: "",
        inTime: "",
        updateTime: "",
        hefaDate: "",
        jingji: "",
        name2: "",
        zhengjian: "",
        address: "",
        phone: "",
        num: "",
        phoneNum: "",
      },
      oldData: {},
    };
  },

  // 监听数据是否改变，用于编辑保存
  watch: {
    dat: {
      handler(val) {
        for (let i in this.dat) {
          if (val[i] != this.oldData[i]) {
            this.eidtFormChanged = true;
            break;
          } else {
            this.eidtFormChanged = false;
          }
        }
      },
      deep: true,
    },
  },

  methods: {
    handleEdit(index, row) {
      var _this = this;
      this.editVisible = true;
      // this.oldData = row;
      // this.dat.name = row.name;
      // this.dat.kind = row.kind;
      // this.dat.number = row.number;
      // this.dat.firstDate = row.firstDate;
      // this.dat.lastDate = row.lastDate;
      // this.dat.hefa = row.hefa;
      // this.dat.jingying = row.jingying;
      // this.dat.inTime = row.inTime;
      // this.dat.updateTime = row.updateTime;
      this.dat = row;
    },

    // 判断是否修改，如果改变则保存数据
    saveEdit() {
      console.log(this.oldData);
      console.log(this.dat);
      alert(this.eidtFormChanged);
      if (this.eidtFormChanged) {
        // 发送axios请求
      } else {
        alert("数据未修改");
      }
    },

    // 查看详情，获取index和整行信息
    check(index, row) {
      var _this = this;
      this.checkVisible = true;
      this.dat2 = row;
    },
    add() {
      this.$router.push("/add");
    },
    handleSizeChange(val) { },
    handleCurrentChange(val) { },
    handlePageChange(size) {
      alert(size);

      // 发送aixos请求，获取数据之后放到tableData
      this.getInformation(size, 5);
    },
    getInformation(cp, ps) {
      var _this = this;
      axios
        .post("/user", {
          currentPage: cp,
          pageSize: ps,
        })
        .then(function (response) {
          _this.tableData = response.infor;
          _this.pageTotal = response.pageCount;
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        });
    },
  },
};
</script>

<style scoped>
.con {
  display: flex;
  margin-left: auto;
  margin-right: auto;
  width: 900px;
}
.left {
  display: inline-block;
  width: 420px;
}

.right {
  display: inline-block;
  margin-left: 50px;
  width: 420px;
}
.handle-select {
  width: 133px;
}

.handle-input {
  width: 300px;
  display: inline-block;
}
.table {
  width: 100%;
  font-size: 14px;
}
.red {
  color: #ff0000;
}
.mr10 {
  margin-right: 10px;
}

.table-td-thumb {
  display: block;
  margin: auto;
  width: 40px;
  height: 40px;
}

.handle-input {
  width: 150px;
}

.btn {
  display: inline-block;
  margin-left: 5px;
}

el-table-column {
  width: 150px;
}

.page {
  margin-top: 10px;
  position: right;
}
</style>
