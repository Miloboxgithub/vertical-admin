<template>
  <el-form
    ref="formRef"
    :model="form"
    :rules="rules"
    :label-width="options.labelWidth"
  >
    <el-row>
      <el-col :span="options.span" v-for="item in options.list">
        <el-form-item :label="item.label" :prop="item.prop">
          <!-- 文本框、数字框、下拉框、日期框、开关、上传 -->
          <el-input
            v-if="item.type === 'input'"
            v-model="form[item.prop]"
            :disabled="item.disabled"
            :placeholder="item.placeholder"
            clearable
          ></el-input>
          <el-input-number
            v-else-if="item.type === 'number'"
            v-model="form[item.prop]"
            :disabled="item.disabled"
            controls-position="right"
          ></el-input-number>
          <el-select
            v-else-if="item.type === 'select'"
            v-model="form[item.prop]"
            :disabled="item.disabled"
            :placeholder="item.placeholder"
            clearable
          >
            <el-option
              v-for="opt in item.opts"
              :label="opt.label"
              :value="opt.value"
            ></el-option>
            <!-- <el-option v-for="timm" :label="item.label" :value="item.value"></el-option> -->
          </el-select>
          <el-select
            v-else-if="item.type === 'selects'"
            v-model="form[item.prop]"
            :disabled="item.disabled"
            :placeholder="item.placeholder"
            clearable
          >
            <el-option
              v-for="opted in item.opted"
              :label="opted.label"
              :value="opted.value"
            ></el-option>
            <!-- <el-option v-for="timm" :label="item.label" :value="item.value"></el-option> -->
          </el-select>
          <el-date-picker
            v-else-if="item.type === 'date'"
            type="date"
            v-model="form[item.prop]"
            :value-format="item.format"
          ></el-date-picker>
          <el-switch
            v-else-if="item.type === 'switch'"
            v-model="form[item.prop]"
            :active-value="item.activeValue"
            :inactive-value="item.inactiveValue"
            :active-text="item.activeText"
            :inactive-text="item.inactiveText"
          ></el-switch>
          <el-upload
            v-else-if="item.type === 'upload'"
            class="avatar-uploader"
            action="#"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
          >
            <img v-if="form[item.prop]" :src="form[item.prop]" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon">
              <Plus />
            </el-icon>
          </el-upload>
          <slot :name="item.prop" v-else> </slot>
        </el-form-item>
      </el-col>
    </el-row>

    <el-form-item>
      <el-button type="primary" @click="saveEdit(formRef)">保 存</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { FormOption } from "@/types/form-option";
import { FormInstance, FormRules, UploadProps } from "element-plus";
import { PropType, ref } from "vue";

const { options, formData, edit, update, edits } = defineProps({
  options: {
    type: Object as PropType<FormOption>,
    required: true,
  },
  formData: {
    type: Object,
    required: true,
  },
  edit: {
    type: Boolean,
    required: false,
  },
  update: {
    type: Function,
    required: true,
  },
  edits: {
    type: Boolean,
    required: true,
  },
});
options.list.forEach((item) => {
  item.opts = [
    {
      label: "user",
      value: "user",
    },
    {
      label: "admin",
      value: "admin",
    },
  ];
  item.opted = [
    {
      label: "08:00-09:00",
      value: "08:00-09:00",
    },
    {
      label: "09:00-10:00",
      value: "09:00-10:00",
    },
    {
      label: "10:00-11:00",
      value: "10:00-11:00",
    },
    {
      label: "11:00-12:00",
      value: "11:00-12:00",
    },
    {
      label: "12:00-13:00",
      value: "12:00-13:00",
    },
    {
      label: "13:00-14:00",
      value: "13:00-14:00",
    },
    {
      label: "14:00-15:00",
      value: "14:00-15:00",
    },
    {
      label: "15:00-16:00",
      value: "15:00-16:00",
    },
    {
      label: "16:00-17:00",
      value: "16:00-17:00",
    },
    {
      label: "17:00-18:00",
      value: "17:00-18:00",
    },
    {
      label: "18:00-19:00",
      value: "18:00-19:00",
    },
    {
      label: "19:00-20:00",
      value: "19:00-20:00",
    },
  ];
});
//console.log(edit, "eeeeeeeeeee");
const form = ref({ ...(edit ? formData : {}) });
console.log(form.value.password, "form.value");
form.value.password = "";
const rules: FormRules = options.list
  .map((item) => {
    if (item.required) {
      return {
        [item.prop]: [
          { required: true, message: `${item.label}不能为空`, trigger: "blur" },
        ],
      };
    }
    return {};
  })
  .reduce((acc, cur) => ({ ...acc, ...cur }), {});

const formRef = ref<FormInstance>();
const saveEdit = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate((valid) => {
    if (!valid) return false;
    update(form.value);
  });
  if (edits) {
    //console.log(form.value.roomName,'editsform');
    DeleteRoom(form);
  }
  else{
  if (!edit) {
    //console.log(form.value,'增添数据');
    if ("role" in form.value) createRoom2(form.value);
    else createRoom(form.value);
  } else {
    //console.log(form.value,'修改数据');
    if ("role" in form.value) changeRoom2(form.value);
    else if ("appointmentPerson" in form.value) changeRoom3(form.value);
    else changeRoom(form.value);
  }
}
 
};
const changeRoom = async (e) => {
  console.log(e.status);

  try {
    // 定义要发送的数据
    const data = {
      Id: e.id,
      name: e.name,
      capacity: e.capacity,
      status: parseInt(e.status),
      // start_time: e.time.substring(0, 5) + ":00",
      // end_time: e.time.substring(6, 11) + ":00",
      // ...其他需要的数据字段
    };
    // if (data.end_time == null) {
    //   data.end_time = e.endTime;
    // }
    // 发起 POST 请求
    const response = await fetch("/api/sadmin/updmeetingroom", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json", // 设置请求头，告诉服务器发送的是 JSON 数据
        Authorization: localStorage.getItem("vuems_token"),
      },
      body: JSON.stringify(data), // 将 JavaScript 对象转换为 JSON 字符串
    });

    // 检查响应状态
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // 解析响应数据为 JSON
    const result = await response.json();
    console.log(result); // 输出获取到的数据

    // 处理 result 数据
    // ...
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
  }
};
const createRoom = async (e) => {
  try {
    // 定义要发送的数据
    const data = {
      name: e.name,
      capacity: parseInt(e.capacity),
      status: 1,
      // start_time: "08:00:00",
      // end_time: "20:00:00",
      // interval: 60,
      // ...其他需要的数据字段
    };
    // 发起 POST 请求
    const response = await fetch("/api/sadmin/addmeetingroom", {
      method: "POST", // 指定请求方法为 POST
      headers: {
        "Content-Type": "application/json", // 设置请求头，告诉服务器发送的是 JSON 数据
        // 根据需要可能还需要添加其他头部信息，如认证令牌等
        Authorization: localStorage.getItem("vuems_token"),
      },
      body: JSON.stringify(data), // 将 JavaScript 对象转换为 JSON 字符串
    });

    // 检查响应状态
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // 解析响应数据为 JSON
    const result = await response.json();
    console.log(result); // 输出获取到的数据

    // 处理 result 数据
    // ...
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
  }
};
const changeRoom2 = async (e) => {
  try {
    // 定义要发送的数据
    const data = {
      id: e.id,
      name: e.name,
      role: e.role,
      phone: e.phone,
      sno: e.sno,
      depart: e.depart,
      status: e.status,
      // password: e.password,
      // ...其他需要的数据字段
    };
    if (e.password) {
      data["password"] = e.password;
    }
    // 发起 POST 请求
    const response = await fetch("/api/sadmin/updateuser", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json", // 设置请求头，告诉服务器发送的是 JSON 数据
        Authorization: localStorage.getItem("vuems_token"),
      },
      body: JSON.stringify(data), // 将 JavaScript 对象转换为 JSON 字符串
    });

    // 检查响应状态
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // 解析响应数据为 JSON
    const result = await response.json();
    console.log(result); // 输出获取到的数据

    // 处理 result 数据
    // ...
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
  }
};
const createRoom2 = async (e) => {
  try {
    console.log(e, "创建用户");
    // 定义要发送的数据
    const data = {
      name: e.name,
      role: e.role,
      phone: e.phone,
      sno: e.sno,
      depart: e.depart,
      status: 1,
      // password: e.password,
      // ...其他需要的数据字段
    };
    if (e.password.length > 0) {
      data["password"] = e.password;
    }
    // 发起 POST 请求
    const response = await fetch("/api/sadmin/createuser", {
      method: "POST", // 指定请求方法为 POST
      headers: {
        "Content-Type": "application/json", // 设置请求头，告诉服务器发送的是 JSON 数据
        Authorization: localStorage.getItem("vuems_token"),
      },
      body: JSON.stringify(data), // 将 JavaScript 对象转换为 JSON 字符串
    });

    // 检查响应状态
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // 解析响应数据为 JSON
    const result = await response.json();
    console.log(result); // 输出获取到的数据

    // 处理 result 数据
    // ...
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
  }
};
const changeRoom3 = async (e) => {
  try {
    // 定义要发送的数据
    const data = {
      id: e.id,
      meetingroomId: e.meetingroomId,
      appointmentDate: e.appointmentDate,
      appointmentTime: e.appointmentTime,
      appointmentSno: e.appointmentSno,
      appointmentType: e.appointmentType,
      status: e.status,
      // ...其他需要的数据字段
    };
    console.log(data, "editststs");

    // 发起 POST 请求
    const response = await fetch("/api/sadmin/updateappointmentrecord", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json", // 设置请求头，告诉服务器发送的是 JSON 数据
        Authorization: localStorage.getItem("vuems_token"),
      },
      body: JSON.stringify(data), // 将 JavaScript 对象转换为 JSON 字符串
    });

    // 检查响应状态
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // 解析响应数据为 JSON
    const result = await response.json();
    console.log(result, "editsssss"); // 输出获取到的数据

    // 处理 result 数据
    // ...
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
  }
};
//一键删除房间
const DeleteRoom = async (e) => {
  var dateStr = e.value.date;
  // 将字符串转换为Date对象
  var date = new Date(dateStr);
  // 使用Date对象的toLocaleDateString方法来格式化日期
  // 这里的选项{ year: 'numeric', month: '2-digit', day: '2-digit' }表示年、月、日的格式
  var formattedDate = date
    .toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    .replace(/\//g, "-"); // 将斜杠替换为破折号

  //console.log(formattedDate, "好好好");
  try {
    // 定义要发送的数据
    const data = {
      meetingroomId: e.value.id,
      appointmentDate: formattedDate,
      times: e.value.time,
      // ...其他需要的数据字段
    };
    // 发起 POST 请求
    const response = await fetch("/api/sadmin/addforbidappointmenttimebunch", {
      method: "POST", // 指定请求方法为 POST
      headers: {
        "Content-Type": "application/json", // 设置请求头，告诉服务器发送的是 JSON 数据
        // 根据需要可能还需要添加其他头部信息，如认证令牌等
        Authorization: localStorage.getItem("vuems_token"),
      },
      body: JSON.stringify(data), // 将 JavaScript 对象转换为 JSON 字符串
    });

    // 检查响应状态
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // 解析响应数据为 JSON
    const result = await response.json();
    console.log(result, "不可预约时间"); // 输出获取到的数据

    // 处理 result 数据
    // ...
    return result;
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
    return error;
  }
};
const handleAvatarSuccess: UploadProps["onSuccess"] = (
  response,
  uploadFile
) => {
  form.value.thumb = URL.createObjectURL(uploadFile.raw!);
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
