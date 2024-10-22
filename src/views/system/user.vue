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
import { fetchUserData } from "@/api";
import TableCustom from "@/components/table-custom.vue";
import TableDetail from "@/components/table-detail.vue";
import TableSearch from "@/components/table-search.vue";
import { FormOption, FormOptionList } from "@/types/form-option";
console.log(TableCustom)
// 查询相关
const query = reactive({
  name: "",
});
const searchOpt = ref<FormOptionList[]>([
  { type: "input", label: "会议室查询：", prop: "name" },
]);
const handleSearch = () => {
  changePage(1);
};

// 表格相关
let columns = ref([
  { type: "index", label: "序号", width: 55, align: "center" },
  { prop: "roomName", label: "会议室名称" },
  { prop: "capacity", label: "容纳人数" },
  { prop: "status", label: "Status" },
  { prop: "time", label: "时间" },
  { prop: "operator", label: "操作", width: 250 },
]);
const page = reactive({
  index: 1,
  size: 10,
  total: 0,
});
const tableData = ref<User[]>([]);
const getData = async (e) => {
  const ress = await fetchUserData(e);
  console.log(ress,"shdfbkjdbgdfjk");
   tableData.value = ress.list;
   page.total = ress.total;
};
getData(1);

const changePage = (val: number) => {
  
  
  page.index = val;
  getData(page.index);
};

// 新增/编辑弹窗相关
let options = ref<FormOption>({
  labelWidth: "100px",
  span: 12,
  list: [
    { type: "input", label: "会议室名称", prop: "name", required: true },
    { type: "input", label: "容纳人数", prop: "num", required: true },
    // { type: "input", label: "Status", prop: "status", required: true },
  ],
});
const visible = ref(false);
const isEdit = ref(false);
const rowData = ref({});
const handleEdit = (row: User) => {
  rowData.value = { ...row };
  isEdit.value = true;
  visible.value = true;
};
const updateData = () => {
  closeDialog();
  //getData(2);
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
      label: "会议室名称",
    },
    {
      prop: "num",
      label: "容纳人数",
    },
    {
      prop: "status",
      label: "Status",
    },
    {
      prop: "date",
      label: "注册日期",
    },
  ];
  visible1.value = true;
};

// 删除相关
const handleDelete = (row: User) => {
  ElMessage.success("删除成功");
};
</script>

<style scoped></style>
