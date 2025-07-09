'use client';

import Image from 'next/image';
import { FiEdit2, FiUser } from 'react-icons/fi';
import { useAuth } from '@/app/context/auth/AuthContext';
import SidebarMenu, { defaultMenuItems } from '../SidebarMenu';
import SidebarGroups, { defaultGroups } from '../SidebarGroups';
import SidebarShortcuts, { defaultShortcuts } from '../SidebarShortcuts';
import { useState, useEffect } from 'react';
import axios from 'axios';

interface UserProfile {
  id: number;
  nombre: string;
  email: string;
  rol: string;
  foto_perfil?: string;
}

const Sidebar = () => {
  const { user: authUser, loading: authLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        // Usar el usuario del contexto de autenticación si está disponible
        if (authUser) {
          console.log('Using user from auth context:', authUser);
          setUser({
            id: authUser.id,
            nombre: authUser.nombre || 'Usuario',
            email: authUser.email || '',
            rol: authUser.rol || 'usuario',
            foto_perfil: authUser.foto_perfil
          });
          setLoading(false);
          return;
        }

        // Si no hay usuario en el contexto, intentar obtener el token
        const token = localStorage.getItem('token');
        if (!token) {
          console.log('No token found in localStorage');
          setError('No hay sesión activa');
          setLoading(false);
          return;
        }

        console.log('Making API request to /api/auth/perfil');
        const response = await axios.get('http://localhost:5000/api/auth/perfil', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        console.log('API Response:', response.data);
        if (response.data && response.data.usuario) {
          setUser(response.data.usuario);
        }
        
        // Check the actual response structure
        if (response.data) {
          // Try different possible response structures
          const userData = response.data.user || response.data;
          console.log('Setting user data:', userData);
          setUser(userData);
        } else {
          console.log('No user data in response');
          setError('No se encontraron datos del usuario');
        }
      } catch (err) {
        console.error('Error al cargar el perfil:', err);
        setError('Error al cargar el perfil del usuario');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  // Debug current state
  useEffect(() => {
    console.log('Current user state:', user);
    console.log('Current loading state:', loading);
    console.log('Current error state:', error);
  }, [user, loading, error]);

  const handleProfileEdit = () => {
    setIsEditing(true);
    console.log('Editar perfil');
  };

  const handleAddGroup = () => {
    console.log('Añadir nuevo grupo');
  };

  // Si está cargando, muestra un esqueleto de carga
  if (loading || authLoading) {
    return (
      <div className="w-64 bg-white border-r border-gray-200 h-screen overflow-y-auto p-4">
        <div className="animate-pulse space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Si hay un error al cargar el perfil
  if (error) {
    return (
      <div className="w-64 bg-white border-r border-gray-200 h-screen overflow-y-auto p-4">
        <div className="text-red-500 text-sm p-2 bg-red-50 rounded">
          {error}
        </div>
      </div>
    );
  }

  // Si no hay usuario autenticado
  if (!user) {
    return (
      <div className="w-64 bg-white border-r border-gray-200 h-screen overflow-y-auto p-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse"></div>
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
          </div>
        </div>
        {error && (
          <div className="mt-4 text-red-500 text-sm p-2 bg-red-50 rounded">
            {error}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen overflow-y-auto">
      {/* Perfil */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center space-x-4">
          {user?.foto_perfil ? (
            <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-blue-100 flex-shrink-0">
              <Image 
                src={user.foto_perfil.startsWith('http') ? user.foto_perfil : `data:image/jpeg;base64,${user.foto_perfil}`} 
                alt={user.nombre || 'Usuario'} 
                width={48}
                height={48}
                className="object-cover w-full h-full"
                style={{ width: '100%', height: 'auto' }}
                priority
              />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
              {user?.nombre?.[0]?.toUpperCase() || <FiUser size={20} />}
            </div>
          )}
          <div className="min-w-0">
            <h2 className="font-semibold text-gray-800 truncate">
              {user?.nombre || 'Usuario'}
            </h2>
            {user?.email && (
              <p className="text-xs text-gray-500 truncate">
                {user.email}
              </p>
            )}
          </div>
          <button 
            className="ml-auto text-gray-500 hover:text-blue-600 transition-colors"
            onClick={handleProfileEdit}
            aria-label="Editar perfil"
          >
            <FiEdit2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Menú de navegación */}
      <SidebarMenu 
        title="Menu" 
        items={defaultMenuItems} 
        className="mt-4" 
      />

      {/* Grupos */}
      <SidebarGroups 
        title="My Groups" 
        groups={defaultGroups} 
        onAddGroup={handleAddGroup}
        className="mt-4" 
      />

      {/* Atajos */}
      <SidebarShortcuts 
        title="Quick Access" 
        shortcuts={defaultShortcuts} 
        className="mt-4" 
      />
    </div>
  );
};

export default Sidebar;
