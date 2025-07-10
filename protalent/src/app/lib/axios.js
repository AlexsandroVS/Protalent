import axios from 'axios';

const api = axios.create({
  baseURL: 'http://3.238.218.119:5000',
  withCredentials: false
});

// Interceptor para agregar el token de autenticación
api.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;