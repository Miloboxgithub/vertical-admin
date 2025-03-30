<template>
	<el-config-provider :locale="zhCn">
		<router-view />
	</el-config-provider>
</template>

<script setup lang="ts">
import { ElConfigProvider } from 'element-plus';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import { useThemeStore } from './store/theme';
import { onMounted, ref, provide, onBeforeMount } from 'vue';
import { getProvince, getCity } from '@/api';
const theme = useThemeStore();
theme.initTheme();
const locationOptions = ref([]);
const getlocationOptions = async () => {
  try {
    const res = await getProvince();
    locationOptions.value = res.data.map(item => ({
      label: item.province,
      value: item.province,
	  v:item.id,
      children: []
    }));
    
    for (const province of locationOptions.value) {
      const citiesRes = await getCity(province.v);
      province.children = citiesRes.data.map(item => ({
        label: item.name,
        value: item.name,
		v:item.id
      }));
    }
	//console.log(locationOptions.value,'ssds');
    //newoptions.value.list[6].options = locationOptions.value;
  } catch (error) {
    console.error('获取位置选项失败:', error);
  }
};
onMounted(() => {
  getlocationOptions();
});
// 提供数据
provide('locationOptions', locationOptions);
</script>
<style>
@import './assets/css/main.css';
</style>
