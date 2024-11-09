import axios from "axios";
import request from "../utils/request";

export const fetchData = () => {
  return request({
    url: "./mock/table.json",
    method: "get",
  });
};
//./mock/user.json
export const fetchUserData = async (e, n,p) => {
  console.log("fetchUserData", e, "fffff", n);
  try {
    let response = await axios.get("/api/sadmin/getmeetingroombypage", {
      params: {
        page: e,
        size: 10,
        // room_id:'',
        name: n,
        // capacity:'',
        // start_time:'',
        // end_time:'',
        reverse : p,
      },
      headers: {
        Authorization: localStorage.getItem("vuems_token"),
      },
    });
    console.log(response.data);
    let ans = response.data.data.meeting_rooms;
    ans.forEach((element) => {
      element.time =null;
      if (element.status == 1) {
        element.status = '不可预约';
      } else {
        element.status = '正常';
      }
    });
    ans = {
      total: response.data.data.total,
      list: ans,
    };
    return ans;
  } catch (error) {
    console.error("Error fetching user data:", error.message);
    //返回登录页
    return error.message;
  }
};

export const DeleteData = async (e) => {
  
  try {
    // 定义要发送的数据
    const data = {
      Ids: e,
      // ...其他需要的数据字段
    };
    // 发起 POST 请求
    const response = await fetch("/api/sadmin/delmeetingroom", {
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
    const result = await response.json();
    console.log(result); // 输出获取到的数据

    // 处理 result 数据
    // ...
    return result;
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
    return error;
  }
};

export const fetchUserData2 = async (e, n,m,p) => {
  //console.log("fetchUserData2", e, "fffff", n);
  try {
    let response = await axios.get("/api/sadmin/getuserbypage", {
      params: {
        page: e,
        size: 10,
        // room_id:'',
        sno: n,
        name:m,
        // capacity:'',
        // start_time:'',
        // end_time:'',
        reverse : p,
      },
      headers: {
        Authorization: localStorage.getItem("vuems_token"),
      },
    });
    console.log(response.data.data.users);
    let ans = response.data.data.users;
    ans.forEach((element) => {
      if( element.role =='user'){
        element.role = '教师';
      }
      else{
        element.role = '管理员';
      }
      if (element.status ==1) {
        element.status = '正常';
      } else {
        element.status = '禁用';
      }
    });
    ans = {
      total: response.data.data.total,
      list: ans,
    };
    return ans;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return error.message;
  }
};

export const DeleteData2 = async (e) => {
  try {
    // 定义要发送的数据
    const data = {
      ids: e,
      // ...其他需要的数据字段
    };
    // 发起 POST 请求
    const response = await fetch("/api/sadmin/deleteuser", {
      method: "DELETE", // 指定请求方法为 POST
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
    return result;
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
    return error;
  }
};

export const fetchUserData3 = async (e, n,p) => {
  console.log("fetchUserData3", e, "fffff", n);
  if(n.length0){n+=' 00:00:00'}
  try {
    let response = await axios.get("/api/sadmin/getappointmentrecordbypage", {
      params: {
        page: e,
        size: 10,
        appointmentPerson:n,
        // room_id:'',
        // appointmentDate: '2024-11-06 00:00:00',
        // capacity:'',
        // start_time:'',
        // end_time:'',
        reverse:p
      },
      headers: {
        Authorization: localStorage.getItem("vuems_token"),
      },
    });
    console.log(response.data.data);
    let ans = response.data.data.appointmentrecords;
    ans.forEach((element) => {
      element.time = null;
      //var date = new Date(element.appointmentDate);
      var dateStr = element.appointmentDate.substring(0, 10);
      element.appointmentDate = dateStr
      if (element.status == 0) {
        element.status = '可预约';
      } else if(element.status == 1){
        element.status = '已预约';
      }
      else if(element.status == 2){
        element.status = '已取消';
      }
      else if(element.status == 3){
        element.status = '不可预约';
        
      }
    });
    ans = {
      total: response.data.data.total,
      list: ans,
    };
    return ans;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return error.message;
  }
};

export const DeleteData3 = async (e) => {
  try {
    // 定义要发送的数据
    const data = {
      ids: e,
      // ...其他需要的数据字段
    };
    // 发起 POST 请求
    const response = await fetch("/api/sadmin/delappointmentrecord", {
      method: "DELETE", // 指定请求方法为 POST
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
    return result;
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
    return error;
  }
};
