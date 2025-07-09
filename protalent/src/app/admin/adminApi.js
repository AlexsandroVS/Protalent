import axios from 'axios';

const adminApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  withCredentials: true
});

// Interceptor para incluir el token de admin en las requests
adminApi.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const adminToken = localStorage.getItem('adminToken');
    if (adminToken) {
      config.headers['X-Admin-Authorization'] = `Bearer ${adminToken}`;
    }
  }
  return config;
});

// Interceptor para manejar errores de autenticación
adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Token inválido, limpiar localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('adminToken');
        // Recargar la página para mostrar el login
        window.location.reload();
      }
    }
    return Promise.reject(error);
  }
);

export default adminApi;
