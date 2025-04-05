<template>
  <div>
    <!-- <TableSearch :query="query" :options="searchOpt" :search="handleSearch" /> -->
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
          <el-tag type="warning" v-if="rows.status == 0">禁用</el-tag>
          <el-tag type="success" v-else-if="rows.status == 1">正常</el-tag>
          <el-tag type="info" v-else>已停止</el-tag>
        </template>
        <template #toolbarBtn>

          <!-- <el-button type="success" @click="daochu()">
            <el-icon style="margin-right: 5px"
              ><el-icon><UploadFilled /></el-icon
            ></el-icon>
            导出
          </el-button> -->
        </template>
      </TableCustom>
    </div>
    <el-dialog
      :title="isEdit ? '编辑' : '新增'"
      v-model="visible"
      width="700px"
      destroy-on-close
      :close-on-click-modal="false"
      @close="closeDialog"
      bu
    >
      <TableEdit
        :form-data="rowData"
        :options="isEdit ? options : newoptions"
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
  </div>
</template>

<script setup lang="ts" name="system-user">
import { ref, reactive } from "vue";
import { ElMessage } from "element-plus";
import { CirclePlusFilled } from "@element-plus/icons-vue";
import { User } from "@/types/user";
import {
  fetchUserData,
  updateStatus,
  SearchCourse,
  fetchAdminData,
} from "@/api";
import TableCustom from "@/components/table-custom.vue";
import TableDetail from "@/components/table-detail.vue";
import TableSearch from "@/components/table-search.vue";
import { FormOption, FormOptionList } from "@/types/form-option";
import axios from "axios";
import { useRouter } from "vue-router";
import { ElMessageBox } from "element-plus";
const router = useRouter();
// const goTologon = () => {
//   // 使用 router.push 方法进行页面跳转
//   router.push("/login");
//   ElMessage.error("获取数据失败");
// };
console.log(TableSearch.props, "search");
const startTime = ref("");
const endTime = ref("");
// 查询相关
const query = reactive({
  //name: "",
});
const searchOpt = ref<FormOptionList[]>([
  { type: "input", label: "查询：", prop: "projectpracticeCode" },
]);

// 表格相关
let columns = ref([
  { type: "index", label: "序号", width: 55, align: "center" },
 // { type: "selection", width: 55, align: "center" },
  //{ prop: "ad", label: "序号", width: 55, align: "center" },
  { prop: "account", label: "用户账号", align: "center" },
  { prop: "avatar", label: "头像", align: "center" },
  { prop: "name", label: "名称" },
  { prop: "gender", label: "性别" },
  { prop: "location", label: "地区" },
  { prop: "createTime", label: "创建时间" },
  { prop: "publicNumber", label: "发布实习数量" },
  {prop: "status", label: "状态", slotName: "status" },
  { prop: "forbid", label: "操作", width: 150 },
]);
const page = reactive({
  index: 1,
  size: 20,
  total: 0,
});
const componentKey = ref(0); // 强制刷新组件
const tableData = ref([]);
const getData = async (e, p) => {
  const ress = await fetchUserData(e, p);
  if (ress == "Request failed with status code 403") {
    //goTologon();
  }
  // tableData.value = [
  //   {
  //     ad: "1",
  //     sno: "2020210401",
  //     tou: "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
  //     name: "张三",
  //     sex: "男",
  //     where: "北京",
  //     time: "2022-01-01",
  //     num: "3",
  //   },
  //   {
  //     ad: "2",
  //     sno: "2020210402",
  //     tou: "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
  //     name: "李四",
  //     sex: "男",
  //     where: "上海",
  //     time: "2022-01-02",
  //     num: "2",
  //   },
  //   {
  //     ad: "3",
  //     sno: "2020210403",
  //     tou: "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
  //     name: "王五",
  //     sex: "女",
  //     where: "广州",
  //     time: "2022-01-03",
  //     num: "1",
  //   },
  //   {
  //     ad: "4",
  //     sno: "2020210404",
  //     tou: "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
  //     name: "赵六",
  //     sex: "女",
  //     where: "深圳",
  //     time: "2022-01-04",
  //     num: "0",
  //   }
  // ];
  // page.total = 4;
  ress.data.records.forEach((item) => {
    if(item.createTime){
    const dateTime = item.createTime;
    item.createTime = dateTime.replace("T", " ");
    }
  })
  tableData.value = ress.data.records;
  page.total = ress.data.total;
  componentKey.value++;
  //console.log(ress, tableData.value, "tableData");
};
getData(1, 0);

const handleSearch = async (queryData) => {
  if (!queryData.projectpracticeCode) {
    getData(1, 0);
  } else {
    const ress = await SearchCourse(queryData.projectpracticeCode);
    if (ress == null) {
      ElMessage.error("查询失败");
    } else {
      tableData.value = ress.ProjectPracticeInfoList;
      page.total = ress.total;
      componentKey.value++;
    }
  }
};

const changePage = (val: number, name: string, p) => {
  page.index = val;
  getData(page.index, p);
};
function formatDate(dateString) {
  // 创建 Date 对象
  const date = new Date(dateString);

  // 获取年、月、日、时、分、秒
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // getMonth() 返回的月份是从 0 开始的
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  // 格式化月份和日期，确保它们是两位数
  const formattedMonth = month < 10 ? `0${month}` : month;
  const formattedDay = day < 10 ? `0${day}` : day;
  const formattedHours = hours < 10 ? `0${hours}` : hours;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

  // 组合成目标格式
  return `${year}-${formattedMonth}-${formattedDay} ${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}
function getRecentYears(numYears) {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = 0; i < numYears; i++) {
    years.push({
      label: currentYear - i,
      value: currentYear - i
    });
  }
  return years;
}

const recentYears = getRecentYears(4); // 获取最近3年
// 新增/编辑弹窗相关
let options = ref<FormOption>({
  labelWidth: "140px",
  span: 12,
  list: [
  {
      type: "status",
      label: "用户状态",
      prop: "status",
      required: true,
    },
  ],
});
let newoptions = ref<FormOption>({
  labelWidth: "140px",
  span: 12,
  list: [
    
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
  getData(1, 0);
};

const updateData = async (e) => {
  e.selectEtime = formatDate(e.selectEtime);
  e.selectStime = formatDate(e.selectStime);
  e.titleEtime = formatDate(e.titleEtime);
  e.titleStime = formatDate(e.titleStime);

  if (isEdit.value) {
    console.log(e, "编辑数据");

       const res = await updateStatus(e);
       console.log(res, "更新数据");

  } else {

  }
  closeDialog();
  setTimeout(() => {
    getData(1, 0);
  }, 500);
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
    prop: "sno",
    label: "管理员账号",
   },
   {
    prop: "time",
    label: "时间",

   },
   {
    prop: "password",
    label: "密码",
   },
   {
    prop: "name",
    label: "姓名",
   },
   {
    prop: "role",
    label: "角色",
   },
  ];
  visible1.value = true;
};

// 删除相关
const handleDelete = async (row) => {
  //console.log(row, "删除");
  //const res = await DeleteCourseData(row.projectpracticeCode);
 
  getData(1, 0);
  page.index = 1;
};
</script>

<style scoped></style>
