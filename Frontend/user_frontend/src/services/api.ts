import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:8386',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;

      if (status === 401) {
        // Unauthorized - clear token and redirect to login
        localStorage.removeItem('token');
        // window.location.href = '/login';
      } else if (status === 404) {
        console.error('Resource not found:', data);
      } else if (status === 500) {
        console.error('Server error:', data);
      }
    } else if (error.request) {
      // Request made but no response
      console.error(
        'No response from server. Please check if the backend is running.'
      );
    } else {
      // Error in request setup
      console.error('Error setting up request:', error.message);
    }

    return Promise.reject(error);
  }
);

export default api;
