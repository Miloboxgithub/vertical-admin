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
          <el-tag type="warning" v-if="rows.status == 0">未开始</el-tag>
          <el-tag type="success" v-else-if="rows.status == 1">已开始</el-tag>
          <el-tag type="info" v-else>已停止</el-tag>
        </template>
        <template #toolbarBtn>
          <!-- <el-button
            type="warning"
            :icon="CirclePlusFilled"
            @click="
              visible = true;
              isEdit = false;
            "
            >新增职位</el-button
          > -->
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
  fetchReportData,
  DeleteReportData,
  SearchCourse,
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
//console.log(TableSearch.props, "search");
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
  //{ type: "selection", width: 55, align: "center" },
  //{ prop: "ad", label: "序号", width: 55, align: "center" },
  
  { prop: "account", label: " 用户账号"},
  {prop: "internshipId", label: "实习ID" },
  { prop: "reason", label: "举报原因"},
  { prop: "description", label: "描述详情" },
  { type:'imgs',prop1: "screenshot1", prop2: "screenshot2", prop3: "screenshot3", label: "相关截图" ,width: 250 },
  { prop: "createTime", label: "举报时间" },
  { prop: "contactWay", label: "联系方式"},
  { prop: "operator1", label: "操作", width: 150 },
]);
const page = reactive({
  index: 1,
  size: 20,
  total: 0,
});
const componentKey = ref(0); // 强制刷新组件
const tableData = ref([]);
const getData = async (e, p) => {
  const ress = await fetchReportData(e, p);
  if (ress == "Request failed with status code 403") {
    //goTologon();
  }
  // tableData.value = [
  //   {
  //     ad: 1,
  //     sno: "2020114104",
  //     reason: "辱骂他人",
  //     detail: "该用户辱骂他人",
  //     img: "http://localhost:8080/img/1.jpg",
  //     time: "2023-11-14 12:00:00",
  //     way: "12345678901",
  //   },
  //   {
  //     ad: 2,
  //     sno: "2020114104",
  //     reason: "辱骂他人",
  //     detail: "该用户辱骂他人",
  //     img: "http://localhost:8080/img/1.jpg",
  //     time: "2023-11-14 12:00:00",
  //     way: "12345678901",
  //   },
  //   {
  //     ad: 3,
  //     sno: "2020114104",
  //     reason: "辱骂他人",
  //       detail: "该用户辱骂他人",
  //     img: "http://localhost:8080/img/1.jpg",
  //     time: "2023-11-14 12:00:00",
  //     way: "12345678901",
  //   },
  //   {
  //     ad: 4,
  //     sno: "2020114104",
  //     reason: "辱骂他人",
  //     detail: "该用户辱骂他人",
  //     img: "http://localhost:8080/img/1.jpg",
  //     time: "2023-11-14 12:00:00",
  //     way: "12345678901",
  //   }
  // ];
  // page.total = 4;
  ress.data.records.forEach((item) => {
    const urls = item.screenshot.split("|");
    //console.log(urls);
    item.screenshot1 = urls[0];
    item.screenshot2 = urls[1];
    item.screenshot3 = urls[2];
  })
  tableData.value = ress.data.records;
  page.total = ress.data.total;
  componentKey.value++;
  ////console.log(ress, tableData.value, "tableData");
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
// async function daochu() {
//   ElMessageBox.confirm("确定要导出表格吗？", "提示", {
//     type: "info",
//   })
//     .then(async () => {
//       const res = await exportCourseData();
//       if (res.code == 50)
//         ElMessage({
//           type: "warning",
//           message: "导出失败",
//         });
//       else {
//         const url = window.URL.createObjectURL(new Blob([res],
//         { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
//         const link = document.createElement('a');
//         link.href = url;
//         link.setAttribute('download', 'data.xlsx'); // 设置下载的文件名
//         link.style.display = 'none' // 隐藏元素
//         document.body.appendChild(link);
//         link.click();
        
//         // 清理 DOM 和释放 URL 对象
//         document.body.removeChild(link);
//         window.URL.revokeObjectURL(url);
//         ElMessage({
//           type: "success",
//           message: "导出成功",
//         });
//       }
//     })
//     .catch(() => {});
// }
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
    //console.log(e, "编辑数据");

    if ("projectpracticeCode" in rowData.value) {
      e.projectpracticeCode = rowData.value.projectpracticeCode;
      // const res = await updateCourse(e);
      // //console.log(res, "更新数据");
    } else {
      //console.log("无数据");
    }
  } else {
    // const res = await createCourse(e);
    // //console.log(res, "新建数据");
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
// const handleDelSelection = (e) => {
//   let delt = [];
//   if (e.length > 0) {
//     e.forEach((value) => {
//       delt.push(value.projectpracticeCode);
//     });
//   }
//   DeleteReportData(delt)
//     .then((res) => {
//       ElMessage.success("删除成功");
//       getData(1, 0);
//       page.index = 1;
//     })
//     .catch((err) => {
//       ElMessage.error("删除失败");
//     });
// };
// 删除相关
const handleDelete = async (row) => {
  ////console.log(row, "删除");
  const res = await DeleteReportData(row.id,row.screenshot);
  console.log(res, "删除数据");
  if (res.code == 1) {
    ElMessage.success("删除成功");
  } else {
    ElMessage.error("删除失败");
  }
  getData(1, 0);
  page.index = 1;
};
</script>

<style scoped></style>
