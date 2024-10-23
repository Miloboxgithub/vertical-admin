import axios from 'axios';
import request from '../utils/request';

export const fetchData = () => {
    return request({
        url: './mock/table.json',
        method: 'get'
    });
};
//./mock/user.json
export const fetchUserData =  async (e,n) =>  {
    console.log('fetchUserData',e,'fffff',n);
    try {
        let response = await axios.get('/api/administrator/getmeetingroombypage', {
            params: {
                page: e,
                size: 10,
                // room_id:'',
                room_name:n,
                // capacity:'',
                // start_time:'',
                // end_time:'',
            }
        });
        console.log(response.data.data.meeting_rooms);
        let ans = response.data.data.meeting_rooms;
        ans.forEach(element => {
            element.time = element.startTime.substring(0, 5) + ' - ' + element.endTime.substring(0, 5);
            if(element.deletedAt==null){
                element.status = true 
            }
            else{
                element.status = false
            }
        });
        ans={
            total: response.data.data.total,
            list: ans
        }
        return ans 
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
    
};

export const DeleteData = async (e) => {
      
  try {
    // 定义要发送的数据
    const data = {
        RoomIds:e
        // ...其他需要的数据字段
    };
    // 发起 POST 请求
    const response = await fetch('/api/administrator/delmeetingroom', {
        method: 'DELETE', // 指定请求方法为 POST
        headers: {
            'Content-Type': 'application/json', // 设置请求头，告诉服务器发送的是 JSON 数据
            // 根据需要可能还需要添加其他头部信息，如认证令牌等
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
    return result
} catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    return error
}
};
