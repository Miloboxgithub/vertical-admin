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

export const fetchRoleData = () => {
    return request({
        url: './mock/role.json',
        method: 'get'
    });
};
