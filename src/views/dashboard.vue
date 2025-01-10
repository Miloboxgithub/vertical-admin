<template>
    <div>
        <el-row :gutter="20" class="mgb20">
            <el-col :span="6">
                <el-card shadow="hover" body-class="card-body">
                    <el-icon class="card-icon bg1">
                        <User />
                    </el-icon>
                    <div class="card-content">
                        <countup class="card-num color1" :end="endValue1" />
                        <div>用户数量</div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card shadow="hover" body-class="card-body">
                    <el-icon class="card-icon bg3">
                        <Shop />
                    </el-icon>
                    <div class="card-content">
                        <countup class="card-num color3" :end="endValue2" />
                        <div>会议室数量</div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card shadow="hover" body-class="card-body">
                    <el-icon class="card-icon bg2">
                        <!-- <ChatDotRound /> -->
                        <Pointer />
                    </el-icon>
                    <div class="card-content">
                        <countup class="card-num color2" :end="endValue3" />
                        <div>预约记录量</div>
                    </div>
                </el-card>
            </el-col>
            
            <el-col :span="6">
                <el-card shadow="hover" body-class="card-body">
                    <el-icon class="card-icon bg4">
                        <View />
                    </el-icon>
                    <div class="card-content">
                        <countup class="card-num color4" :end="endValue4" />
                        <div>今日访问量</div>
                    </div>
                </el-card>
            </el-col>
        </el-row>

        <el-row :gutter="20" class="mgb20"  >
            <el-col :span="17">
                <el-card shadow="hover">
                    <div class="card-header" >
                        <p class="card-header-title">预约动态</p>
                        <p class="card-header-desc">最近一周预约状态，每个会议室被预约时段数量</p>
                    </div>
                    <v-chart class="chart" :option="dashOpt1" style="height: 700px !important;"/>
                </el-card>
            </el-col>
            <!-- <el-col :span="6">
                <el-card shadow="hover">
                    <div class="card-header">
                        <p class="card-header-title">品类分布</p>
                        <p class="card-header-desc">最近一个月销售商品的品类情况</p>
                    </div>
                    <v-chart class="chart" :option="dashOpt2" />
                </el-card>
            </el-col> -->
            <el-col :span="7">
                <el-card shadow="hover" :body-style="{ height: '768.2px', overflowY: 'auto' }" class="scrollable-card">
                    <div class="card-header" >
                        <p class="card-header-title">时间线</p>
                        <p class="card-header-desc">最新的预约动态和信息</p>
                    </div>
                    <el-timeline>
                        <el-timeline-item v-for="(activity, index) in activities" :key="index" :color="activity.color" >
                            <div class="timeline-item">
                                <div>
                                    <p>{{ activity.content }}</p>
                                    <p class="timeline-desc">{{ activity.description }}</p>
                                </div>
                                <div class="timeline-time">{{ activity.timestamp }}</div>
                            </div>
                        </el-timeline-item>
                    </el-timeline>
                </el-card>
            </el-col>
        </el-row>
        <!-- <el-row :gutter="20">
            
            <el-col :span="10">
                <el-card shadow="hover" :body-style="{ height: '400px' }">
                    <div class="card-header">
                        <p class="card-header-title">渠道统计</p>
                        <p class="card-header-desc">最近一个月的订单来源统计</p>
                    </div>
                    <v-chart class="map-chart" :option="mapOptions" />
                </el-card>
            </el-col>
            <el-col :span="7">
                <el-card shadow="hover" :body-style="{ height: '400px' }">
                    <div class="card-header">
                        <p class="card-header-title">排行榜</p>
                        <p class="card-header-desc">销售商品的热门榜单Top5</p>
                    </div>
                    <div>
                        <div class="rank-item" v-for="(rank, index) in ranks">
                            <div class="rank-item-avatar">{{ index + 1 }}</div>
                            <div class="rank-item-content">
                                <div class="rank-item-top">
                                    <div class="rank-item-title">{{ rank.title }}</div>
                                    <div class="rank-item-desc">销量：{{ rank.value }}</div>
                                </div>
                                <el-progress
                                    :show-text="false"
                                    striped
                                    :stroke-width="10"
                                    :percentage="rank.percent"
                                    :color="rank.color"
                                />
                            </div>
                        </div>
                    </div>
                </el-card>
            </el-col>
        </el-row> -->
    </div>
</template>

<script setup lang="ts" name="dashboard">
import countup from '@/components/countup.vue';
import { use, registerMap } from 'echarts/core';
import { BarChart, LineChart, PieChart, MapChart } from 'echarts/charts';
import {
    GridComponent,
    TooltipComponent,
    LegendComponent,
    TitleComponent,
    VisualMapComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import VChart from 'vue-echarts';
import { dashOpt1, dashOpt2, mapOptions } from './chart/options';
import chinaMap from '@/utils/china';
import { ref } from 'vue';
//import { fetchUserData,fetchUserData2,fetchUserData3 } from "@/api";
import axios from "axios";
import { ElMessage } from 'element-plus';
import { useRouter } from "vue-router";
const router = useRouter();
const goTologon = () => {
  // 使用 router.push 方法进行页面跳转
  router.push("/login");
  ElMessage.error("获取数据失败");
};
use([
    CanvasRenderer,
    BarChart,
    GridComponent,
    LineChart,
    PieChart,
    TooltipComponent,
    LegendComponent,
    TitleComponent,
    VisualMapComponent,
    MapChart,
]);
const endValue1 = ref(0); // 初始值
const endValue2 = ref(0); // 初始值
const endValue3 = ref(0); // 初始值
const endValue4 = ref(0); // 初始值
// async function updateEndValue() {
//   // 这里可以设置逻辑来更新 endValue 的值
//   let ans1 = await fetchUserData(1,'','')
//   let ans2 = await fetchUserData2(2,'','','')
//   let ans3 = await fetchUserData3(3,'','')
//   endValue1.value = ans2.total
//   if (ans1 == "Request failed with status code 403") {
//     goTologon();
//   }
//   endValue2.value = ans1.total
//   endValue3.value = ans3.total
// }
//updateEndValue();
registerMap('china', chinaMap);
const activities = [
    {
        content: '用户预约',
        description: 'xxx预约了会议室A',
        timestamp: '30分钟前',
        color: '#00bcd4',
    },
    {
        content: '用户评价',
        description: 'xxx对服务进行了好评',
        timestamp: '55分钟前',
        color: '#1ABC9C',
    },
    {
        content: '取消预约',
        description: 'xxx取消了会议室B的预约',
        timestamp: '1小时前',
        color: '#3f51b5',
    },
    {
        content: '删除记录',
        description: 'xxx删除了了会议室C的预约记录',
        timestamp: '15小时前',
        color: '#f44336',
    },
    {
        content: '会议室添加',
        description: 'xxx添加了会议室D',
        timestamp: '1天前',
        color: '#009688',
    },
    {
        content: '会议室添加',
        description: 'xxx添加了会议室D',
        timestamp: '1天前',
        color: '#009688',
    },
    {
        content: '会议室添加',
        description: 'xxx添加了会议室D',
        timestamp: '1天前',
        color: '#009688',
    },
    {
        content: '会议室添加',
        description: 'xxx添加了会议室D',
        timestamp: '1天前',
        color: '#009688',
    },
    {
        content: '会议室添加',
        description: 'xxx添加了会议室D',
        timestamp: '1天前',
        color: '#009688',
    },
    {
        content: '会议室添加',
        description: 'xxx添加了会议室D',
        timestamp: '1天前',
        color: '#009688',
    },
    {
        content: '会议室添加',
        description: 'xxx添加了会议室D',
        timestamp: '1天前',
        color: '#009688',
    },
    {
        content: '会议室添加',
        description: 'xxx添加了会议室D',
        timestamp: '1天前',
        color: '#009688',
    },
    {
        content: '会议室添加',
        description: 'xxx添加了会议室D',
        timestamp: '1天前',
        color: '#009688',
    },
    {
        content: '会议室添加',
        description: 'xxx添加了会议室D',
        timestamp: '1天前',
        color: '#009688',
    },
    {
        content: '会议室添加',
        description: 'xxx添加了会议室D',
        timestamp: '1天前',
        color: '#009688',
    },
    {
        content: '会议室添加',
        description: 'xxx添加了会议室D',
        timestamp: '1天前',
        color: '#009688',
    },
    {
        content: '会议室添加',
        description: 'xxx添加了会议室D',
        timestamp: '1天前',
        color: '#009688',
    },
    {
        content: '会议室添加',
        description: 'xxx添加了会议室D',
        timestamp: '1天前',
        color: '#009688',
    },
    {
        content: '会议室添加',
        description: 'xxx添加了会议室D',
        timestamp: '1天前',
        color: '#009688',
    },
    {
        content: '会议室添加',
        description: 'xxx添加了会议室D',
        timestamp: '1天前',
        color: '#009688',
    },
    {
        content: '会议室添加',
        description: 'xxx添加了会议室D',
        timestamp: '1天前',
        color: '#009688',
    },
    {
        content: '会议室添加',
        description: 'xxx添加了会议室D',
        timestamp: '1天前',
        color: '#009688',
    },
];

const ranks = [
    {
        title: '手机',
        value: 10000,
        percent: 80,
        color: '#f25e43',
    },
    {
        title: '电脑',
        value: 8000,
        percent: 70,
        color: '#00bcd4',
    },
    {
        title: '相机',
        value: 6000,
        percent: 60,
        color: '#64d572',
    },
    {
        title: '衣服',
        value: 5000,
        percent: 55,
        color: '#e9a745',
    },
    {
        title: '书籍',
        value: 4000,
        percent: 50,
        color: '#009688',
    },
];
</script>

<style>
.card-body {
    display: flex;
    align-items: center;
    height: 100px;
    padding: 0;
}
</style>
<style scoped>
.scrollable-card .el-card__body {
  overflow-y: auto; /* 添加垂直滚动条 */
  height: 768.2px; /* 设置固定高度 */
}
.card-content {
    flex: 1;
    text-align: center;
    font-size: 14px;
    color: #999;
    padding: 0 20px;
}

.card-num {
    font-size: 30px;
}

.card-icon {
    font-size: 50px;
    width: 100px;
    height: 100px;
    text-align: center;
    line-height: 100px;
    color: #fff;
}

.bg1 {
    background: #2d8cf0;
}

.bg2 {
    background: #64d572;
}

.bg3 {
    background: #f25e43;
}

.bg4 {
    background: #e9a745;
}

.color1 {
    color: #2d8cf0;
}

.color2 {
    color: #64d572;
}

.color3 {
    color: #f25e43;
}

.color4 {
    color: #e9a745;
}

.chart {
    width: 100%;
    height: 100%;
}

.card-header {
    padding-left: 10px;
    margin-bottom: 20px;
}

.card-header-title {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 5px;
}

.card-header-desc {
    font-size: 14px;
    color: #999;
}

.timeline-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 16px;
    color: #000;
}

.timeline-time,
.timeline-desc {
    font-size: 12px;
    color: #787878;
}

.rank-item {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
}

.rank-item-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #f2f2f2;
    text-align: center;
    line-height: 40px;
    margin-right: 10px;
}

.rank-item-content {
    flex: 1;
}

.rank-item-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #343434;
    margin-bottom: 10px;
}

.rank-item-desc {
    font-size: 14px;
    color: #999;
}
.map-chart {
    width: 100%;
    height: 350px;
}
</style>
