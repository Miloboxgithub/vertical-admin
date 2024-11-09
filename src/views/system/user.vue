<template>
  <div>
    <TableSearch :query="query" :options="searchOpt" :search="handleSearch" />
    <div class="container">
      <TableCustom
        :key="componentKey"
        :columns="columns"
        :tableData="tableData"
        :total="page.total"
        :currentPage="page.index"
        :viewFunc="handleView"
        :delFunc="handleDelete"
        :changePage="changePage"
        :editFunc="handleEdit"
      >
        <template #status="{ rows }">
          <el-tag type="success" v-if="rows.status == '正常'">正常</el-tag>
          <el-tag type="danger" v-else>不可预约</el-tag>
        </template>
        <template #toolbarBtn>
          <el-button
            type="warning"
            :icon="CirclePlusFilled"
            @click="visible = true"
            >新增</el-button
          >
          <el-button type="primary" @click="visible2 = true">
            <el-icon style="margin-right: 5px"><CirclePlus /></el-icon>
            增添不可预约时段
          </el-button>
        </template>
      </TableCustom>
    </div>
    <el-dialog
      :title="isEdit ? '编辑' : '新增会议室'"
      v-model="visible"
      width="700px"
      destroy-on-close
      :close-on-click-modal="false"
      @close="closeDialog"
      bu
    >
      <TableEdit
        :form-data="rowData"
        :options="options"
        :edit="isEdit"
        :update="updateData"
      />
    </el-dialog>
    <el-dialog
      title="查看详情"
      v-model="visible1"
      width="700px"
      destroy-on-close
    >
      <TableDetail :data="viewData">
        <template #status="{ rows }">
          <el-tag type="success" v-if="rows.status == '正常'">正常</el-tag>
          <el-tag type="danger" v-else>不可预约</el-tag>
        </template>
      </TableDetail>
    </el-dialog>
    <el-dialog
      title="增添不可预约时段"
      v-model="visible2"
      width="700px"
      destroy-on-close
      :close-on-click-modal="false"
      @close="closeDialog"
    >
      <TableEdit
        :form-data="rowData"
        :options="optionss"
        :edits="visible2"
        :update="updateData"
      />
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="system-user">
import { ref, reactive } from "vue";
import { ElMessage } from "element-plus";
import { CirclePlusFilled } from "@element-plus/icons-vue";
import { User } from "@/types/user";
import { fetchUserData, DeleteData } from "@/api";
import TableCustom from "@/components/table-custom.vue";
import TableDetail from "@/components/table-detail.vue";
import TableSearch from "@/components/table-search.vue";
import { FormOption, FormOptionList } from "@/types/form-option";
import axios from "axios";
import { useRouter } from "vue-router";
const router = useRouter();
const goTologon = () => {
  // 使用 router.push 方法进行页面跳转
  router.push("/login");
  ElMessage.error("获取数据失败");
};
console.log(TableSearch.props, "search");
const startTime = ref("");
const endTime = ref("");
// 查询相关
const query = reactive({
  name: "",
});
const searchOpt = ref<FormOptionList[]>([
  { type: "input", label: "会议室查询：", prop: "name" },
]);
const handleSearch = (queryData) => {
  console.log(queryData, "搜索");

  changePage(1, queryData.name, "");
};
// 表格相关
let columns = ref([
  { type: "index", label: "序号", width: 55, align: "center" },
  { prop: "id", label: "会议室ID" },
  { prop: "name", label: "会议室名称", sortable: "custom" },
  { prop: "capacity", label: "容纳人数" },
  { prop: "status", label: "状态" },
  { prop: "operator", label: "操作", width: 250 },
]);
const page = reactive({
  index: 1,
  size: 10,
  total: 0,
});
const componentKey = ref(0); // 强制刷新组件
const tableData = ref<User[]>([]);
const getData = async (e, n, p) => {
  const ress = await fetchUserData(e, n, p);
  if (ress == "Request failed with status code 403") {
    goTologon();
  }
  //console.log(ress, "shdfbkjdbgdfjk");
  tableData.value = ress.list;
  page.total = ress.total;

  componentKey.value++;
  console.log(ress, tableData.value, "tableData");
};
getData(1, "", "");

const changePage = (val: number, name: string, p) => {
  page.index = val;
  getData(page.index, name, p);
};

// 新增/编辑弹窗相关
let options = ref<FormOption>({
  labelWidth: "100px",
  span: 12,
  list: [
    { type: "input", label: "会议室名称", prop: "name", required: true },
    { type: "input", label: "容纳人数", prop: "capacity", required: true },
    { type: "status", label: "状态", prop: "status", required: true },
    // { type: "select", label: "时间", prop: "time", required: true },
  ],
});
let optionss = ref<FormOption>({
  labelWidth: "100px",
  span: 12,
  list: [
    { type: "input", label: "会议室ID", prop: "id", required: true },
    { type: "date", label: "日期", prop: "date", required: true },
    { type: "selects", label: "时段", prop: "time", required: true },
  ],
});
const visible = ref(false);
const visible2 = ref(false);
const isEdit = ref(false);
const isEdits = ref(false);
const rowData = ref({});
const handleEdit = (row: User) => {
  rowData.value = { ...row };
  isEdit.value = true;
  visible.value = true;
  getData(1, "", "");
};
const updateData = () => {
  closeDialog();
  //getData(2);
  setTimeout(() => {
    getData(1, "", "");
  }, 500);
  //getData(1, "");
  console.log("更新数据");
};

const closeDialog = () => {
  visible.value = false;
  visible2.value = false;
  isEdit.value = false;
};

// 查看详情弹窗相关
const visible1 = ref(false);
const viewData = ref({
  row: {},
  list: [],
});
const handleView = (row: User) => {
  viewData.value.row = { ...row };
  viewData.value.list = [
    {
      prop: "name",
      label: "会议室名称",
    },
    {
      prop: "capacity",
      label: "容纳人数",
    },
    {
      prop: "status",
      label: "Status",
    },
  ];
  visible1.value = true;
};

// 删除相关
const handleDelete = async (row: User) => {
  console.log(row, "删除");
  const res = await DeleteData(row.id);
  if (res.data.message == "success") {
    ElMessage.success("删除成功");
  } else {
    ElMessage.error("删除失败");
  }
  getData(1, "", "");
  page.index = 1;
};
</script>

<style scoped></style>
