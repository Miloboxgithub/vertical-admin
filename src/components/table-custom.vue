<template>
  <div>
    <div class="table-toolbar" v-if="hasToolbar">
      <div class="table-toolbar-left" style="display: flex">
        <slot name="toolbarBtn"></slot>
      </div>
      <div class="table-toolbar-right flex-center">
        <template v-if="multipleSelection.length > 0">
          <el-tooltip effect="dark" content="删除选中" placement="top">
            <el-icon
              class="columns-setting-icon"
              @click="delSelection(multipleSelection)"
            >
              <Delete />
            </el-icon>
          </el-tooltip>
          <el-divider direction="vertical" />
        </template>
        <el-tooltip effect="dark" content="刷新" placement="top">
          <el-icon class="columns-setting-icon" @click="refresh">
            <Refresh />
          </el-icon>
        </el-tooltip>
        <el-divider direction="vertical" />
        <el-tooltip effect="dark" content="列设置" placement="top">
          <el-dropdown :hide-on-click="false" size="small" trigger="click">
            <el-icon class="columns-setting-icon">
              <Setting />
            </el-icon>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item v-for="c in columns">
                  <el-checkbox v-model="c.visible" :label="c.label" />
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </el-tooltip>
      </div>
    </div>
    <el-table
      class="mgb20"
      :style="{ width: '100%' }"
      border
      :data="tableData"
      :row-key="rowKey"
      @selection-change="handleSelectionChange"
      @sort-change="customSortMethod"
      table-layout="auto"
    >
      <template v-for="item in columns" :key="item.prop" >
        <el-table-column
          v-if="item.visible"
          :prop="item.prop"
          :label="item.label"
          show-overflow-tooltip
          :width="item.width"
          :type="item.type"
          :align="item.align || 'center'"
          :sortable="item.sortable"
          :fixed="item.fixed||false"
        >
          <template
            #default="{ row, column, $index }"
            v-if="item.type === 'index'"
          >
            {{ getIndex($index) }}
          </template>
          <template
            #default="{ row, column, $index }"
            v-if="item.type === 'img'"
          >
            <el-image
              :src="row[item.prop]"
              :preview-src-list="[row[item.prop]]"
              show-progress
              fit="cover"
              style="width: 80%; height: 80% ;z-index: 9999"
              :preview-teleported="true"
            />
          </template>
          <template
            #default="{ row, column, $index }"
            v-if="item.type === 'imgs'"
          >
            <el-image
              v-if="row[item.prop1]"
              :src="row[item.prop1]"
              :preview-src-list="[row[item.prop1]]"
              show-progress
              fit="cover"
              style="width: 50px; height: auto ;z-index: 9999"
              :preview-teleported="true"
            />
            <el-image
            v-if="row[item.prop2]"
              :src="row[item.prop2]"
              :preview-src-list="[row[item.prop2]]"
              show-progress
              fit="cover"
              style="width: 50px;margin-right: 20px; margin-left: 20px; height: auto ;z-index: 9999"
              :preview-teleported="true"
            />
            <el-image
            v-if="row[item.prop3]"
              :src="row[item.prop3]"
              :preview-src-list="[row[item.prop3]]"
              show-progress
              fit="cover"
              style="width: 50px; height: auto ;z-index: 9999"
              :preview-teleported="true"
            />
          </template>
          <template #default="{ row, column, $index }" v-if="!item.type">
            <slot :name="item.prop" :rows="row" :index="$index">
              <template v-if="item.prop == 'operator'">
                <el-button
                  type="info"
                  size="small"
                  :icon="CopyDocument"
                  @click="Copys(row)"
                >
                  一键复制
                </el-button>
                <el-button
                  type="warning"
                  size="small"
                  :icon="EditPen"
                  @click="editFuncss(row)"
                >
                  修改权重
                </el-button>
                <el-button
                  type="primary"
                  size="small"
                  :icon="Edit"
                  @click="editFunc(row)"
                >
                  编辑
                </el-button>
                <el-button
                  type="danger"
                  size="small"
                  :icon="Delete"
                  @click="handleDelete(row)"
                >
                  删除
                </el-button>
              </template>
              <template v-if="item.prop == 'operator1'">
                <el-button
                  type="danger"
                  size="small"
                  :icon="Delete"
                  @click="handleDelete(row)"
                >
                  删除
                </el-button>
              </template>
              <template v-if="item.prop == 'operators'">
                <el-button
                  type="warning"
                  size="small"
                  :icon="View"
                  @click="viewFunc(row)"
                >
                  查看
                </el-button>
                <el-button
                  type="danger"
                  size="small"
                  :icon="Delete"
                  @click="handleDelete(row)"
                >
                  删除
                </el-button>
              </template>
              <template v-if="item.prop == 'forbid'">
                <el-button
                  type="primary"
                  size="small"
                  :icon="Edit"
                  @click="editFunc(row)"
                >
                  改变状态
                </el-button>
              </template>
              <span v-else-if="item.formatter">
                {{ item.formatter(row[item.prop]) }}
              </span>
              <span v-else>
                {{ row[item.prop] }}
              </span>
            </slot>
          </template>
        </el-table-column>
      </template>
    </el-table>
    <el-pagination
      v-if="hasPagination"
      :current-page="currentPage"
      :page-size="pageSize"
      :background="true"
      :layout="layout"
      :total="total"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script setup lang="ts">
import { toRefs, PropType, ref } from "vue";
import { Delete, Edit, View, Refresh ,CopyDocument,EditPen} from "@element-plus/icons-vue";
import { ElMessageBox,ElImage,ElMessage } from "element-plus";
import 'element-plus/dist/index.css';
const dialogVisible = ref(false);

function handleClose() {
      console.log('Dialog closed');
    }
//app.use(ElImage);
//import { fetchUserData } from "@/api";
const props = defineProps({
  // 表格相关
  tableData: {
    type: Array,
    default: [],
  },
  columns: {
    type: Array as PropType<any[]>,
    default: [],
  },
  rowKey: {
    type: String,
    default: "id",
  },
  hasToolbar: {
    type: Boolean,
    default: true,
  },
  //  分页相关
  hasPagination: {
    type: Boolean,
    default: true,
  },
  total: {
    type: Number,
    default: 0,
  },
  currentPage: {
    type: Number,
    default: 1,
  },
  pageSize: {
    type: Number,
    default: 20,
  },

  layout: {
    type: String,
    default: "total, prev, pager, next",
  },
  delFunc: {
    type: Function,
    default: () => {},
  },
  viewFunc: {
    type: Function,
    default: () => {},
  },
  editFunc: {
    type: Function,
    default: () => {},
  },
  editFuncss: {
    type: Function,
    default: () => {},
  },
  delSelection: {
    type: Function,
    default: () => {},
  },
  refresh: {
    type: Function,
    default: () => {},
  },
  changePage: {
    type: Function,
    default: () => {},
  },
});
// const changePage = (val: number) => {

//     getData(val);

// }

// const getData = async (e) => {
//   const ress = await fetchUserData(e,'');
//   //console.log(ress,"shdfbkjdbgdfjk");

//    tableData.value = ress.list;
//    total.value = ress.total;
//    console.log(tableData.value,"tableData.value");

// };
// let {
//     tableData,
//     columns,
//     rowKey,
//     hasToolbar,
//     hasPagination,
//     total,
//     currentPage,
//     pageSize,
//     layout,
// } = toRefs(props)
// 使用 toRefs 将 props 转换为响应式引用，但保持 currentPage 可写
const { columns, rowKey, hasToolbar, hasPagination, total, pageSize, layout } =
  toRefs(props);
const currentPage = ref(props.currentPage);
const tableData = ref(props.tableData);
// const columns = ref(props.columns);
// const rowKey = ref(props.rowKey);
// const hasToolbar = ref(props.hasToolbar);
// const hasPagination = ref(props.hasPagination);
// const layout = ref(props.layout);
// 设置默认值

columns.value.forEach((item) => {
  if (item.visible === undefined) {
    item.visible = true;
  }
});

let isAscending=true
 let sortState = localStorage.getItem("sortState");
const customSortMethod=()=> {
  
  console.log(sortState,"sortState");
  
          if(sortState){
            props.changePage(currentPage.value,'', null);
            localStorage.removeItem("sortState");
          }
          else{
            props.changePage(currentPage.value, '','1');
            localStorage.setItem("sortState", "1");
          }

    }
// 当选择项发生变化时会触发该事件
const multipleSelection = ref([]);
const handleSelectionChange = (selection: any[]) => {
  multipleSelection.value = selection;
};

// 当前页码变化的事件
const handleCurrentChange = (val: number) => {
  console.log(val, "ssssssssssssssss");
  currentPage.value = val;
  console.log(currentPage.value, "qqqqqq");
  props.changePage(currentPage.value, "");
};

const handleDelete = (row) => {
  ElMessageBox.confirm("确定要删除吗？", "提示", {
    type: "warning",
  })
    .then(async () => {
      props.delFunc(row);
    })
    .catch(() => {});
};

const getIndex = (index: number) => {
  return index + 1 + (currentPage.value - 1) * pageSize.value;
};
function getValueAfterDash(str) {
  const parts = str.split("-");
  if (parts.length > 1) {
    return parts[1]; // 返回"-"后面的部分
  } else {
    return null; // 如果没有"-"，返回null
  }
}

const Copys = (row) => {
  console.log(row, "row");
  const companyName = row.companyName || '公司名称未提供';
  const jobPosition = row.jobPosition || '招聘岗位未提供';
  
  const internshipType = row.internshipType || '实习类型未提供';
  const location = row.location || '实习地点未提供';
  let base=''
  if(location!='实习地点未提供'){
   base ="——base"+ getValueAfterDash(location)
  }
  const responsibility = row.responsibility || '岗位职责未提供';
  const requirement = row.requirement || '岗位要求未提供';
  const harvest = row.harvest || '实习收获未提供';
  const deliveryMethod = row.deliveryMethod || '投递方式未提供';

  // 将提取的信息按照指定格式组织成字符串
  const textToCopy = `#${companyName}${jobPosition}${base}\n实习类型：${internshipType}\n实习地点：${getValueAfterDash(location)}\n【岗位职责】\n${responsibility}\n【岗位要求】\n${requirement}\n【实习收获】\n${harvest}\n【投递方式】\n${deliveryMethod}`;
  // 创建一个临时的 textarea 元素
  const textarea = document.createElement('textarea');
      textarea.value = textToCopy;
      
      // 将 textarea 元素添加到文档中
      document.body.appendChild(textarea);
      
      // 选择 textarea 中的文本
      textarea.select();
      textarea.setSelectionRange(0, 99999); // 对于移动设备，可能需要指定范围
      
      // 执行复制操作
      const successful = document.execCommand('copy');
      
      // 从文档中移除 textarea 元素
      document.body.removeChild(textarea);
      
      // 根据复制操作是否成功，给出提示
      if (successful) {
        ElMessage.success('复制成功');
      } else {
        ElMessage.error('复制失败');
      }
    
}
const changesWeight = (row) => {
  console.log(row, "row");

}
//handleCurrentChange(1)
</script>

<style scoped>
.table-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 10px;
}

.columns-setting-icon {
  display: block;
  font-size: 18px;
  cursor: pointer;
  color: #676767;
}
/* 增加遮罩层的 z-index */
/*  */
.table-header .cell {
  color: #333;
}
/*  */
</style>
