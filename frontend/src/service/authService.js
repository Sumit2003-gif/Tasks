import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL + '/auth/';

const register = async (userData) => {
  const response = await axios.post(API_URL + 'register', userData);
  return response.data;
};

const login = async (userData) => {
  const response = await axios.post(API_URL + 'login', userData);
  console.log("Resposne",response)
  return response.data;
  

};
const updateProfile = async (userData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // Backend endpoint: /api/auth/update
  const response = await axios.put(API_URL + 'update', userData, config);
  return response.data;
};



const logout = () => {
  localStorage.removeItem('user');
};

const authService = {
  register,
  login,
  logout,
  updateProfile
};

export default authService;