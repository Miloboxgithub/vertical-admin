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
          <el-tag type="success" v-if="rows.status">Active</el-tag>
          <el-tag type="danger" v-else>Disabled</el-tag>
        </template>
        <template #toolbarBtn>
          <el-button
            type="warning"
            :icon="CirclePlusFilled"
            @click="visible = true"
            >新增</el-button
          >
          <el-button type="success" @click="selectAndUploadFile"
            >批量导入</el-button
          >
        </template>
      </TableCustom>
    </div>
    <el-dialog
      :title="isEdit ? '编辑' : '新增用户'"
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
          <el-tag type="success" v-if="rows.status">Active</el-tag>
          <el-tag type="danger" v-else>Disabled</el-tag>
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
import { fetchUserData2, DeleteData2 } from "@/api";
import TableCustom from "@/components/table-custom.vue";
import TableDetail from "@/components/table-detail.vue";
import TableSearch from "@/components/table-search.vue";
import { FormOption, FormOptionList } from "@/types/form-option";
import axios from "axios";
import { UploadProps } from "element-plus";
import * as XLSX from "xlsx";
import RolePermission from "./role-permission.vue";
import type { UploadInstance, UploadFile } from "element-plus";
console.log(TableSearch.props, "search");
const startTime = ref("");
const endTime = ref("");
// 查询相关
const query = reactive({
  name: "",
});
const searchOpt = ref<FormOptionList[]>([
  { type: "input", label: "用户名查询：", prop: "name" },
]);
const handleSearch = (queryData) => {
  console.log(queryData, "搜索");

  changePage(1, queryData.name);
};

// 表格相关
let columns = ref([
  { type: "index", label: "序号", width: 55, align: "center" },
  { prop: "name", label: "用户姓名" },
  { prop: "phoneNumber", label: "电话" },
  { prop: "studentOrStaffNumber", label: "工号" },
  { prop: "role", label: "角色" },
  { prop: "status", label: "Status" },
  { prop: "operator", label: "操作", width: 250 },
]);
const page = reactive({
  index: 1,
  size: 10,
  total: 0,
});
const componentKey = ref(0); // 强制刷新组件
const tableData = ref<User[]>([]);
const getData = async (e, n) => {
  const ress = await fetchUserData2(e, n);
  //console.log(ress, "shdfbkjdbgdfjk");
  tableData.value = ress.list;
  page.total = ress.total;
  componentKey.value++;
  console.log(tableData.value, "tableData");
};
getData(1, "");

const changePage = (val: number, name: string) => {
  page.index = val;
  getData(page.index, name);
};

// 新增/编辑弹窗相关
let options = ref<FormOption>({
  labelWidth: "100px",
  span: 12,
  list: [
    { type: "input", label: "用户姓名", prop: "name", required: true },
    { type: "input", label: "电话", prop: "phoneNumber", required: true },
    // { type: "input", label: "Status", prop: "status", required: true },
    {
      type: "input",
      label: "工号",
      prop: "studentOrStaffNumber",
      required: true,
    },
    { type: "input", label: "角色", prop: "role", required: true },
  ],
});
const visible = ref(false);
const isEdit = ref(false);
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
      label: "用户姓名",
    },
    {
      prop: "phoneNumber",
      label: "电话",
    },
    {
      prop: "studentOrStaffNumber",
      label: "工号",
    },
    {
      prop: "role",
      label: "角色",
    },
    {
      prop: "status",
      label: "角色状态",
    },
  ];
  visible1.value = true;
};

// 删除相关
const handleDelete = async (row: User) => {
  console.log(row, "删除");
  const res = await DeleteData2(row.id);
  if (res.data.message == "success") {
    ElMessage.success("删除成功");
  } else {
    ElMessage.error("删除失败");
  }
  getData(1, "");
  page.index = 1;
};
//批量导入
const uploadUrl = "/api/teacherlist"; // 替换为你的后端URL

const selectAndUploadFile = async () => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".xlsx, .xls"; // 限制只能选择Excel文件

  input.addEventListener("change", (e: Event) => {
    const eventTarget = e.target as HTMLInputElement;
    const files = eventTarget.files;
    if (files.length === 0) {
      ElMessage.error("请选择文件");
      return;
    }

    const file = files[0];
    // if (file.size > 524288) { // 限制文件大小为500KB
    //   alert('File size should be less than 500KB.');
    //   return;
    // }

    try {
      const formData = new FormData();
      formData.append("teacherlist", file);

      const response = axios.post(uploadUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          // 如果需要认证，请添加认证头
          // 'Authorization': 'Bearer 你的Token'
        },
      });

      console.log("File uploaded successfully:", response);
      ElMessage.success("文件导入成功");
      setTimeout(() => {
        getData(1, "");
      }, 500);
    } catch (error) {
      console.error("Error uploading file:", error);
      ElMessage.error("文件导入失败");
    }
  });

  input.click(); // 触发点击事件以打开文件选择对话框
};
// hhhhhhhhhhhhhhhhhhhhhhhh
// const importList = ref<any>([]);
// const beforeUpload: UploadProps['beforeUpload'] = async (rawFile) => {
//     importList.value = await analysisExcel(rawFile);
//     return true;
// };
// const analysisExcel = (file: any) => {
//     return new Promise(function (resolve, reject) {
//         const reader = new FileReader();
//         reader.onload = function (e: any) {
//             const data = e.target.result;
//             let datajson = XLSX.read(data, {
//                 type: 'binary',
//             });

//             const sheetName = datajson.SheetNames[0];
//             const result = XLSX.utils.sheet_to_json(datajson.Sheets[sheetName]);
//             resolve(result);
//         };
//         reader.readAsBinaryString(file);
//     });
// };

// const handleMany = async () => {
//     // 把数据传给服务器后获取最新列表，这里只是示例，不做请求
//     const list = importList.value.map((item: any, index: number) => {
//         return {
//             id: index,
//             name: item['姓名'],
//             sno: item['学号'],
//             class: item['班级'],
//             age: item['年龄'],
//             sex: item['性别'],
//         };
//     });
//     tableData.value.push(...list);
// };
</script>

<style scoped></style>
