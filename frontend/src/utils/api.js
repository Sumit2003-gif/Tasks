import axios from 'axios';

// 1. Axios Instance Create Karein
const api = axios.create({
    baseURL: 'http://localhost:5000/api', // Aapka Backend URL
    headers: {
        'Content-Type': 'application/json'
    }
});

// 2. Request Interceptor: Har call se pehle token add karega
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['x-auth-token'] = token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 3. Response Interceptor: Global Error Handling (e.g. Token expire hone par)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Agar token invalid hai toh logout karwa do
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;