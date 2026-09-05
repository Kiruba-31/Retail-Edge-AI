import axios from 'axios';

const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL || 'http://localhost:5000/api';
const STORE_API_KEY = import.meta.env?.VITE_STORE_API_KEY || 'retail_edge_sec_9948201a8f93e2b109c4d87';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': STORE_API_KEY, // Always attached
  },
  timeout: 10000,
});

// Request Interceptor: Attach JWT Token if user is logged in
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('retailedge_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle global errors like expired token (401)
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login if session expires
      localStorage.removeItem('retailedge_token');
      localStorage.removeItem('retailedge_user');
      window.location.reload();
    }
    return Promise.reject(error.response?.data || error.message);
  }
);

export default apiClient;
