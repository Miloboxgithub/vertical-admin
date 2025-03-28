import axios from "axios";
import request from "../utils/request";

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
    console.log(res.data, "---");
    return res.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    //返回登录页
    return error.message;
  }
};
//新建轮播图
export const createSwiper = async (e) => {
  console.log({
    name: e.name,
    image: e.image,
    link: e.image,
    clicks: 0,
    weights: parseInt(e.weights),
  })
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
    console.log(res.data, "---");
    return res.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    //返回登录页
    return error.message;
  }
};
//新建管理员
export const createAdmin = async (e) => {
  console.log({
    "account": e.account,
    "password": e.password,
    "name": e.name,
  })
  try {
    let res = await axios.post(
      "/api/admin/add",
      {
        "account": e.account,
        "password": e.password,
        "name": e.name,
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
    //console.log(e);
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
    //console.log(res); // 输出获取到的数据

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
    console.log(res.data, "user");
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
    let res = await axios.get(
      "/api/report/getReportList",
      {
        headers: {
          token: localStorage.getItem("vuems_token"),
        },
      }
    );
    console.log(res.data, "report");
    return res.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    //返回登录页
    return error.message;
  }
};
//删除举报信息
export const DeleteReportData = async (e) => {
  try {
    //console.log(e);
    // 发起 POST 请求
    const response = await fetch(`/api/report/delReport/${e}`, {
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
    //console.log(res); // 输出获取到的数据

    // 处理 result 数据
    // ...
    return res;
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
    return error;
  }
};
//根据编号查询实践课程
export const SearchCourse = async (e) => {
  try {
    let res = await axios.get("/api/admin/getprojectpractice", {
      params: {
        projectpracticeCode: e,
      },
      headers: {
        Authorization: localStorage.getItem("vuems_token"),
      },
    });
    if (res.data.code != 0) {
      return null;
    }
    let t = [res.data.data.ProjectPractice];
    let ans = {
      ProjectPracticeInfoList: t,
      total: 1,
    };
    ans.ProjectPracticeInfoList.forEach((item) => {
      item.selectTime =
        formatDate(item.selectStime) + "~" + formatDate(item.selectEtime);
      item.titleTime =
        formatDate(item.titleStime) + "~" + formatDate(item.titleEtime);
    });
    return ans;
  } catch (error) {
    console.error("Error fetching user data:", error.message);
    //返回登录页
    return error.message;
  }
};
//分页获取发布信息
export const fetchInterShipData = async (e, p) => {
  try {
    let res = await axios.post("/api/internship/selectByContent",{
      "page": e,
      "pageSize": 20
    } ,{
      headers: {
        Authorization: localStorage.getItem("vuems_token"),
      },
    });
    console.log(res.data, "---");
    return res.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    //返回登录页
    return error.message;
  }
};







