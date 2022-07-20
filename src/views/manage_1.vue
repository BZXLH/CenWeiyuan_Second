<template>
  <div>
    <div class="container">
      <div class="handle-box">
        <el-form inline="true" size="mini" label-wid>
          <el-form-item label="单位名称:" prop="danwei">
            <el-select v-model="query.danwei" class="handle-select mr10">
              <el-option key="1" label="广东省" value="广东省"></el-option>
              <el-option key="2" label="湖南省" value="湖南省"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="任务名称:" prop="task">
            <el-input v-model="query.task" class="handle-input mr10"></el-input>
          </el-form-item>

          <el-form-item label="任务类别:" prop="kind">
            <el-select
              v-model="query.kind"
              placeholder="全部"
              class="handle-select mr10"
            >
              <el-option key="1" label="广东省" value="广东省"></el-option>
              <el-option key="2" label="湖南省" value="湖南省"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="活动时间">
            <el-col :span="11">
              <el-date-picker
                type="date"
                placeholder="选择日期"
                v-model="form.date1"
                style="width: 120px"
              ></el-date-picker>
            </el-col>
            <el-col class="line" :span="2">-</el-col>
            <el-col :span="11">
              <el-date-picker
                type="date"
                placeholder="选择日期"
                v-model="form.date1"
                style="width: 120px"
              ></el-date-picker>
            </el-col>
          </el-form-item>

          <el-form-item label="被检/整改单位名称:" prop="name">
            <el-input v-model="query.name" class="handle-input mr10"></el-input>
          </el-form-item>
          <div class="btn">
            <el-button type="primary" size="small" @click="handleSearch"
              >查询</el-button
            >
            <el-button type="primary" size="small" @click="open"
              >新增</el-button
            >
            <el-button type="success" size="small" @click="handleSearch"
              >重置</el-button
            >
          </div>
        </el-form>
      </div>

      <el-table
        :data="tableData"
        border
        stripe
        height="540"
        class="table"
        ref="multipleTable"
        header-cell-class-name="table-header"
        :default-sort="{ prop: 'id' }"
      >
        <el-table-column
          prop="id"
          sortable
          width="55"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="number"
          label="车牌号"
          align="center"
        ></el-table-column>
        <el-table-column prop="color" label="车牌颜色" align="center">
        </el-table-column>
        <el-table-column prop="kind1" label="车辆类别" align="center">
        </el-table-column>
        <el-table-column prop="kind2" label="车辆类型" align="center">
        </el-table-column>
        <el-table-column
          prop="rank"
          label="经营范围"
          align="center"
        ></el-table-column>
        <el-table-column prop="rank" label="经营范围" align="center">
        </el-table-column>
        <el-table-column prop="name" label="业户名称" align="center">
        </el-table-column>
        <el-table-column prop="num" label="道路运输证号" align="center">
        </el-table-column>
        <el-table-column
          prop="firstDate"
          sortable
          label="有效期起"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="lastDate"
          sortable
          label="有效期至"
          align="center"
        >
        </el-table-column>

        <el-table-column prop="hefa" label="核发机关" align="center">
        </el-table-column>
        <el-table-column prop="yingyun" label="营运状态" align="center">
        </el-table-column>
        <el-table-column prop="inTime" sortable label="入库时间" align="center">
        </el-table-column>
        <el-table-column
          prop="updateTime"
          sortable
          label="更新时间"
          align="center"
        >
        </el-table-column>

        <el-table-column label="操作" width="180" align="center">
          <template #default="scope">
            <el-button type="text" @click="check()">查看详情 </el-button>
            <el-button type="text" @click="handleEdit(scope.$index, scope.row)"
              >编辑
            </el-button>
            <el-button
              type="text"
              class="red"
              @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="query.pageIndex"
          :page-size="query.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="13"
        >
        </el-pagination>
      </div>
    </div>

    <!-- 编辑弹出框 -->
    <el-dialog title="编辑" v-model="editVisible" width="30%">
      <el-form label-width="150px">
        <el-form-item label="车牌号">
          <el-input v-model="form.number"></el-input>
        </el-form-item>
        <el-form-item label="车牌颜色">
          <el-input v-model="form.color"></el-input>
        </el-form-item>
        <el-form-item label="车辆类别">
          <el-input v-model="form.kind1"></el-input>
        </el-form-item>
        <el-form-item label="车辆类型">
          <el-input v-model="form.kind2"></el-input>
        </el-form-item>
        <el-form-item label="经营范围">
          <el-input v-model="form.rank"></el-input>
        </el-form-item>
        <el-form-item label="业户名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="道路运输证号">
          <el-input v-model="form.num"></el-input>
        </el-form-item>
        <el-form-item label="有效期起">
          <el-input v-model="form.firstDate"></el-input>
        </el-form-item>
        <el-form-item label="有效期至">
          <el-input v-model="form.lastDate"></el-input>
        </el-form-item>
        <el-form-item label="核发机关">
          <el-input v-model="form.hefa"></el-input>
        </el-form-item>
        <el-form-item label="营运状态">
          <el-input v-model="form.jingying"></el-input>
        </el-form-item>

        <el-form-item label="入库时间">
          <el-input v-model="form.inTime"></el-input>
        </el-form-item>
        <el-form-item label="更新时间">
          <el-input v-model="form.updateTime"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveEdit">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";

export default {
  name: "file_2",
  data() {
    return {
      currentPage1: 5,
      currentPage2: 5,
      currentPage3: 5,
      currentPage4: 4,
      pageTotal: 4,
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
        {
          id: 7,
          name: "柳长青",
          kind: "",
          rank: "道路普通货物运输",
          number: "00000000",
          firstDate: "2015-7-27",
          lastDate: "2019-7-26",
          hefa: "赣州市道路运输管理局",
          jingying: "营运",
          inTime: "2018-11-3",
          updateTime: "",
        },
        {
          id: 8,
          name: "柳长青",
          kind: "",
          rank: "道路普通货物运输",
          number: "00000000",
          firstDate: "2015-7-27",
          lastDate: "2019-7-26",
          hefa: "赣州市道路运输管理局",
          jingying: "营运",
          inTime: "2018-11-3",
          updateTime: "",
        },
        {
          id: 9,
          name: "柳长青",
          kind: "",
          rank: "道路普通货物运输",
          number: "00000000",
          firstDate: "2015-7-27",
          lastDate: "2019-7-26",
          hefa: "赣州市道路运输管理局",
          jingying: "营运",
          inTime: "2018-11-3",
          updateTime: "",
        },
        {
          id: 10,
          name: "柳长青",
          kind: "",
          rank: "道路普通货物运输",
          number: "00000000",
          firstDate: "2015-7-27",
          lastDate: "2019-7-26",
          hefa: "赣州市道路运输管理局",
          jingying: "营运",
          inTime: "2018-11-3",
          updateTime: "",
        },
        {
          id: 11,
          name: "柳长青",
          kind: "",
          rank: "道路普通货物运输",
          number: "00000000",
          firstDate: "2015-7-27",
          lastDate: "2019-7-26",
          hefa: "赣州市道路运输管理局",
          jingying: "营运",
          inTime: "2018-11-3",
          updateTime: "",
        },
        {
          id: 12,
          name: "柳长青",
          kind: "",
          rank: "道路普通货物运输",
          number: "00000000",
          firstDate: "2015-7-27",
          lastDate: "2019-7-26",
          hefa: "赣州市道路运输管理局",
          jingying: "营运",
          inTime: "2018-11-3",
          updateTime: "",
        },
        {
          id: 13,
          name: "柳长青",
          kind: "",
          rank: "道路普通货物运输",
          number: "00000000",
          firstDate: "2015-7-27",
          lastDate: "2019-7-26",
          hefa: "赣州市道路运输管理局",
          jingying: "营运",
          inTime: "2018-11-3",
          updateTime: "",
        },
      ],
    };
  },
  setup() {
    const query = reactive({
      address: "",
      name: "",
      pageIndex: 1,
      pageSize: 10,
    });

    const pageTotal = ref(0);

    // 查询操作
    const handleSearch = () => {
      query.pageIndex = 1;
      getData();
    };
    // 分页导航
    const handlePageChange = (val) => {
      query.pageIndex = val;
      getData();
    };

    // 删除操作
    const handleDelete = (index) => {
      // 二次确认删除
      ElMessageBox.confirm("确定要删除吗？", "提示", {
        type: "warning",
      })
        .then(() => {
          ElMessage.success("删除成功");
          tableData.value.splice(index, 1);
        })
        .catch(() => {});
    };

    // 表格编辑时弹窗和保存
    const editVisible = ref(false);
    let form = reactive({
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
    });
    let idx = -1;
    const handleEdit = (index, row) => {
      idx = index;
      Object.keys(form).forEach((item) => {
        form[item] = row[item];
      });
      editVisible.value = true;
    };
    const saveEdit = () => {
      editVisible.value = false;
      ElMessage.success(`修改第 ${idx + 1} 行成功`);
      Object.keys(form).forEach((item) => {
        tableData.value[idx][item] = form[item];
      });
    };

    return {
      query,

      pageTotal,
      editVisible,
      form,
      handleSearch,
      handlePageChange,
      handleDelete,
      handleEdit,
      saveEdit,
    };
  },
  methods: {
    check() {
      this.$router.push("/check");
    },
    add() {
      this.$router.push("/add");
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
  },
};
</script>

<style scoped>
.el-form--inline .el-form-item {
  margin-right: 0;
}

.el-form el-form--inline {
  width: 1800px;
}

.handle-select {
  width: 100px;
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
  width: 145px;
}

.btn {
  margin-bottom: 10px;
}

el-table-column {
  width: 150px;
}

.page {
  margin-top: 10px;
  position: right;
}
</style>
