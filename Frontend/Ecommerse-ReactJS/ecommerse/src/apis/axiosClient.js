import axios from 'axios';
import Cookies from 'js-cookie';

const axiosClient = axios.create({
  baseURL: 'https://be-project-reactjs.onrender.com/api/v1',
  timeout: 1000000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.request.use(
  async (config) => {
    const token = Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

axiosClient.interceptors.response.use(
  (res) => {
    return res;
  },
  async (err) => {
    const originalRequest = err.config;

    // Handle timeout errors
    if (err.code === 'ECONNABORTED') {
      return Promise.reject({
        ...err,
        message: 'Request timeout. Please check your connection and try again.',
        isTimeout: true,
      });
    }

    // Handle network errors (no response from server)
    if (!err.response) {
      return Promise.reject({
        ...err,
        message: 'Network error. Please check your internet connection.',
        isNetworkError: true,
      });
    }

    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = Cookies.get('refreshToken');

      if (!refreshToken) {
        // Clear all auth data if no refresh token
        Cookies.remove('token');
        Cookies.remove('refreshToken');
        Cookies.remove('userId');
        return Promise.reject(err);
      }

      try {
        const res = await axiosClient.post('/refresh-token', {
          token: refreshToken,
        });
        const newAccessToken = res.data.accessToken;

        // Save the new token to cookies
        Cookies.set('token', newAccessToken);

        // Update the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosClient(originalRequest);
      } catch (error) {
        // Clear all auth data on refresh failure
        Cookies.remove('token');
        Cookies.remove('refreshToken');
        Cookies.remove('userId');
        return Promise.reject(error);
      }
    }

    // Return rejected promise for all other errors
    return Promise.reject(err);
  }
);

export default axiosClient;
