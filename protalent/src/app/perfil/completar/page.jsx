'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/auth/AuthContext';
import CompleteProfileForm from '@/app/components/auth/CompleteProfileForm';

export default function CompleteProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Si el usuario no está autenticado o ya completó su perfil, redirigir
    if (!loading) {
      if (!user) {
        router.push('/auth/login');
      } else if (user.perfilCompleto) {
        router.push('/dashboard');
      } else {
        setIsLoading(false);
      }
    }
  }, [user, loading, router]);

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Completa tu perfil
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Necesitamos algunos datos adicionales para continuar.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <CompleteProfileForm 
            user={user}
            onComplete={(updatedUser) => {
              // Esta función se llamará cuando el perfil se complete exitosamente
              // El componente ya maneja la redirección
              console.log('Perfil actualizado:', updatedUser);
            }}
          />
        </div>
      </div>
    </div>
  );
}
