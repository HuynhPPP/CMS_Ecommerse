import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8386/api',
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
