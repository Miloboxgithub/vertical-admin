import axios from "axios";
import request from "../utils/request";

const baseUrl = "https://shixi.xydsh.cn";

function formatDate(dateString) {
  if (!dateString) {
    return ""; // 或者返回一个默认值
  }
  return dateString.split(" ")[0];
}
//分页获取轮播图
export const fetchSwiperData = async (e, p) => {
  try {
    let res = await axios.get("/api/carousel/getAllCarousel", {
      headers: {
        Authorization: localStorage.getItem("vuems_token"),
      },
    });
    //console.log(res.data, "---");
    return res.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    //返回登录页
    return error.message;
  }
};
//新建轮播图
export const createSwiper = async (e) => {

  try {
    let res = await axios.post(
      "/api/carousel/addCarousel",
      {
        name: e.name,
        image: e.image,
        link: e.image,
        clicks: 0,
        weights: parseInt(e.weights),
      },
      {
        headers: {
          token: localStorage.getItem("vuems_token"),
        },
      }
    );

    return res.data;
  } catch (error) {
    console.error("Error fetching user data:", error.message);
    //返回登录页
    return error.message;
  }
};
//删除轮播图
export const DeleteSwiperData = async (e) => {
  try {
    const response = await fetch(`/api/carousel/delCarousel/${e}`, {
      method: "DELETE", // 指定请求方法为 POST
      headers: {
        token: localStorage.getItem("vuems_token"),
      },
    });

    // 检查响应状态
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // 解析响应数据为 JSON
    const res = await response.json();
    return res;
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
    return error;
  }
};
//分页获取管理员
export const fetchAdminData = async (e, p) => {
  try {
    let res = await axios.get("/api/admin/selectAll", {
      headers: {
        token: localStorage.getItem("vuems_token"),
      },
    });
    //console.log(res.data, "---");
    return res.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    //返回登录页
    return error.message;
  }
};
//新建管理员
export const createAdmin = async (e) => {
  try {
    let res = await axios.post(
      "/api/admin/add",
      {
        account: e.account,
        password: e.password,
        name: e.name,
      },
      {
        headers: {
          token: localStorage.getItem("vuems_token"),
        },
      }
    );

    return res.data;
  } catch (error) {
    console.error("Error fetching user data:", error.message);
    //返回登录页
    return error.message;
  }
};
//删除管理员
export const DeleteAdminData = async (e) => {
  try {
    ////console.log(e);
    // 发起 POST 请求
    const response = await fetch(`/api/admin/delete/${e}`, {
      method: "DELETE", // 指定请求方法为 POST
      headers: {
        token: localStorage.getItem("vuems_token"),
      },
    });

    // 检查响应状态
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // 解析响应数据为 JSON
    const res = await response.json();
    ////console.log(res); // 输出获取到的数据

    // 处理 result 数据
    // ...
    return res;
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
    return error;
  }
};
//分页获取用户
export const fetchUserData = async (e, p) => {
  try {
    let res = await axios.post(
      "/api/user/selectByPage",
      {
        page: e,
        pageSize: 50,
      },
      {
        headers: {
          token: localStorage.getItem("vuems_token"),
        },
      }
    );
    //console.log(res.data, "user");
    return res.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    //返回登录页
    return error.message;
  }
};
//分页获取举报信息
export const fetchReportData = async (e, p) => {
  try {
    let res = await axios.post(
      "/api/report/getReportList",
      {
        page: e,
        pageSize: 20,
      },
      {
        headers: {
          token: localStorage.getItem("vuems_token"),
        },
      }
    );
    //console.log(res.data, "report");
    return res.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    //返回登录页
    return error.message;
  }
};
//删除举报信息
export const DeleteReportData = async (e,d) => {
  try {
    ////console.log(e);
    // 发起 POST 请求
    const response = await fetch(`/api/report/delReport`, {
      method: "DELETE", // 指定请求方法为 POST
      body: JSON.stringify({ id: e ,screenshot:d}), // 将数据作为请求体发送
      headers: {
        "Content-Type": "application/json", // 明确指定请求体为 JSON 格式
        token: localStorage.getItem("vuems_token"),
      },
    });

    // 检查响应状态
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // 解析响应数据为 JSON
    const res = await response.json();
    ////console.log(res); // 输出获取到的数据

    // 处理 result 数据
    // ...
    return res;
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
    return error;
  }
};
//查询发布信息
export const SearchCourse = async (e) => {
  try {
    let res = await axios.get(`/api/internship/select/${e}`, {
      headers: {
        Authorization: localStorage.getItem("vuems_token"),
      },
    });
    //console.log(res.data, "iqi");
    return res.data;
  } catch (error) {
    console.error("Error fetching user data:", error.message);
    //返回登录页
    return error.message;
  }
};
//分页获取发布信息
export const fetchInterShipData = async (e, p) => {
  try {
    let res = await axios.post(
      "/api/internship/getByPage",
      {
        page: e,
        pageSize: 20,
      },
      {
        headers: {
          Authorization: localStorage.getItem("vuems_token"),
        },
      }
    );
    //console.log(res.data, "iii");
    return res.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    //返回登录页
    return error.message;
  }
};

//获取类型
export const getIndustryType = async () => {
  try {
    let res = await axios.get("/api/industryType/getIndustryTypeList", {
      headers: {
        token: localStorage.getItem("vuems_token"),
      },
    });
    //console.log(res.data, "---");
    return res.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    //返回登录页
    return error.message;
  }
};
//获取性质
export const getBusinessNature = async () => {
  try {
    let res = await axios.get("/api/businessNature/getBusinessNatureList", {
      headers: {
        token: localStorage.getItem("vuems_token"),
      },
    });
    //console.log(res.data, "---");
    return res.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    //返回登录页
    return error.message;
  }
};

//获取省份
export const getProvince = async () => {
  try {
    let res = await axios.get("/api/getProvinceList", {
      headers: {
        token: localStorage.getItem("vuems_token"),
      },
    });
    //console.log(res.data, "---666");
    return res.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    //返回登录页
    return error.message;
  }
};
//获取城市
// export const getCity = async (e) => {
//   //console.log(e);
//   e = e.toString();

//   try {
//     const url = `/api/getCityByProvinceId/${e}`;
//     let res = await axios.post(url,{

//       headers: {
//         'Content-Type': 'application/json', // 设置Content-Type为application/json
//         token: localStorage.getItem("vuems_token"),
//       },
//     });
//     //console.log(res, "ll---");
//     return res.data;
//   } catch (error) {
//     console.error("Error fetching user data:", error);
//     //返回登录页
//     return error.message;
//   }
// };

export const getCity = async (e) => {
  try {
    const response = await axios({
      method: "post",
      url: `/api/getCityByProvinceId/${e}`, // 确保这里的'1'是你想要查询的provinceId
      headers: {
        token: localStorage.getItem("vuems_token"),
        Accept: "*/*",
        "Cache-Control": "no-cache",
      },
    });
    ////console.log('Response Data:', response.data);
    return response.data;
  } catch (error) {
    console.error("Error occurred:", error.message);
    throw error;
  }
};
//新建实习
export const createIntership = async (e) => {

  try {
    let res = await axios.post(
      "/api/internship/admin/addInternship",
      {
        companyName: e.companyName,
        industryType: e.industryType,
        businessNature: e.businessNature,
        jobPosition: e.jobPosition,
        internshipType: e.internshipType,
        location: e.location,
        responsibility: e.responsibility,
        requirement: e.requirement,
        harvest: e.harvest,
        deliveryMethod: e.deliveryMethod,
        deadline: formatDates(e.deadline),
        companyLogo: e.companyLogo,
        consultPhoto: e.consultPhoto,
        pageview: 0,
        weights: e.weights,
        remark: e.remark,
        industryTypeId: e.industryTypeId,
        businessNatureId: e.businessNatureId,
      },
      {
        headers: {
          token: localStorage.getItem("vuems_token"),
        },
      }
    );

    return res.data;
  } catch (error) {
    console.error("Error fetching user data:", error.message);
    //返回登录页
    return error.message;
  }
};
function formatDates(dateStr) {
  // 创建一个新的 Date 对象
  const date = new Date(dateStr);

  // 设置时间为当天的最后一分钟
  date.setHours(23, 59, 59);

  // 格式化日期
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // 月份从0开始计数
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  //console.log(`${year}-${month}-${day} ${hours}:${minutes}:${seconds}`);
  // 返回格式化后的日期字符串
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
//修改实习
export const changeIntership = async (e) => {

  try {
    let res = await axios.put(
      "/api/internship/adminModifyById",
      {
        id: e.id,
        companyName: e.companyName,
        industryType: e.industryType,
        businessNature: e.businessNature,
        jobPosition: e.jobPosition,
        internshipType: e.internshipType,
        location: e.location,
        responsibility: e.responsibility,
        requirement: e.requirement,
        harvest: e.harvest,
        deliveryMethod: e.deliveryMethod,
        deadline: formatDates(e.deadline),
        companyLogo: e.companyLogo,
        consultPhoto: e.consultPhoto,
        pageview: 0,
        remark: e.remark,
        industryTypeId: e.industryTypeId,
        businessNatureId: e.businessNatureId,
      },
      {
        headers: {
          token: localStorage.getItem("vuems_token"),
        },
      }
    );

    return res.data;
  } catch (error) {
    console.error("Error fetching user data:", error.message);
    //返回登录页
    return error.message;
  }
};
//修改实习
export const changeWeights = async (e) => {

  try {
    let res = await axios.put(
      "/api/internship/updateWeights",
      {
        id: e.id,
        weights: e.weights,
      },
      {
        headers: {
          token: localStorage.getItem("vuems_token"),
        },
      }
    );

    return res.data;
  } catch (error) {
    console.error("Error fetching user data:", error.message);
    //返回登录页
    return error.message;
  }
};
//删除举报信息
export const DeleteInterShipData = async (e,a,b) => {
  try {
    ////console.log(e);
    // 发起 POST 请求
    const response = await fetch(`/api/internship/deleteById`, {
      method: "DELETE", // 指定请求方法为 POST
      body: JSON.stringify({ id: e ,companyLogo:a, consultPhoto:b}), // 将数据作为请求体发送
      headers: {
        "Content-Type": "application/json", // 明确指定请求体为 JSON 格式
        token: localStorage.getItem("vuems_token"),
      },
    });

    // 检查响应状态
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // 解析响应数据为 JSON
    const res = await response.json();
    ////console.log(res); // 输出获取到的数据

    // 处理 result 数据
    // ...
    return res;
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
    return error;
  }
};
//默认
// export const morenPicture = async (e) => {
//   try {
//     let res = await axios.post(
//       "/api/internship/addInternship",
//       {
//         "companyName": e.companyName,
//         "industryType": e.industryType,
//         "businessNature": e.businessNature,
//         "jobPosition": e.jobPosition,
//         "internshipType": e.internshipType,
//         "location": e.location,
//         "responsibility": e.responsibility,
//         "requirement": e.requirement,
//         "harvest": e.harvest,
//         "deliveryMethod": e.deliveryMethod,
//         "deadline": formatDates(e.deadline),
//         "companyLogo": e.companyLogo,
//         "consultPhoto": e.consultPhoto,
//         "pageview" : 0,
//         "weights" : 1,
//         "remark": e.remark,
//         "industryTypeId": e.industryTypeId,
//         "businessNatureId": e.businessNatureId
//       },
//       {
//         headers: {
//           token: localStorage.getItem("vuems_token"),
//         },
//       }
//     );

//     return res.data;
//   } catch (error) {
//     console.error("Error fetching user data:", error.message);
//     //返回登录页
//     return error.message;
//   }
// };

//修改实习
export const updateStatus = async (e) => {
  //console.log(e.id, e.status);
  try {
    let res = await axios.put(
      `/api/user/modifyUserStatus`, // 基础 URL
      {}, // 空的请求体
      {
        params: {
          id: e.id,
          status: e.status,
        },
        headers: {
          token: localStorage.getItem("vuems_token"),
        },
      }
    );

    return res.data;
  } catch (error) {
    console.error("Error fetching user data:", error.message);
    // 返回登录页或其他处理逻辑
    return error.message;
  }
};
