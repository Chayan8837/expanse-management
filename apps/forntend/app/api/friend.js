import axios from "axios";

const friendsApi = {
    getFriends: async (userId) => {
        try {
            const url = `http://localhost:5000/api/friend/${userId}`
            const response = await axios.get(url);
            return await response.data;

        } catch (error) {
            console.error('Error fetching friends:', error);
            return null;
        }
    },
    addFriendRequest: async (data) => {
        try {
            const response = await axios.post("http://localhost:5000/api/friend/addfriend",data);
                    console.log(response.data);
        } catch (error) {
            console.error('Error adding friend:', error.response.data);
            throw error;
        }
    },

    getRequests: async(userId)=>{
        try{
        const response = await axios.get(`http://localhost:5000/api/friend/requests/${userId}`);
        console.log(response.data);
        return await response.data;
        }
        catch(err){

        }



    },
    acceptRequest: async(data)=>{
        const response = await axios.post("http://localhost:5000/api/friend/acceptrequest",data);
        console.log(response.data);
    }
};

export default friendsApi;






// const axios = require('axios')

// const fetch = async () => {
//     const response = await axios.post("http://localhost:5000/api/friend/addfriend", {

//         "userId": "67266176c2a856b3a6b54da7",
//         "friendId": "67265dc10c64a8c78b909b8b"


//     });
//     console.log(
//      response.data);
// }

// fetch();

