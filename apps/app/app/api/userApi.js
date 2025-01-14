import axios from "axios";

const userApis = {
  verifyUser: async (userId) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/verify', {
        id: userId
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error verifying user:', error);
      throw error;
    }
  },

  uploadImage: async (data) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/upload', data);
      return response.data;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }
}

export default userApis;