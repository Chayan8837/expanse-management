import axios from 'axios';

// Optional: Set a base URL if your API is hosted on a different domain or port
// axios.defaults.baseURL = 'https://your-api-domain.com';

const expenseApis = {
    getExpenses: async (userId) => {
        try {
            const response = await axios.get(`/api/expenses/${userId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching expenses:', error);
            throw error;
        }
    },
    addExpense: async (formData) => {
        try {
            const response = await axios.post('http://localhost:5000/api/expenses', formData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error adding expense:', error);
            throw error;
        }
    }
};

export default expenseApis;
