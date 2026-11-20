import axios from 'axios';

// Configured Axios client with base URL and interceptors
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    const userStr = localStorage.getItem('classify_user');
    const token = localStorage.getItem('classify_token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else if (userStr) {
      try {
        const parsed = JSON.parse(userStr);
        if (parsed?.token) {
          config.headers.Authorization = `Bearer ${parsed.token}`;
        }
      } catch {
        // fallback
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'Something went wrong. Please check if the backend server is running.';
    return Promise.reject(new Error(message));
  }
);

export default api;
