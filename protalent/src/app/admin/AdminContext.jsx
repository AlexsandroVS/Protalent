'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import adminApi from './adminApi';

const AdminContext = createContext();

export function AdminProvider({ children }) {
  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAdminAuth = async () => {
      const adminToken = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
      
      if (adminToken && adminToken !== 'null' && adminToken !== 'undefined') {
        try {
          // Verificar token con la API real
          const { data } = await adminApi.get('/admin/auth/verify');
          
          if (data.user && data.user.rol === 'admin') {
            setAdminUser(data.user);
          } else {
            // No es admin, limpiar token
            localStorage.removeItem('adminToken');
            setAdminUser(null);
          }
        } catch (error) {
          console.error('Error al verificar admin:', error);
          localStorage.removeItem('adminToken');
          setAdminUser(null);
        }
      } else {
        setAdminUser(null);
      }
      
      setLoading(false);
    };

    checkAdminAuth();
  }, []);

  const login = async (email, password) => {
    try {
      // Llamar a la API real de admin login
      const { data } = await adminApi.post('/admin/auth/login', { 
        email, 
        password 
      });
      
      if (data.user.rol !== 'admin') {
        throw new Error('Acceso no autorizado - Solo administradores');
      }

      localStorage.setItem('adminToken', data.token);
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

  const logout = () => {
    localStorage.removeItem('adminToken');
    setAdminUser(null);
    router.push('/admin/login');
  };

  const isAuthenticated = () => {
    return !!adminUser;
  };

  return (
    <AdminContext.Provider value={{
      adminUser,
      loading,
      login,
      logout,
      isAuthenticated: isAuthenticated()
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin debe ser usado dentro de AdminProvider');
  }
  return context;
}
