<template>
  <div>
    <TableSearch :query="query" :options="searchOpt" :search="handleSearch" />
    <div class="container">
      <TableCustom
        :columns="columns"
        :tableData="tableData"
        :total="page.total"
        :viewFunc="handleView"
        :delFunc="handleDelete"
        :page-change="changePage"
        :editFunc="handleEdit"
      >
        <template #toolbarBtn>
          <el-button
            type="warning"
            :icon="CirclePlusFilled"
            @click="visible = true"
            >新增</el-button
          >
          <el-upload style="margin-left: 20px;" action="#" :limit="1" accept=".xlsx, .xls" :show-file-list="false"
                    :before-upload="beforeUpload" :http-request="handleMany">
                    <el-button class="mr10" type="success">批量导入</el-button>
                </el-upload>
        </template>
        <template #status="{ rows }">
          <el-tag type="success" v-if="rows.status">Active</el-tag>
          <el-tag type="danger" v-else>Disabled</el-tag>
        </template>
        <template #permissions="{ rows }">
          <el-button
            type="primary"
            size="small"
            plain
            @click="handlePermission(rows)"
            >管理</el-button
          >
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
    <el-dialog
      title="权限管理"
      v-model="visible2"
      width="500px"
      destroy-on-close
    >
      <RolePermission :permiss-options="permissOptions" />
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="system-role">
import { ref, reactive } from "vue";
import { ElMessage } from "element-plus";
import { Role } from "@/types/role";
import { fetchRoleData } from "@/api";
import TableCustom from "@/components/table-custom.vue";
import TableDetail from "@/components/table-detail.vue";
import RolePermission from "./role-permission.vue";
import { CirclePlusFilled } from "@element-plus/icons-vue";
import { FormOption, FormOptionList } from "@/types/form-option";
import { UploadProps } from 'element-plus';
import * as XLSX from 'xlsx';
// 查询相关
const query = reactive({
  name: "",
});
const searchOpt = ref<FormOptionList[]>([
  { type: "input", label: "用户查询：", prop: "name" },
]);
const handleSearch = () => {
  changePage(1);
};

// 表格相关
let columns = ref([
  { type: "index", label: "序号", width: 55, align: "center" },
  { prop: "name", label: "用户姓名" },
  { prop: "phone", label: "电话" },
  { prop: "num", label: "工号" },
  { prop: "status", label: "Status" },
  { prop: "operator", label: "操作", width: 250 },
]);
const page = reactive({
  index: 1,
  size: 10,
  total: 0,
});
const tableData = ref<Role[]>([]);
const getData = async () => {
  console.log('hhhhh');
  const res = await fetchRoleData();
  console.log(res,"shdfbkjdbgdfjk");
  tableData.value = res.data.list;
  page.total = res.data.pageTotal;
};
getData();
const changePage = (val: number) => {
  page.index = val;
  getData();
};

// 新增/编辑弹窗相关
const options = ref<FormOption>({
  labelWidth: "100px",
  span: 24,
  list: [
    { type: "input", label: "用户姓名", prop: "name", required: true },
    { type: "input", label: "电话", prop: "phone", required: true },
    { type: "input", label: "工号", prop: "num", required: true },
    {
      type: "switch",
      label: "状态",
      prop: "status",
      required: false,
      activeText: "启用",
      inactiveText: "禁用",
    },
  ],
});
const visible = ref(false);
const isEdit = ref(false);
const rowData = ref({});
const handleEdit = (row: Role) => {
  rowData.value = { ...row };
  isEdit.value = true;
  visible.value = true;
};
const updateData = () => {
  closeDialog();
  getData();
};
const closeDialog = () => {
  visible.value = false;
  isEdit.value = false;
  rowData.value = {};
};

// 查看详情弹窗相关
const visible1 = ref(false);
const viewData = ref({
  row: {},
  list: [],
  column: 1,
});
const handleView = (row: Role) => {
  viewData.value.row = { ...row };
  viewData.value.list = [
    {
      prop: "id",
      label: "用户ID",
    },
    {
      prop: "name",
      label: "用户姓名",
    },
    {
      prop: "phone",
      label: "电话",
    },
    {
      prop: "num",
      label: "工号",
    },
    {
      prop: "status",
      label: "角色状态",
    },
  ];
  visible1.value = true;
};

// 删除相关
const handleDelete = (row: Role) => {
  ElMessage.success("删除成功");
};

// 权限管理弹窗相关
const visible2 = ref(false);
const permissOptions = ref({});
const handlePermission = (row: Role) => {
  visible2.value = true;
  permissOptions.value = {
    id: row.id,
    permiss: row.permiss,
  };
};
// hhhhhhhhhhhhhhhhhhhhhhhh
const importList = ref<any>([]);
const beforeUpload: UploadProps['beforeUpload'] = async (rawFile) => {
    importList.value = await analysisExcel(rawFile);
    return true;
};
const analysisExcel = (file: any) => {
    return new Promise(function (resolve, reject) {
        const reader = new FileReader();
        reader.onload = function (e: any) {
            const data = e.target.result;
            let datajson = XLSX.read(data, {
                type: 'binary',
            });

            const sheetName = datajson.SheetNames[0];
            const result = XLSX.utils.sheet_to_json(datajson.Sheets[sheetName]);
            resolve(result);
        };
        reader.readAsBinaryString(file);
    });
};

const handleMany = async () => {
    // 把数据传给服务器后获取最新列表，这里只是示例，不做请求
    const list = importList.value.map((item: any, index: number) => {
        return {
            id: index,
            name: item['姓名'],
            sno: item['学号'],
            class: item['班级'],
            age: item['年龄'],
            sex: item['性别'],
        };
    });
    tableData.value.push(...list);
};
</script>

<style scoped></style>
