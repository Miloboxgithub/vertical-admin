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
          <el-tag type="warning" v-if="rows.status == 0">未开始</el-tag>
          <el-tag type="success" v-else-if="rows.status == 1">已开始</el-tag>
          <el-tag type="info" v-else>已停止</el-tag>
        </template>
        <template #toolbarBtn>
          <el-button
            type="warning"
            :icon="CirclePlusFilled"
            @click="visible = true"
            >新增实践课程</el-button
          >
          <!-- <el-button type="primary" @click="visible2 = true">
              <el-icon style="margin-right: 5px"><CirclePlus /></el-icon>
              增添不可预约时段
            </el-button> -->
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
          <el-tag type="warning" v-if="rows.status == 0">未开始</el-tag>
          <el-tag type="success" v-else-if="rows.status == 1">已开始</el-tag>
          <el-tag type="info" v-else>已停止</el-tag>
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
        :options="options"
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
import { fetchCourseData, DeleteCourseData, SearchCourse } from "@/api";
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
  { type: "input", label: "实践课程编号查询：", prop: "projectpracticeCode" },
]);

// 表格相关
let columns = ref([
  //{ type: "index", label: "序号", width: 55, align: "center" },
  { type: "selection", width: 55, align: "center" },
  { prop: "ad", label: "序号", width: 55, align: "center" },
  { prop: "projectpracticeCode", label: "实践课程编号" },
  { prop: "projectpracticeName", label: "实践课程名称", sortable: "custom" },
  { prop: "majorName", label: "专业" },
  { prop: "grade", label: "年级" },
  { prop: "adminName", label: "负责人" },
  { prop: "titleTime", label: "教师出题时间" },
  { prop: "selectTime", label: "学生选课时间" },
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
const getData = async (e, p) => {
  const ress = await fetchCourseData(e, p);
  if (ress == "Request failed with status code 403") {
    goTologon();
  }
  tableData.value = ress.ProjectPracticeInfoList;
  page.total = ress.total;

  componentKey.value++;
  console.log(ress, tableData.value, "tableData");
};
getData(1, 0);
const handleSearch = async (queryData) => {
  const ress = await SearchCourse(queryData.projectpracticeCode);
    if(ress==null){
      ElMessage.error("查询失败");
    }
    else{
    tableData.value = ress.ProjectPracticeInfoList;
    page.total = ress.total;
    componentKey.value++;
    }
  
};
const changePage = (val: number, name: string, p) => {
  page.index = val;
  getData(page.index, p);
};

// 新增/编辑弹窗相关
let options = ref<FormOption>({
  labelWidth: "130px",
  span: 11,
  list: [
    {
      type: "input",
      label: "实践课程编号",
      prop: "projectpracticeCode",
      required: true,
    },
    {
      type: "input",
      label: "实践课程名称",
      prop: "projectpracticeName",
      required: true,
    },
    {
      type: "select",
      label: "专业",
      prop: "majorId",
      required: true,
      options: [
        { label: "软件工程", value: 1 },
        { label: "计算机科学与技术", value: 2 },
        { label: "网络工程", value: 3 },
        { label: "物联网工程", value: 4 },
        { label: "数据科学与大数据技术", value: 5 },
        { label: "电子信息工程", value: 6 },
        { label: "自动化", value: 7 },
        { label: "智能科学与技术", value: 8 },
        { label: "电子科学与技术", value: 9 },
        { label: "通信工程", value: 10 },
        { label: "光电信息科学与工程", value: 11 },
      ],
    },
    {
      type: "select",
      label: "年级",
      prop: "grade",
      required: true,
      options: [
        { label: "2022", value: 1 },
        { label: "2023", value: 2 },
        { label: "2024", value: 3 },
      ],
    },
    {
      type: "datetimerange",
      label: "教师出题时间",
      prop: "titleTime", // 修改 prop 名称以反映它是时间范围
      required: true,
      //valueFormat: 'yyyy-MM-dd HH:mm:ss', // 设置返回值格式
    },
    {
      type: "datetimerange",
      label: "学生选课时间",
      prop: "selectTime",
      required: true,
    },
    { type: "input", label: "负责人", prop: "adminName", required: true },
    {
      type: "select",
      label: "状态",
      prop: "status",
      required: true,
      options: [
        { label: "未开始", value: 0 },
        { label: "已停止", value: 2 },
        { label: "已开始", value: 1 },
      ],
    },
  ],
});
//   let optionss = ref<FormOption>({
//     labelWidth: "100px",
//     span: 12,
//     list: [
//       { type: "input", label: "会议室ID", prop: "id", required: true },
//       { type: "date", label: "日期", prop: "date", required: true },
//       { type: "selects", label: "时段", prop: "time", required: true },
//     ],
//   });
const visible = ref(false);
const visible2 = ref(false);
const isEdit = ref(false);
const isEdits = ref(false);
const rowData = ref({});
const handleEdit = (row: User) => {
  rowData.value = { ...row };
  isEdit.value = true;
  visible.value = true;
  getData(1, "");
};
const updateData = () => {
  closeDialog();
  //getData(2);
  setTimeout(() => {
    getData(1, "");
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
      prop: "ad",
      label: "序号",
    },
    {
      prop: "projectpracticeCode",
      label: "实践课程编号",
    },
    {
      prop: "projectpracticeName",
      label: "实践课程名称",
    },
    {
      prop: "majorName",
      label: "专业",
    },
    {
      prop: "grade",
      label: "年级",
    },
    {
      prop: "adminName",
      label: "负责人",
    },
    {
      prop: "titleTime",
      label: "教师出题时间",
    },
    {
      prop: "selectTime",
      label: "学生选课时间",
    },
    {
      prop: "status",
      label: "状态",
    },
  ];
  visible1.value = true;
};

// 删除相关
const handleDelete = async (row) => {
  console.log(row, "删除");
  const res = await DeleteCourseData(row.projectpracticeCode);
  if (res.data.message == "success") {
    ElMessage.success("删除成功");
  } else {
    ElMessage.error("删除失败");
  }
  getData(1, "");
  page.index = 1;
};
</script>

<style scoped></style>
