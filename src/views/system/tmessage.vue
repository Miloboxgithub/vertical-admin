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
        :editFuncss = "handleEdits"
      >
        <template #status="{ rows }">
          <el-tag type="warning" v-if="rows.overTime == 2">审核中</el-tag>
          <el-tag type="success" v-else-if="rows.overTime == 0">招募中</el-tag>
          <el-tag type="info" v-else>已结束</el-tag>
        </template>
        <template #toolbarBtn>
          <el-button
            type="warning"
            :icon="CirclePlusFilled"
            @click="
              visible = true;
              isEdit = 0;
            "
            >新增</el-button
          >
          <el-button
      type="success"
      :icon="CirclePlusFilled"
      @click="triggerUpload"
    >
      默认资讯图片上传
    </el-button>

    <!-- 隐藏的 el-upload 组件 -->
    <el-upload
      ref="uploadRef"
      action="/api/admin/defaultConsultPhotoUpload"
      :on-success="handleConsultSuccess"
      :headers="getHeaders()"
      style="display: none;" 
    >
      <!-- 可以在这里添加额外的内容 -->
    </el-upload>
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
    <div v-if="isEdit === 0">
      <TableEdit
        :form-data="rowData"
        :options="newoptions"
        :edit="false"
        :update="updateData"
      />
    </div>
    <div v-else-if="isEdit === 1">
      <TableEdit
        :form-data="rowData"
        :options="options"
        :edit="true"
        :update="updateData"
      />
    </div>
    <div v-else-if="isEdit === 2">
      <TableEdit
        :form-data="rowData"
        :options="oppp"
        :edit="true"
        :update="updateData"
      />
    </div>
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
  changeIntership,
  createIntership,
  SearchCourse,
  fetchInterShipData,
  fetchAdminData,
  getIndustryType,
  getBusinessNature,
  getProvince,
  getCity,
  DeleteInterShipData,
  changeWeights
} from "@/api";
import TableCustom from "@/components/table-custom.vue";
import TableDetail from "@/components/table-detail.vue";
import TableSearch from "@/components/table-search.vue";
import { FormOption, FormOptionList } from "@/types/form-option";
import axios from "axios";
import { useRouter } from "vue-router";
import { ElMessageBox } from "element-plus";
import { inject } from 'vue';
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
  { type: "input", label: "实习ID查询：", prop: "internshipId" },
]);

// 表格相关
let columns = ref([
  { type: "index", label: "序号", width: 55, align: "center" },
  //{ type: "selection", width: 55, align: "center" },
  //{ prop: "ad", label: "序号", width: 55, align: "center" },
  { prop: "companyName", label: "公司名称", align: "center" , width: 200},
  { prop: "id", label: "实习ID", align: "center" },
  { prop: "industryType", label: "行业类型", align: "center" },
  { prop: "businessNature", label: "公司性质", align: "center" },
  { prop: "jobPosition", label: "招聘岗位" },
  { prop: "createTime", label: "提交时间" },
  { prop: "internshipType", label: "实习类型" },
  { prop: "userAccount", label: "用户账号" },
  { prop: "weights", label: "权重" },
  { prop: "pageview", label: "浏览量" },
  {prop: "status", label: "状态", slotName: "status" },
  { prop: "operator", label: "操作", width: 400 },
]);
const page = reactive({
  index: 1,
  size: 20,
  total: 0,
});
const componentKey = ref(0); // 强制刷新组件
const tableData = ref([]);
const getData = async (e, p) => {
  const ress = await fetchInterShipData(e, p);
  if (ress == "Request failed with status code 403") {
    //goTologon();
  }
  // tableData.value = [
  //   {
  //     ad: 1,
  //     name: "北京智谱华章科技有限公司",
  //     id: "1",
  //     type: "计算机/互联网/IT",
  //     xing: "民营公司",
  //     wei: "前端开发工程师",
  //     time: "2023-11-01",
  //     types: "实习",
  //     sno: "2020110405",
  //     value: "1",
  //     num: "100",
  //   },
  //   {
  //     ad: 2,
  //     name: "北京智谱华章科技有限公司",
  //     id: "1",
  //     type: "计算机/互联网/IT",
  //     xing: "民营公司",
  //     wei: "前端开发工程师",
  //     time: "2023-11-01",
  //     types: "实习",
  //     sno: "2020110405",
  //     value: "1",
  //     num: "100",
  //   },
  //   {
  //     ad: 3,
  //     name: "北京智谱华章科技有限公司",
  //     id: "1",
  //     type: "计算机/互联网/IT",
  //     xing: "民营公司",
  //     wei: "前端开发工程师",
  //     time: "2023-11-01",
  //     types: "实习",
  //     sno: "2020110405",
  //     value: "1",
  //     num: "100",
  //   },
  //   {
  //     ad: 4,
  //     name: "北京智谱华章科技有限公司",
  //     id: "1",
  //     type: "计算机/互联网/IT",
  //     xing: "民营公司",
  //     wei: "前端开发工程师",
  //     time: "2023-11-01",
  //     types: "实习",
  //     sno: "2020110405",
  //     value: "1",
  //     num: "100",
  //   }
  // ];
  // page.total = 4;
  
  ress.data.records.forEach(item => {
  item.deadline = item.deadline.split(' ')[0];
})


  tableData.value = ress.data.records;


page.total = ress.data.total;

  componentKey.value++;
  ////console.log(ress, tableData.value, "tableData");
};
getData(1, 0);

const handleSearch = async (queryData) => {
  if (!queryData.internshipId) {
    getData(1, 0);
  } else {
    const ress = await SearchCourse(queryData.internshipId);
    if (ress.code != 1) {
      ElMessage.error("查询失败");
    } else {
      ElMessage.success("查询成功");
      let t = []
      t.push(ress.data)
      tableData.value = t;
      page.total = 1;
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
const industryTypeOptions = ref([])
const businessNatureOptions = ref([])

const locationOptions = ref([])
  locationOptions.value = inject('locationOptions');
    // newoptions.value.list[6].options = locationOptions.value;
  //console.log(locationOptions.value,'locationOptions')

const getIndustryTypeOptions = async () => {
  const res = await getIndustryType();
  industryTypeOptions.value = res.data.map(item => ({
    label: item.industryType,
    value: item.id
  }));
  //console.log(industryTypeOptions.value)
  newoptions.value.list[2].options = industryTypeOptions.value
  options.value.list[2].options = industryTypeOptions.value
};
getIndustryTypeOptions();
const getBusinessNatureOptions = async () => {
  const res = await getBusinessNature();
  businessNatureOptions.value = res.data.map(item => ({
    label: item.businessNature,
    value: item.id
  }));
  //console.log(businessNatureOptions.value)
  newoptions.value.list[3].options = businessNatureOptions.value
  options.value.list[3].options = businessNatureOptions.value
};
getBusinessNatureOptions();
const recentYears = getRecentYears(4); // 获取最近3年
// 新增/编辑弹窗相关
let options = ref<FormOption>({
  labelWidth: "100px",
  span: 16,
  list: [
  {
      type: "input",
      label: "公司名称",
      prop: "companyName",
      required: true,
    },
    {
      type: "input",
      label: "招聘岗位",
      prop: "jobPosition",
      required: true,
    },
    {
      type: "select",
      label: "行业类型",
      prop: "industryType",
      required: true,
      options: industryTypeOptions.value,
    },{
      type: "select",
      label: "公司性质",
      prop: "businessNature",
      required: true,
      options:businessNatureOptions.value ,
    },{
      type: "select",
      label: "实习类型",
      prop: "internshipType",
      required: true,
      options: [
        { label: "线下", value: "线下" },
        { label: "远程", value: "远程" },
      ],
    },
    {
      type: "cascader",
      label: "实习地点",
      prop: "location",
      required: true,
      options: locationOptions.value,
    },
    {
      type: "date",
      label: "截止时间",
      prop: "deadline",
      required: true
    },
    {
      type: "input1",
      label: "岗位职责",
      prop: "responsibility",
      required: true,
    },
    {
      type: "input1",
      label: "岗位要求",
      prop: "requirement",
      required: true,
    },
    {
      type: "input2",
      label: "实习收获",
      prop: "harvest",
      required: true,
    },
    {
      type: "input3",
      label: "投递方式",
      prop: "deliveryMethod",
      required: true,
    },
    {
      type: "number",
      label: "权重",
      prop: "weights",
      required: true,
    },
    {
      type: "input4",
      label: "备注",
      prop: "remark"
    },
    {
      type: "uploaded",
      label: "公司LOGO",
      prop: "companyLogo",
      required: true,
    },
    {
      type: "uploads",
      label: "资讯图片",
      prop: "consultPhoto",
    },
  ],
});
let oppp = ref<FormOption>({
  labelWidth: "100px",
  span: 16,
  list: [
    {
      type: "number",
      label: "权重",
      prop: "weights",
      required: true,
    },
   
  ],
});
let newoptions = ref<FormOption>({
  labelWidth: "100px",
  span: 16,
  list: [
  {
      type: "input",
      label: "公司名称",
      prop: "companyName",
      required: true,
    },
    {
      type: "input",
      label: "招聘岗位",
      prop: "jobPosition",
      required: true,
    },
    {
      type: "select",
      label: "行业类型",
      prop: "industryTypeId",
      required: true,
      options: industryTypeOptions.value,
    },{
      type: "select",
      label: "公司性质",
      prop: "businessNatureId",
      required: true,
      options:businessNatureOptions.value ,
    },{
      type: "select",
      label: "实习类型",
      prop: "internshipType",
      required: true,
      options: [
        { label: "线下", value: "线下" },
        { label: "远程", value: "远程" },
      ],
    },
    {
      type: "cascader",
      label: "实习地点",
      prop: "location",
      required: true,
      options: locationOptions.value,
    },
    {
      type: "date",
      label: "截止时间",
      prop: "deadline",
      required: true
    },
    {
      type: "input1",
      label: "岗位职责",
      prop: "responsibility",
      required: true,
    },
    {
      type: "input1",
      label: "岗位要求",
      prop: "requirement",
      required: true,
    },
    {
      type: "input2",
      label: "实习收获",
      prop: "harvest",
      required: true,
    },
    {
      type: "input3",
      label: "投递方式",
      prop: "deliveryMethod",
      required: true,
    },
    {
      type: "number",
      label: "权重",
      prop: "weights",
      required: true,
    },
    {
      type: "input4",
      label: "备注",
      prop: "remark"
    },
    {
      type: "uploaded",
      label: "公司LOGO",
      prop: "companyLogo",
      required: true,
    },
    {
      type: "uploads",
      label: "资讯图片",
      prop: "consultPhoto",
    },
  ],
});
const visible = ref(false);
const visible2 = ref(false);
const isEdit = ref(0);
const isEdits = ref(false);
const rowData = ref({});
const handleEdit = (row: User) => {
  rowData.value = { ...row };
  isEdit.value = 1;
  visible.value = true;
  getData(1, 0);
};
const handleEdits = (row: User) => {
  rowData.value = { ...row };
  isEdit.value = 2;
  visible.value = true;
  getData(1, 0);
};
const getHeaders = () => {
  const token = localStorage.getItem("vuems_token"); // 假设 token 存储在 localStorage 中
  return {
    token: token,
  };
};
const uploadRef = ref(null); // 获取 el-upload 的实例
const triggerUpload = () => {
      if (uploadRef.value) {
        // 手动触发文件选择框
        uploadRef.value.$el.querySelector('input[type="file"]').click();
      }
    };
const updateData = async (e) => {
  ////console.log(e, "数据kkk");

  if (isEdit.value==1) {
    if(e.location)
    e.location = e.location[0]+'-'+e.location[1]
  else e.location = ""
    e.industryType = industryTypeOptions.value.find(item => item.value === e.industryTypeId).label
    e.businessNature = businessNatureOptions.value.find(item => item.value === e.businessNatureId).label
    const res = await changeIntership(e);
    
    if(res.code==1){
      ElMessage.success("编辑成功");
    }
  } else if (isEdit.value==2) {
    const res = await changeWeights(e); 
    if(res.code==1){
      ElMessage.success("编辑成功");
    }
  }
  
  else {
    if(e.location)
    e.location = e.location[0]+'-'+e.location[1]
  else e.location = ""
    e.industryType = industryTypeOptions.value.find(item => item.value === e.industryTypeId).label
    e.businessNature = businessNatureOptions.value.find(item => item.value === e.businessNatureId).label
    //console.log(e, "新建数据");
    const res = await createIntership(e);
    //console.log(res, "新建数据");
    if(res.code==1){
      ElMessage.success("新建成功");
    }
  }
  closeDialog();
  setTimeout(() => {
    getData(1, 0);
  }, 500);
};
const handleConsultSuccess = (response: any, file: File) => {
  // 假设后端返回的数据格式为 { url: '图片链接' }
  //console.log(response, "responsesssss");
  if (response.code == 1 && response.data) {
    ElMessage.success("上传成功");
  } else {
    console.error("上传失败或未返回链接");
  }
};
const closeDialog = () => {
  visible.value = false;
  visible2.value = false;
  isEdit.value = 0;
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
  const res = await DeleteInterShipData(row.id,row.companyLogo,row.consultPhoto);
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
