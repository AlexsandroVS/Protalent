'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import api from '../../lib/axios';

const AdminAuthContext = createContext();

export function AdminAuthProvider({ children }) {
  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAdminAuth = async () => {
      const adminToken = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
      
      if (adminToken && adminToken !== 'null' && adminToken !== 'undefined') {
        // Configurar header específico para admin
        api.defaults.headers.common['X-Admin-Authorization'] = `Bearer ${adminToken}`;
        
        try {
          // Endpoint específico para verificar admin
          const { data } = await api.get('/api/admin/auth/verify');
          if (data.user && data.user.rol === 'admin') {
            setAdminUser(data.user);
          } else {
            // Si no es admin, limpiar token
            localStorage.removeItem('adminToken');
            delete api.defaults.headers.common['X-Admin-Authorization'];
            setAdminUser(null);
          }
        } catch (error) {
          console.error('Error al verificar admin:', error);
          localStorage.removeItem('adminToken');
          delete api.defaults.headers.common['X-Admin-Authorization'];
          setAdminUser(null);
        }
      } else {
        delete api.defaults.headers.common['X-Admin-Authorization'];
        setAdminUser(null);
      }
      
      setLoading(false);
    };

    initializeAdminAuth();
  }, []);

  const adminLogin = async (email, password) => {
    try {
      // Endpoint específico para login de admin
      const { data } = await api.post('/api/admin/auth/login', { email, password });
      
      if (data.user.rol !== 'admin') {
        throw new Error('Acceso no autorizado - Solo administradores');
      }

      localStorage.setItem('adminToken', data.token);
      api.defaults.headers.common['X-Admin-Authorization'] = `Bearer ${data.token}`;
      setAdminUser(data.user);
      
      return { success: true, user: data.user };
    } catch (error) {
      console.error('Error en admin login:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || 'Error al iniciar sesión como administrador' 
      };
    }
  };

  const adminLogout = () => {
    localStorage.removeItem('adminToken');
    delete api.defaults.headers.common['X-Admin-Authorization'];
    setAdminUser(null);
    
    // Redireccionar al login de admin
    if (typeof window !== 'undefined') {
      window.location.href = '/admin/login';
    }
  };

  const isAdmin = () => {
    return adminUser && adminUser.rol === 'admin';
  };

  const value = {
    adminUser,
    loading,
    adminLogin,
    adminLogout,
    isAdmin: isAdmin()
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth debe ser usado dentro de AdminAuthProvider');
  }
  return context;
}
