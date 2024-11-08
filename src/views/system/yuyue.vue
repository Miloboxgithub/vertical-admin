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
          <el-tag type="success" v-if="rows.status==0">可预约</el-tag>
          <el-tag type="primary" v-else-if="rows.status==1">已预约</el-tag>
          <el-tag type="info" v-else-if="rows.status==2">已取消</el-tag>
          <el-tag type="danger" v-else-if="rows.status==3">不可预约</el-tag>
        </template>
        <!-- <template #toolbarBtn>
            <el-button
              type="warning"
              :icon="CirclePlusFilled"
              @click="visible = true"
              >新增</el-button
            >
          </template> -->
      </TableCustom>
    </div>
    <el-dialog
      :title="isEdit ? '编辑' : '新增会议室'"
      v-model="visible"
      width="700px"
      destroy-on-close
      :close-on-click-modal="false"
      @close="closeDialog"
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
          <el-tag type="success" v-if="rows.status==0">可预约</el-tag>
          <el-tag type="primary" v-else-if="rows.status==1">已预约</el-tag>
          <el-tag type="info" v-else-if="rows.status==2">已取消</el-tag>
          <el-tag type="danger" v-else-if="rows.status==3">不可预约</el-tag>
        </template>
      </TableDetail>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="system-user">
import { ref, reactive } from "vue";
import { ElMessage } from "element-plus";
import { CirclePlusFilled } from "@element-plus/icons-vue";
import { User } from "@/types/user";
import { fetchUserData3, DeleteData3 } from "@/api";
import TableCustom from "@/components/table-custom.vue";
import TableDetail from "@/components/table-detail.vue";
import TableSearch from "@/components/table-search.vue";
import { FormOption, FormOptionList } from "@/types/form-option";
import { useRouter } from "vue-router";
import axios from "axios";
const router = useRouter();
const goTologon = () => {
  // 使用 router.push 方法进行页面跳转
  router.push('/login');
};

console.log(TableSearch.props, "search");
const startTime = ref("");
const endTime = ref("");
// 查询相关
const query = reactive({
  ymd: "",
});
const searchOpt = ref<FormOptionList[]>([
  { type: "input", label: "预约人查询：", prop: "appointmentPerson" },
]);
const handleSearch = (queryData) => {
  console.log(queryData, "搜索");

  changePage(1, queryData.appointmentPerson,'');
};

// 表格相关
let columns = ref([
  { type: "index", label: "序号", width: 55, align: "center" },
  { prop: "appointmentPerson", label: "预约人" },
  { prop: "meetingroomName", label: "会议室名称" },
  { prop: "appointmentDate", label: "预约日期" ,sortable: 'custom'},
  { prop: "appointmentSno", label: "预约人工号" },
  { prop: "appointmentType", label: "会议类型" },
  { prop: "appointmentTime", label: "预约时段" },
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
const getData = async (e, n,p) => {
  const ress = await fetchUserData3(e, n,p);
  console.log(ress, "shdfbkjdbgdfjk");
  if(ress=='Request failed with status code 403'){
    goTologon();
  }
  tableData.value = ress.list;
  page.total = ress.total;

  componentKey.value++;
  console.log(tableData.value, "tableData");
};
getData(1, "",'');

const changePage = (val: number, name: string,p) => {
  page.index = val;
  getData(page.index, name,p);
};

// 新增/编辑弹窗相关
let options = ref<FormOption>({
  labelWidth: "100px",
  span: 12,
  list: [
    { type: "input", label: "预约人", prop: "appointmentPerson", required: true },
    //{ type: "input", label: "会议室名称", prop: "room_name", required: true },
    { type: "input", label: "预约日期", prop: "appointmentDate", required: true },
    // { type: "input", label: "Status", prop: "status", required: true },
    //{ type: "select", label: "时间", prop: "time", required: true },
    {
      type: "input",
      label: "预约人工号",
      prop: "appointmentSno",
      required: true,
    },
    { type: "input", label: "会议类型", prop: "appointmentType", required: true },
    {type:"input",label:"status",prop:"status",required:true},
  ],
});
const visible = ref(false);
const isEdit = ref(false);
const rowData = ref({});
const handleEdit = (row: User) => {
  rowData.value = { ...row };
  isEdit.value = true;
  visible.value = true;
  getData(1, "",'');
};
const updateData = () => {
  closeDialog();
  //getData(2);
  setTimeout(() => {
    getData(1, "",'');
  }, 500);
  //getData(1, "");
  console.log("更新数据");
};

const closeDialog = () => {
  visible.value = false;
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
      prop: "appointmentPerson",
      label: "预约人",
    },
    {
      prop: "meetingroomName",
      label: "会议室名称",
    },
    {
      prop: "appointmentDate",
      label: "预约日期",
    },
    {
      prop: "appointmentSno",
      label: "预约人工号",
    },
    {
      prop: "appointmentType",
      label: "会议类型",
    },
    {
      prop: "appointmentTime",
      label: "时段",
    },
    {
      prop: "status",
      label: "状态",
    },
  ];
  visible1.value = true;
};

// 删除相关
const handleDelete = async (row: User) => {
  console.log(row, "删除");
  const res = await DeleteData3(row.id);
  if (res.data.message == "success") {
    ElMessage.success("删除成功");
  } else {
    ElMessage.error("删除失败");
  }
  getData(1, "",'');
  page.index = 1;
};
</script>

<style scoped></style>
