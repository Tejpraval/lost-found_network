import axios from 'axios';

let rawBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

// Automatically append API version suffix if omitted in production env config
if (rawBaseUrl && !rawBaseUrl.endsWith('/api/v1') && !rawBaseUrl.endsWith('/api/v1/')) {
  rawBaseUrl = rawBaseUrl.replace(/\/$/, '') + '/api/v1';
}

const api = axios.create({
  baseURL: rawBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Catch Token Expirations
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      // Redirect to login if path is not guest accessible
      const path = window.location.pathname;
      if (!path.includes('/login') && !path.includes('/register') && path !== '/') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
