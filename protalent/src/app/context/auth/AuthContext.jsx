'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Ahora usaremos useRouter
import api from '../../lib/axios';


const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter(); // Inicializar useRouter

  useEffect(() => {
    let isMounted = true; // Para evitar actualizaciones de estado en un componente desmontado
    // console.log("[AuthContext] useEffect ejecutándose");

    const initializeAuth = async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      // console.log("[AuthContext] Token obtenido de localStorage:", token);

      if (token && token !== 'null' && token !== 'undefined') {
        // console.log("[AuthContext] Configurando token en Axios headers:", token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        // console.log("[AuthContext] No hay token válido en localStorage, eliminando header de Axios.");
      delete api.defaults.headers.common['Authorization'];
    }

      if (!api.defaults.headers.common['Authorization']) {
        // console.log("[AuthContext] No hay cabecera de autorización, estableciendo user a null.");
        if (isMounted) {
            setUser(null);
            setLoading(false);
        }
        return;
      }

      // console.log("[AuthContext] Hay cabecera de autorización, intentando cargar perfil.");
      try {
        const { data } = await api.get('/api/auth/perfil');
        // console.log("[AuthContext] Perfil recibido:", data);
        if (isMounted) setUser(data.user);
      } catch (error) {
        // console.error("[AuthContext] Error al cargar perfil:", error.response?.status, error.message);
        if (isMounted) setUser(null); // Importante: si falla la carga del perfil, el usuario es null
        // Si el error es 401 o 403, podría ser útil limpiar el token de localStorage aquí también por si acaso
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          localStorage.removeItem('token');
          delete api.defaults.headers.common['Authorization'];
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    initializeAuth();
    
    return () => {
        isMounted = false;
    };
  }, []); // Se ejecuta solo una vez cuando AuthProvider se monta

  const login = async (email, password) => {
    setLoading(true);
    try {
    const { data } = await api.post('/api/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      // Después de configurar el token y header, el user se cargará mediante el efecto de un nuevo AuthProvider o una recarga
      // O podemos setearlo directamente aquí y luego redirigir
      setUser(data.user); 
      setLoading(false); // Establecer loading false después de un login exitoso y antes de redirigir
    router.push('/dashboard'); // Usar router.push en lugar de window.location.href
    } catch (error) {
      console.error("[AuthContext] Error en login:", error.response?.data || error.message);
      localStorage.removeItem('token'); // Limpiar token si el login falla
      delete api.defaults.headers.common['Authorization'];
      setUser(null);
      setLoading(false);
      throw error;
    }
  };

  const register = async (userData) => {
    // ... (similar a login si el registro también loguea al usuario)
    // Por ahora, asumamos que después de registrar, el usuario debe loguearse por separado
    setLoading(true);
    try {
      const response = await api.post('/api/auth/register', userData);
      // console.log("[AuthContext] Registro exitoso:", response.data);

      // Si el registro devuelve un token (como en tu documentación), podemos loguear directamente
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        setUser(response.data.usuario);
        setLoading(false);
        router.push('/dashboard');
      } else {
        // Si no devuelve token, redirigir al login para que el usuario inicie sesión
        setUser(null); 
        setLoading(false);
        router.push('/auth/login?status=registered');
      }
    } catch (error) {
      console.error("[AuthContext] Error en register:", error.response?.data || error.message);
      setUser(null);
      setLoading(false);
      throw error;
    }
  };

  const loginWithGoogle = async (idToken) => {
    setLoading(true);
    try {
      const { data } = await api.post('/api/auth/google', { idToken });
      localStorage.setItem('token', data.token);
      api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      setUser(data.usuario);
      setLoading(false);

      if (data.requiereCompletarPerfil) {
        // Redirigir a una página para completar el perfil, posiblemente pasando el rol o tipo requerido
        router.push('/auth/complete-profile'); 
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error("[AuthContext] Error en loginWithGoogle:", error.response?.data || error.message);
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
      setUser(null);
      setLoading(false);
      throw error;
    }
  };

  const registerWithGoogle = async (idToken) => {
    setLoading(true);
    try {
      // Asumimos que el endpoint /api/auth/google manejará tanto login como registro
      const { data } = await api.post('/api/auth/google', { idToken });
      localStorage.setItem('token', data.token);
      api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      setUser(data.usuario);
      setLoading(false);

      if (data.requiereCompletarPerfil) {
        router.push('/auth/complete-profile'); 
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error("[AuthContext] Error en registerWithGoogle:", error.response?.data || error.message);
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
      setUser(null);
      setLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    // console.log("[AuthContext] Ejecutando logout...");
    try {
      // La llamada al backend es opcional y para invalidar el token del lado del servidor si existe tal lógica
    await api.post('/api/auth/logout');
    } catch (error) {
      // console.error("[AuthContext] Error en llamada a /api/auth/logout (no crítico):");
    }
    
    // Limpieza del lado del cliente (esto es lo crucial)
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null); 
    setLoading(false); // Asegurar que loading sea false para que AuthNavbar reaccione correctamente
    
    // console.log("[AuthContext] Token eliminado, usuario seteado a null. Redirigiendo...");
    router.push('/auth/login'); // Forzar recarga de página a login
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, loginWithGoogle, registerWithGoogle }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);