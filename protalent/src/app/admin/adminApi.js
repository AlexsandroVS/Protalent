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

// Funciones específicas para el admin
export const adminApiService = {
  // Dashboard
  getDashboardStats: () => adminApi.get('/api/admin/dashboard/stats'),

  // Usuarios
  getUsuarios: (params = {}) => adminApi.get('/api/admin/usuarios', { params }),
  getUsuariosStats: () => adminApi.get('/api/admin/usuarios/stats'),
  createAdmin: (data) => adminApi.post('/api/admin/usuarios/admin', data),
  updateUsuario: (id, data) => adminApi.put(`/api/admin/usuarios/${id}`, data),
  deleteUsuario: (id) => adminApi.delete(`/api/admin/usuarios/${id}`),
  exportUsuarios: (params = {}) => adminApi.get('/api/admin/usuarios/export', { 
    params,
    responseType: 'blob' // Para descargar archivos
  }),

  // Listas administrativas
  getEmpresas: () => adminApi.get('/api/admin/listas/empresas'),
  getOfertas: () => adminApi.get('/api/admin/listas/ofertas'),
  getPostulaciones: () => adminApi.get('/api/admin/listas/postulaciones'),

  // Categorías CRUD
  getCategorias: () => adminApi.get('/api/admin/categorias'),
  getCategoriaById: (id) => adminApi.get(`/api/admin/categorias/${id}`),
  createCategoria: (data) => adminApi.post('/api/admin/categorias', data),
  updateCategoria: (id, data) => adminApi.put(`/api/admin/categorias/${id}`, data),
  deleteCategoria: (id) => adminApi.delete(`/api/admin/categorias/${id}`),

  // Blog Posts CRUD
  getBlogPosts: (params = {}) => adminApi.get('/api/admin/blog-posts', { params }),
  getBlogPostById: (id) => adminApi.get(`/api/admin/blog-posts/${id}`),
  createBlogPost: (data) => {
    const formData = new FormData();
    
    // Agregar campos de texto
    formData.append('titulo', data.titulo);
    formData.append('contenido', data.contenido);
    if (data.categoriaId) {
      formData.append('categoriaId', data.categoriaId);
    }
    
    // Agregar imagen si existe
    if (data.imagenPortada) {
      formData.append('imagenPortada', data.imagenPortada);
    }
    
    return adminApi.post('/api/admin/blog-posts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  updateBlogPost: (id, data) => {
    const formData = new FormData();
    
    // Agregar campos de texto
    formData.append('titulo', data.titulo);
    formData.append('contenido', data.contenido);
    if (data.categoriaId) {
      formData.append('categoriaId', data.categoriaId);
    }
    
    // Agregar imagen si existe
    if (data.imagenPortada) {
      formData.append('imagenPortada', data.imagenPortada);
    }
    
    return adminApi.put(`/api/admin/blog-posts/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  deleteBlogPost: (id) => adminApi.delete(`/api/admin/blog-posts/${id}`),
  getBlogPostStats: () => adminApi.get('/api/admin/blog-posts/stats'),

  // Comentarios CRUD (solo lectura y eliminación)
  getComentarios: (params = {}) => adminApi.get('/api/admin/comentarios', { params }),
  getComentarioById: (id) => adminApi.get(`/api/admin/comentarios/${id}`),
  deleteComentario: (id) => adminApi.delete(`/api/admin/comentarios/${id}`),
  getComentarioStats: () => adminApi.get('/api/admin/comentarios/stats')
};
