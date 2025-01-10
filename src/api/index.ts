import axios from "axios";
import request from "../utils/request";

function formatDate(dateString) {
  if (!dateString) {
    return ""; // 或者返回一个默认值
  }
  return dateString.split(" ")[0];
}
//分页获取实践课程
export const fetchCourseData = async (e, p) => {
  console.log("fetchCourseData", e, p);
  try {
    let res = await axios.get("/api/admin/getprojectpracticebypage", {
      params: {
        page: e,
        size: 10,
        Content: "",
        Type: "",
        reverse: p,
      },
      headers: {
        Authorization: localStorage.getItem("vuems_token"),
      },
    });
    console.log(res.data);
    let ans = {
      ProjectPracticeInfoList: res.data.data.ProjectPracticeInfoList,
      total: res.data.data.count,
    };
    ans.ProjectPracticeInfoList.forEach((item) => {
      item.selectTime =
        formatDate(item.selectStime) + "~" + formatDate(item.selectEtime);
      item.titleTime =
        formatDate(item.titleStime) + "~" + formatDate(item.titleEtime);
    });
    return ans;
  } catch (error) {
    console.error("Error fetching user data:", error);
    //返回登录页
    return error.message;
  }
};
//删除实践课程
export const DeleteCourseData = async (e) => {
  try {
    // 定义要发送的数据
    const data = {
      projectpracticeCode: e,
      // ...其他需要的数据字段
    };
    // 发起 POST 请求
    const response = await fetch("/api/admin/deletebatchprojectpractice", {
      method: "DELETE", // 指定请求方法为 POST
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
    const res = await response.json();
    console.log(res); // 输出获取到的数据

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
//新建实践课程
export const createCourse = async (e) => {
  try {
    let res = await axios.post("/api/admin/createprojectpractice", 
       {
        projectpracticeName: e.projectpracticeName,
        majorName: e.majorName,
        majorCode: e.majorCode,
        selectStime: e.selectStime,
        selectEtime: e.selectEtime,
        titleStime: e.titleStime,
        titleEtime: e.titleEtime,
        grade: e.grade,
        status: e.status,
      },{
      headers: {
        Authorization: localStorage.getItem("vuems_token"),
      },
    });
    
    return res.data;
  } catch (error) {
    console.error("Error fetching user data:", error.message);
    //返回登录页
    return error.message;
  }
};
//修改实践课程
export const updateCourse = async (e) => {
  console.log(e,'dsads');
  
  try {
    let res = await axios.post("/api/admin/updateprojectpractice", 
       {
        projectpracticeName: e.projectpracticeName,
        projectpracticeCode: e.projectpracticeCode,
        majorName: e.majorName,
        majorCode: e.majorCode,
        selectStime: e.selectStime,
        selectEtime: e.selectEtime,
        titleStime: e.titleStime,
        titleEtime: e.titleEtime,
        grade: e.grade,
        status: e.status,
      },{
      headers: {
        Authorization: localStorage.getItem("vuems_token"),
      },
    });
    
    return res.data;
  } catch (error) {
    console.error("Error fetching user data:", error.message);
    //返回登录页
    return error.message;
  }
};
