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
          <div v-if="item.type === 'sss'" style="width: 100%; height: 100%">
            <div
              style="
                width: 100%;
                height: 40px;
                border: 1px solid #ccc;
                border-radius: 5px;
                padding: 10px;
                display: flex;
                align-items: center;
              "
            >
              <div style="color: #2272fb">指定学生（{{ numnum }}人）</div>
              <el-input
                v-model="inputname"
                style="width: 240px"
                placeholder="学生姓名查询"
              />
            </div>
            <div class="scrollable-window">
              <div class="window-content">
                <el-table :data="stableData" class="custom-table-font-size">
                  <el-table-column prop="name" label="name" width="80" />
                  <el-table-column prop="sno" label="sno" width="80" />
                  <el-table-column prop="major" label="major" width="130" />
                  <el-table-column prop="class" label="class" width="60" />
                  <el-table-column prop="phone" label="phone" width="120" />
                </el-table>
              </div>
            </div>
          </div>
          <el-input
            v-if="item.type === 'input'"
            v-model="form[item.prop]"
            :disabled="item.disabled"
            :placeholder="item.placeholder"
            clearable
            type="text"
          ></el-input>
          <el-input
            v-if="item.type === 'input1'"
            v-model="form[item.prop]"
            :disabled="item.disabled"
            :placeholder="item.placeholder"
            clearable
            maxlength="650"
            type="textarea"
            show-word-limit
          ></el-input>
          <el-input
            v-if="item.type === 'input2'"
            v-model="form[item.prop]"
            :disabled="item.disabled"
            :placeholder="item.placeholder"
            clearable
            maxlength="350"
            type="textarea"
            show-word-limit
          ></el-input>
          <el-input
            v-if="item.type === 'input3'"
            v-model="form[item.prop]"
            :disabled="item.disabled"
            :placeholder="item.placeholder"
            clearable
            maxlength="150"
            type="textarea"
            show-word-limit
          ></el-input>
          <el-input
            v-if="item.type === 'input4'"
            v-model="form[item.prop]"
            :disabled="item.disabled"
            :placeholder="item.placeholder"
            clearable
            maxlength="200"
            type="textarea"
            show-word-limit
          ></el-input>
          <el-date-picker
            v-else-if="item.type === 'datetimerange'"
            v-model="form[item.prop]"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="yyyy-MM-dd HH:mm:ss"
          ></el-date-picker>
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
            @change="handleChange($event, item.prop, form[item.prop])"
          >
            <el-option
              v-for="opt in item.options"
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
          <el-select
            v-else-if="item.type === 'status'"
            v-model="form[item.prop]"
            :disabled="item.disabled"
            :placeholder="item.placeholder"
            clearable
          >
            <el-option
              v-for="status in item.status"
              :label="status.label"
              :value="status.value"
            ></el-option>
            <!-- <el-option v-for="timm" :label="item.label" :value="item.value"></el-option> -->
          </el-select>
          <el-select
            v-else-if="item.type === 'st'"
            v-model="form[item.prop]"
            :disabled="item.disabled"
            :placeholder="item.placeholder"
            clearable
          >
            <el-option
              v-for="st in item.st"
              :label="st.label"
              :value="st.value"
            ></el-option>
            <!-- <el-option v-for="timm" :label="item.label" :value="item.value"></el-option> -->
          </el-select>
          <el-select
            v-else-if="item.type === 'sta'"
            v-model="form[item.prop]"
            :disabled="item.disabled"
            :placeholder="item.placeholder"
            clearable
          >
            <el-option
              v-for="sta in item.sta"
              :label="sta.label"
              :value="sta.value"
            ></el-option>
            <!-- <el-option v-for="timm" :label="item.label" :value="item.value"></el-option> -->
          </el-select>
          <el-date-picker
            v-else-if="item.type === 'date'"
            type="date"
            v-model="form[item.prop]"
            :value-format="item.format"
            :disabled-date="disabledDate"
          ></el-date-picker>
          <el-switch
            v-else-if="item.type === 'switch'"
            v-model="form[item.prop]"
            :active-value="item.activeValue"
            :inactive-value="item.inactiveValue"
            :active-text="item.activeText"
            :inactive-text="item.inactiveText"
          ></el-switch>
          <el-cascader
            v-else-if="item.type === 'cascader'"
            v-model="form[item.prop]"
            :options="item.options"
          ></el-cascader>
          <el-upload
            v-else-if="item.type === 'upload'"
            class="avatar-uploader"
            action="/api/carousel/imageUpload"
            :headers="getHeaders()"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
          >
            <img
              v-if="form[item.prop]"
              :src="form[item.prop]"
              mode="widthFix"
              class="avatar"
            />
            <el-icon v-else class="avatar-uploader-icon">
              <Plus />
            </el-icon>
          </el-upload>
          <el-upload
            v-else-if="item.type === 'uploaded'"
            class="avatar-uploader"
            action="/api/internship/companyLogoUpload"
            :headers="getHeaders()"
            :show-file-list="false"
            :on-success="handleLogoSuccess"
          >
            <img
              v-if="form[item.prop]"
              :src="form[item.prop]"
              mode="widthFix"
              class="avatar"
            />
            <el-icon v-else class="avatar-uploader-icon">
              <Plus />
            </el-icon>
          </el-upload>
          <el-upload
            v-else-if="item.type === 'uploads'"
            v-model:file-list="fileList"
            action="/api/internship/consultPhotoUpload"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-success="handleConsultSuccess"
            :headers="getHeaders()"
          >
            <el-icon><Plus /></el-icon>
          </el-upload>

          <el-dialog
            v-else-if="item.type === 'uploads'"
            v-model="dialogVisible"
          >
            <img w-full :src="dialogImageUrl" alt="Preview Image" />
          </el-dialog>
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
const numnum = ref(0);
const inputname = ref("");
const stableData = ref([]);
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
const fileList = ref([
  // {
  //   name: "food.jpeg",
  //   url: "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100",
  // }
]);
// fileList.value = []
// console.log(fileList.value, "fileList.value");
const fileConsult = ref([]);
const dialogImageUrl = ref("");
const dialogVisible = ref(false);
const handleRemove: UploadProps["onRemove"] = (uploadFile, uploadFiles) => {
  console.log(uploadFile.url, uploadFiles, fileConsult.value);
  fileConsult.value = fileConsult.value.filter(
    (url) => url.url != uploadFile.url
  );
  let ans = fileConsult.value[0].url.toString();
  for (let i = 1; i < fileConsult.value.length; i++) {
    ans += "|" + fileConsult.value[i].url.toString();
  }
  form.value["consultPhoto"] = ans.toString();
};
const lasts = ref([])
lasts.value = options.list.filter((item) => item.prop == "location");

const handlePictureCardPreview: UploadProps["onPreview"] = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url!;
  dialogVisible.value = true;
};
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
  item.status = [
    {
      label: "正常",
      value: 1,
    },
    {
      label: "禁用",
      value: 0,
    },
  ];
  item.st = [
    {
      label: "正常",
      value: "正常",
    },
    {
      label: "禁用",
      value: "禁用",
    },
  ];
  item.sta = [
    {
      label: "可预约",
      value: "可预约",
    },
    {
      label: "已预约",
      value: "已预约",
    },
    {
      label: "已取消",
      value: "已取消",
    },
    {
      label: "不可预约",
      value: "不可预约",
    },
  ];
});
const updateDependentOptions = (mainProp) => {
  console.log(mainProp);
  console.log(options);
  options.list = options.list.filter((item) => item.prop !== mainProp);
};
console.log(options, "options.list");
const form = ref({ ...(edit ? formData : {}) });
if(form.value.internshipType == "远程") {updateDependentOptions("location");}
if (form.value.location) form.value.location = form.value.location.split("-");
let qs = [];
if (form.value.consultPhoto) qs = form.value.consultPhoto.split("|");
if (qs.length > 1) {
  qs.forEach((item) => {
    fileConsult.value.push({
      name: "123",
      url: item,
    });
    fileList.value.push({
      name: "123",
      url: item,
    });
  });
} else if (form.value.consultPhoto) {
  fileConsult.value.push({
    name: "123",
    url: form.value.consultPhoto,
  });
  fileList.value.push({
    name: "123",
    url: form.value.consultPhoto,
  });
}

const handleChange = (event, a, b) => {
  console.log("事件对象：", event);
  console.log("第一个自定义值：", a);
  console.log("第二个自定义值：", b);
  console.log(form.value, "form.val");
  if (a == "internshipType") {
    if (b == "远程") {
      updateDependentOptions("location");
    } else {
      console.log(lasts.value)
      const index = options.list.findIndex((user) => user.prop === a);
      const f = options.list.findIndex((user) => user.prop === lasts.value[0].prop);
      if (index !== -1 && f == -1) {
        options.list.splice(index + 1, 0, ...lasts.value);
      }
    }
  }
};
//console.log(form.value, "form.val");
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
const formRef = ref<FormInstance>();
const saveEdit = (formEl: FormInstance | undefined) => {
  if (!formEl) return;

  update(form.value);

  //console.log(form.value, "form.value444444");
  // if (edits) {
  //   //console.log(form.value.roomName,'editsform');
  //   DeleteRoom(form);
  // } else {
  //   if (!edit) {
  //     //console.log(form.value,'增添数据');
  //     if ("role" in form.value) createRoom2(form.value);
  //     else createRoom(form.value);
  //   } else {
  //     //console.log(form.value,'修改数据');
  //     if ("role" in form.value) changeRoom2(form.value);
  //     else if ("appointmentPerson" in form.value) changeRoom3(form.value);
  //     else changeRoom(form.value);
  //   }
  // }
};
const getHeaders = () => {
  const token = localStorage.getItem("vuems_token"); // 假设 token 存储在 localStorage 中
  return {
    token: token,
  };
};
const handleAvatarSuccess = (response: any, file: File) => {
  // 假设后端返回的数据格式为 { url: '图片链接' }
  console.log(response, "response");
  if (response.code == 1 && response.data) {
    form.value["image"] = response.data;
  } else {
    console.error("上传失败或未返回链接");
  }
};
const handleLogoSuccess = (response: any, file: File) => {
  // 假设后端返回的数据格式为 { url: '图片链接' }
  console.log(response, "response");
  if (response.code == 1 && response.data) {
    form.value["companyLogo"] = response.data;
  } else {
    console.error("上传失败或未返回链接");
  }
};
const handleConsultSuccess = (response: any, file: File) => {
  // 假设后端返回的数据格式为 { url: '图片链接' }
  console.log(response, "responsesssss", fileList.value, fileConsult.value);
  if (response.code == 1 && response.data) {
    //form.value["consultPhoto"] = response.data;
    fileConsult.value.push({
      name: file.name,
      url: response.data,
    });
    console.log(fileList.value, "fileList.value", fileConsult.value);
    let ans = fileConsult.value[0].url.toString();
    for (let i = 1; i < fileConsult.value.length; i++) {
      ans += "|" + fileConsult.value[i].url.toString();
    }
    form.value["consultPhoto"] = ans.toString();
    console.log(form.value["consultPhoto"], "form.value.consultPhoto");
  } else {
    console.error("上传失败或未返回链接");
  }
};
const disabledDate = (time) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // 将今天的时间设置为午夜，以便于比较日期
  return time.getTime() < today.getTime(); // 如果传入的时间早于今天，则返回 true，禁用该日期
};
const compressImage = (
  file: File,
  maxWidth: number,
  maxHeight: number,
  quality: number
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    // 将文件读取为 Data URL
    reader.onload = (event) => {
      img.src = event.target?.result as string;
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // 计算压缩后的宽高
      let width = img.width;
      let height = img.height;

      if (width > maxWidth || height > maxHeight) {
        if (width > height) {
          height *= maxWidth / width;
          width = maxWidth;
        } else {
          width *= maxHeight / height;
          height = maxHeight;
        }
      }

      // 设置 canvas 尺寸
      canvas.width = width;
      canvas.height = height;

      // 绘制图片到 canvas 上
      ctx?.drawImage(img, 0, 0, width, height);

      // 将 canvas 转换为 Blob 格式
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Canvas to Blob failed"));
          }
        },
        "image/jpeg", // 输出格式
        quality // 压缩质量（0 到 1）
      );
    };

    img.onerror = (error) => reject(error);
  });
};
</script>

<style>
.scrollable-window {
  max-width: 800px; /* 最大宽度为800px */
  width: 100%; /* 宽度占满父容器 */
  height: 200px; /* 窗口高度 */
  overflow-y: auto; /* 允许垂直滚动 */
  border: 1px solid #ccc; /* 边框样式 */
  margin: 20px auto; /* 水平居中，上下外边距20px */
  padding: 10px; /* 内边距 */
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); /* 阴影效果 */
  border-radius: 5px; /* 边框圆角 */
}

.window-content {
  /* 窗口内容的样式，可根据需要调整 */
  width: 100%;
}
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;

  transition: var(--el-transition-duration-fast);
}
.avatar {
  width: 100%;
  height: auto;
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
.custom-table-font-size {
  font-size: 10px; /* 设置字体大小为14px */
}
</style>
