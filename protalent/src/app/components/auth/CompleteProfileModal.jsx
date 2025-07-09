'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Esquema de validación basado en el rol
const profileSchema = (rol) => {
  const baseSchema = {
    telefono: z.string().min(8, 'El teléfono debe tener al menos 8 caracteres').optional(),
    direccion: z.string().min(5, 'La dirección es muy corta').optional(),
  };

  if (rol === 'estudiante' || rol === 'egresado') {
    return z.object({
      ...baseSchema,
      carrera: z.string().min(3, 'La carrera es obligatoria'),
      universidad: z.string().min(3, 'La universidad es obligatoria'),
      ...(rol === 'estudiante' && {
        anioIngreso: z.string().min(4, 'Año de ingreso inválido'),
      }),
      ...(rol === 'egresado' && {
        anioEgreso: z.string().min(4, 'Año de egreso inválido'),
        titulo: z.string().min(3, 'El título es obligatorio'),
      }),
    });
  }

  if (rol === 'empresa') {
    return z.object({
      ...baseSchema,
      nombreEmpresa: z.string().min(3, 'El nombre de la empresa es obligatorio'),
      ruc: z.string().min(9, 'El RUC debe tener al menos 9 caracteres'),
      rubro: z.string().min(3, 'El rubro es obligatorio'),
      descripcion: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
    });
  }

  return z.object(baseSchema);
};

export default function CompleteProfileModal({ user, onComplete }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  console.log('=== CompleteProfileModal ===');
  console.log('Usuario recibido:', user);
  console.log('Tipo de onComplete:', typeof onComplete);
  
  if (!user) {
    console.log('No hay usuario, no se renderiza el modal');
    return null;
  }
  
  // Verificar que el usuario tenga un rol válido
  if (!user.rol || !['estudiante', 'egresado', 'empresa'].includes(user.rol)) {
    console.error('Rol de usuario no válido:', user.rol);
    return null;
  }
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(profileSchema(user?.rol)),
    defaultValues: {
      nombre: user?.nombre || '',
      email: user?.email || '',
      telefono: '',
      direccion: '',
      ...(user?.rol === 'estudiante' && {
        carrera: '',
        universidad: '',
        anioIngreso: ''
      }),
      ...(user?.rol === 'egresado' && {
        carrera: '',
        universidad: '',
        anioEgreso: '',
        titulo: ''
      }),
      ...(user?.rol === 'empresa' && {
        nombreEmpresa: '',
        ruc: '',
        rubro: '',
        descripcion: ''
      })
    }
  });

  const onSubmit = async (formData) => {
    console.log('Enviando datos del formulario:', formData);
    setIsSubmitting(true);
    setError('');
    
    try {
      console.log('Enviando solicitud a /api/auth/complete-profile...');
      const response = await fetch('/api/auth/complete-profile', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ 
          ...formData, 
          userId: user.id,
          rol: user.rol // Asegurarse de enviar el rol
        })
      });

      const result = await response.json();
      console.log('Respuesta del servidor:', result);
      
      if (!response.ok) {
        const errorMsg = result.message || 'Error al actualizar el perfil';
        console.error('Error en la respuesta del servidor:', errorMsg);
        throw new Error(errorMsg);
      }

      console.log('Perfil actualizado correctamente, llamando a onComplete...');
      // Llamar a onComplete con los datos actualizados del usuario
      onComplete({
        ...user,
        ...formData,
        perfilCompleto: true
      });
      
      // No es necesario hacer router.push aquí ya que onComplete manejará la redirección
    } catch (err) {
      console.error('Error al completar perfil:', err);
      setError(err.message || 'Error al actualizar el perfil. Por favor, inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Completa tu perfil</h2>
        <p className="text-gray-600 mb-6">Necesitamos algunos datos adicionales para continuar.</p>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Nombre</label>
            <input 
              type="text" 
              className="w-full p-2 border rounded" 
              value={user.nombre || ''} 
              disabled 
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Email</label>
            <input 
              type="email" 
              className="w-full p-2 border rounded" 
              value={user.email || ''} 
              disabled 
            />
          </div>

          {(user.rol === 'estudiante' || user.rol === 'egresado') && (
            <>
              <div>
                <label className="block text-gray-700 mb-2">Carrera</label>
                <input 
                  type="text" 
                  className={`w-full p-2 border rounded ${errors.carrera ? 'border-red-500' : ''}`}
                  {...register('carrera')} 
                />
                {errors.carrera && (
                  <p className="text-red-500 text-sm mt-1">{errors.carrera.message}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Universidad</label>
                <input 
                  type="text" 
                  className={`w-full p-2 border rounded ${errors.universidad ? 'border-red-500' : ''}`}
                  {...register('universidad')} 
                />
                {errors.universidad && (
                  <p className="text-red-500 text-sm mt-1">{errors.universidad.message}</p>
                )}
              </div>

              {user.rol === 'estudiante' && (
                <div>
                  <label className="block text-gray-700 mb-2">Año de ingreso</label>
                  <input 
                    type="number" 
                    min="2000" 
                    max={new Date().getFullYear()}
                    className={`w-full p-2 border rounded ${errors.anioIngreso ? 'border-red-500' : ''}`}
                    {...register('anioIngreso')} 
                  />
                  {errors.anioIngreso && (
                    <p className="text-red-500 text-sm mt-1">{errors.anioIngreso.message}</p>
                  )}
                </div>
              )}

              {user.rol === 'egresado' && (
                <>
                  <div>
                    <label className="block text-gray-700 mb-2">Año de egreso</label>
                    <input 
                      type="number" 
                      min="2000" 
                      max={new Date().getFullYear()}
                      className={`w-full p-2 border rounded ${errors.anioEgreso ? 'border-red-500' : ''}`}
                      {...register('anioEgreso')} 
                    />
                    {errors.anioEgreso && (
                      <p className="text-red-500 text-sm mt-1">{errors.anioEgreso.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">Título obtenido</label>
                    <input 
                      type="text" 
                      className={`w-full p-2 border rounded ${errors.titulo ? 'border-red-500' : ''}`}
                      {...register('titulo')} 
                    />
                    {errors.titulo && (
                      <p className="text-red-500 text-sm mt-1">{errors.titulo.message}</p>
                    )}
                  </div>
                </>
              )}
            </>
          )}

          {user.rol === 'empresa' && (
            <>
              <div>
                <label className="block text-gray-700 mb-2">Nombre de la empresa</label>
                <input 
                  type="text" 
                  className={`w-full p-2 border rounded ${errors.nombreEmpresa ? 'border-red-500' : ''}`}
                  {...register('nombreEmpresa')} 
                />
                {errors.nombreEmpresa && (
                  <p className="text-red-500 text-sm mt-1">{errors.nombreEmpresa.message}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 mb-2">RUC</label>
                <input 
                  type="text" 
                  className={`w-full p-2 border rounded ${errors.ruc ? 'border-red-500' : ''}`}
                  {...register('ruc')} 
                />
                {errors.ruc && (
                  <p className="text-red-500 text-sm mt-1">{errors.ruc.message}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Rubro</label>
                <input 
                  type="text" 
                  className={`w-full p-2 border rounded ${errors.rubro ? 'border-red-500' : ''}`}
                  {...register('rubro')} 
                />
                {errors.rubro && (
                  <p className="text-red-500 text-sm mt-1">{errors.rubro.message}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Descripción</label>
                <textarea 
                  className={`w-full p-2 border rounded ${errors.descripcion ? 'border-red-500' : ''}`}
                  rows="3"
                  {...register('descripcion')} 
                />
                {errors.descripcion && (
                  <p className="text-red-500 text-sm mt-1">{errors.descripcion.message}</p>
                )}
              </div>
            </>
          )}

          <div>
            <label className="block text-gray-700 mb-2">Teléfono</label>
            <input 
              type="tel" 
              className={`w-full p-2 border rounded ${errors.telefono ? 'border-red-500' : ''}`}
              {...register('telefono')} 
            />
            {errors.telefono && (
              <p className="text-red-500 text-sm mt-1">{errors.telefono.message}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Dirección</label>
            <input 
              type="text" 
              className={`w-full p-2 border rounded ${errors.direccion ? 'border-red-500' : ''}`}
              {...register('direccion')} 
            />
            {errors.direccion && (
              <p className="text-red-500 text-sm mt-1">{errors.direccion.message}</p>
            )}
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Guardando...' : 'Guardar perfil'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
