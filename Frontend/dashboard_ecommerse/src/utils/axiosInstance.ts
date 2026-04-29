import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8386/api',
  timeout: 60000, // Tăng timeout lên 60s để chờ server Render free-tier khởi động
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
