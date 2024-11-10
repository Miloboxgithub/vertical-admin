<template>
  <el-container class="log-viewer" ref="fullscreenElement">
    <el-header class="header">
      <el-button
        type="primary"
        @click="toggleFullscreen"
        style="margin-left: 10px"
        >全屏查看日志</el-button
      >
      <div>
        <el-select
          v-model="selectedLogType"
          placeholder="运行日志"
          style="width: 200px"
          class="custom-select"
        >
          <el-option
            v-for="item in logTypes"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-date-picker
          v-model="selectedDate"
          type="date"
          placeholder="选择日期"
          style="width: 200px; margin-left: 10px"
          class="custom-datepicker"
          :disabled-date="disabledDate"
        />
        <el-button
          type="primary"
          @click="refreshLogs"
          :icon="Refresh"
          style="margin-left: 10px"
        >
          刷新日志
        </el-button>
      </div>
    </el-header>
    <el-main class="main-content">
      <el-scrollbar ref="scrollbar" height="calc(100vh - 60px)">
        <!-- <pre
          v-for="(log, index) in filteredLogs"
          :key="index"
          class="log-entry"
        > -->
        <pre class="log-entry">
          <text class="rows">{{ logs }}</text>
        </pre>
        <!-- 添加一些空行 -->
        <pre class="log-entry" v-for="i in 10" :key="i">&nbsp;</pre>
        <!-- <span class="level" :class="log.level.toLowerCase()">{{ log.level }}</span>
          <span class="transaction-id">{{ log.transactionId }}</span>
          <span class="performance">{{ log.performance }}</span>
          <span class="type">{{ log.type }}</span>
          <span class="order">{{ log.order }}</span>
          <span class="rows">{{ log.rows }}</span>
          <span class="query">{{ log.query }}</span> -->
        <!-- </pre> -->
      </el-scrollbar>
    </el-main>
  </el-container>
</template>

<script setup lang="ts" name="system-logviewer">
import {
  ElContainer,
  ElHeader,
  ElMain,
  ElButton,
  ElScrollbar,
  ElSelect,
  ElOption,
  ElDatePicker,
} from "element-plus";
import { Refresh } from "@element-plus/icons-vue";
import { ref, computed, onMounted, onUnmounted, nextTick ,watch} from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { fetchLogData } from "@/api";
import dayjs from "dayjs";
const fullscreenElement = ref<HTMLElement | null>(null);
let isFullscreen = false;

const selectedLogType = ref<string | undefined>(undefined);
const selectedDate = ref(new Date());
const logs = ref([]);

// Sample log data structure
const sampleLogs = [
  
  // Add more sample logs as needed
];

const logTypes = [
  { value: "common", label: "运行日志" },
  { value: "access", label: "请求日志" },
  { value: "error", label: "错误日志" },
];
const scrollbar = ref<InstanceType<typeof ElScrollbar> | null>(null);

const scrollToBottom = () => {
  nextTick(() => {
    if (scrollbar.value?.$el) {
      const wrap = scrollbar.value?.$el.querySelector(".el-scrollbar__wrap");
      if (wrap) {
        wrap.scrollTop = wrap.scrollHeight;
      }
    }
  });
};
const allowedDates = ref([]);
const chagss=(e)=>{
  const dateString = e;
  // 创建 Date 对象
  const date = new Date(dateString);

  // 获取年份、月份和日期
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // 月份从 0 开始，所以需要 +1
  const day = String(date.getDate()).padStart(2, "0");

  // 组合成 YYYY-MM-DD 格式
  const formattedDate = `${year}-${month}-${day}`;
  return formattedDate
}
const refreshLogs = async () => {
  const formattedDate = chagss(selectedDate.value)
  
  let es = {
    type: selectedLogType.value || "common",
    date: formattedDate,
  };
  console.log(es);
  
  const res = await fetchLogData(es);
  console.log(res.data.Dates,allowedDates);
  allowedDates.value = res.data.Dates;
  console.log(allowedDates);
  if (res.data.message == "success") logs.value = res.data.log;
  else logs.value = res.message;;
  // 滚动到底部
  scrollToBottom();
};
// 禁用日期的计算属性
const disabledDate = computed(() => (time) => {
  return !allowedDates.value.includes(chagss(time));
});

// 监听 allowedDatesRef 的变化
watch(allowedDates, (newVal) => {
  console.log("allowedDates updated:", newVal);
});
const filteredLogs = computed(() => {
  return logs.value.filter((log) => {
    const dateMatch =
      !selectedDate.value ||
      new Date(log.timestamp).toDateString() ===
        selectedDate.value.toDateString();
    const typeMatch =
      !selectedLogType.value ||
      log.level.toLowerCase() === selectedLogType.value.toLowerCase();
    return dateMatch && typeMatch;
  });
});

const toggleFullscreen = () => {
  if (!fullscreenElement.value) return;

  if (isFullscreen) {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if ((document as any).webkitExitFullscreen) {
      // Safari
      (document as any).webkitExitFullscreen();
    } else if ((document as any).mozCancelFullScreen) {
      // Firefox
      (document as any).mozCancelFullScreen();
    } else if ((document as any).msExitFullscreen) {
      // IE11
      (document as any).msExitFullscreen();
    }
  } else {
    if (fullscreenElement.value.requestFullscreen) {
      fullscreenElement.value.requestFullscreen();
    } else if ((fullscreenElement.value as any).webkitRequestFullscreen) {
      // Safari
      (document as any).webkitRequestFullscreen();
    } else if ((fullscreenElement.value as any).mozRequestFullScreen) {
      // Firefox
      (document as any).mozRequestFullScreen();
    } else if ((fullscreenElement.value as any).msRequestFullscreen) {
      // IE11
      (document as any).msRequestFullscreen();
    }
  }

  isFullscreen = !isFullscreen;
};

onMounted(() => {
  // 监听全屏状态变化
  const handleFullscreenChange = () => {
    isFullscreen = !!(
      document.fullscreenElement ||
      (document as any).webkitFullscreenElement ||
      (document as any).mozFullScreenElement ||
      (document as any).msFullscreenElement
    );
  };

  document.addEventListener("fullscreenchange", handleFullscreenChange);
  document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
  document.addEventListener("mozfullscreenchange", handleFullscreenChange);
  document.addEventListener("MSFullscreenChange", handleFullscreenChange);

  // 清理事件监听
  onUnmounted(() => {
    document.removeEventListener("fullscreenchange", handleFullscreenChange);
    document.removeEventListener(
      "webkitfullscreenchange",
      handleFullscreenChange
    );
    document.removeEventListener("mozfullscreenchange", handleFullscreenChange);
    document.removeEventListener("MSFullscreenChange", handleFullscreenChange);
  });

  // 初始化 fullscreenElement
  fullscreenElement.value = document.querySelector(
    ".log-viewer"
  ) as HTMLElement;

  // 初始加载日志
  refreshLogs();
  scrollToBottom();
});
</script>
<style scoped>
.log-viewer {
  height: 100%;
  background-color: #1e1e1e;
  color: #d4d4d4;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #252526;
  border-bottom: 1px solid #3c3c3c;
}

.main-content {
  padding: 0;
  padding-left: 10px;
}

.log-entry {
  font-family: "Courier New", Courier, monospace;
  font-size: 12px;
  line-height: 1.5;
  margin-bottom: 4px;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.timestamp {
  color: #569cd6;
}
.level {
  font-weight: bold;
  margin-right: 5px;
}
.level.debug {
  color: #4ec9b0;
}
.level.info {
  color: #569cd6;
}
.level.warn {
  color: #dcdcaa;
}
.level.error {
  color: #f44747;
}
.transaction-id {
  color: #ce9178;
  margin-right: 5px;
}
.performance {
  color: #b5cea8;
  margin-right: 5px;
}
.type,
.order,
.rows {
  color: #9cdcfe;
  margin-right: 5px;
}
.query {
  color: #d7ba7d;
}

:deep(.el-scrollbar__view) {
  padding: 10px;
}

:deep(.el-scrollbar__bar) {
  opacity: 0.3;
}

:deep(.el-button) {
  background-color: #0e639c;
  border-color: #0e639c;
}

:deep(.el-button:hover) {
  background-color: #1177bb;
  border-color: #1177bb;
}

.custom-select,
.custom-datepicker {
  background-color: #252526;
  color: #d4d4d4;
  border: 1px solid #3c3c3c;
}

.custom-select .el-input__inner,
.custom-datepicker .el-input__inner {
  background-color: #252526;
  color: #d4d4d4;
  border: 1px solid #3c3c3c;
}

.custom-select .el-input__inner::placeholder,
.custom-datepicker .el-input__inner::placeholder {
  color: #7a7a7a;
}

.custom-select .el-input__suffix,
.custom-datepicker .el-input__suffix {
  color: #7a7a7a;
}

.custom-select .el-input__icon,
.custom-datepicker .el-input__icon {
  color: #7a7a7a;
}

.custom-select .el-input__prefix,
.custom-datepicker .el-input__prefix {
  color: #7a7a7a;
}

.custom-select .el-input__validateIcon,
.custom-datepicker .el-input__validateIcon {
  color: #7a7a7a;
}

.custom-select .el-input.is-focus .el-input__inner,
.custom-datepicker .el-input.is-focus .el-input__inner {
  border-color: #4a90e2;
}




:deep(.el-scrollbar__thumb) {
  background-color: rgb(255, 255, 255); /* 滚动条滑块颜色 */
  border-radius: 0.25rem; /* 圆角 */
}

:deep(.el-scrollbar__thumb:hover) {
  background-color: rgb(255, 255, 255); /* 滚动条滑块悬停时的颜色 */
}

</style>
