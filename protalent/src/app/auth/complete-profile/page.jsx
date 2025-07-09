'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '../../context/auth/AuthContext';
import { FiMail, FiLock, FiUser, FiTag, FiBriefcase, FiCalendar, FiPhone } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthNavbar from '../../components/views/Navbar';
import dynamic from 'next/dynamic';

const DotGrid = dynamic(
  () => import('../../components/ui/DotGrid'),
  { ssr: false }
);

const studentAlumniCompleteProfileSchema = z.object({
  carrera: z.string().min(3, 'La carrera es obligatoria'),
  tipo: z.enum(['estudiante', 'egresado'], { message: 'El tipo es obligatorio' }),
  telefono: z.string().optional(),
  anio_egreso: z.number().int().min(1900, 'Año de egreso inválido').max(new Date().getFullYear(), 'El año no puede ser en el futuro').optional()
}).refine(data => {
  if (data.tipo === 'egresado') {
    return data.anio_egreso !== undefined && data.anio_egreso !== null;
  }
  return true;
}, {
  message: 'El año de egreso es obligatorio para egresados',
  path: ['anio_egreso']
});

const companyCompleteProfileSchema = z.object({
  ruc: z.string().min(11, 'RUC debe tener 11 caracteres').max(11, 'RUC debe tener 11 caracteres'),
  nombre_empresa: z.string().min(3, 'El nombre de la empresa es obligatorio'),
  rubro: z.string().min(3, 'El rubro es obligatorio')
});

export default function CompleteProfilePage() {
  const { user, loading, loginWithGoogle, registerWithGoogle } = useAuth();
  const router = useRouter();
  const [selectedProfileType, setSelectedProfileType] = useState(null);

  useEffect(() => {
    if (!loading && (!user || user.perfilCompleto)) {
      // Si no está cargando y el usuario no existe o el perfil está completo, redirigir al dashboard
      router.push('/dashboard');
    } else if (!loading && user && !user.rol && user.tiposDisponibles) {
      // Si el usuario existe pero no tiene rol y se le ofrecieron tipos disponibles (nuevo usuario Google)
      setSelectedProfileType(user.tiposDisponibles[0]); // Seleccionar el primer tipo disponible por defecto
    } else if (!loading && user && !user.perfilCompleto && user.rol) {
      // Si el usuario tiene rol pero perfil incompleto
      setSelectedProfileType(user.rol);
    }
  }, [user, loading, router]);

  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    resolver: zodResolver(
      selectedProfileType === 'empresa' 
        ? companyCompleteProfileSchema 
        : studentAlumniCompleteProfileSchema
    )
  });

  const watchedTipo = watch('tipo');

  useEffect(() => {
    if (selectedProfileType !== 'empresa' && watchedTipo) {
      setSelectedProfileType(watchedTipo);
    }
  }, [watchedTipo, selectedProfileType]);

  const onSubmit = async (data) => {
    try {
      if (selectedProfileType === 'empresa') {
        await api.post('/api/auth/completar-perfil-empresa', data);
      } else if (selectedProfileType === 'estudiante' || selectedProfileType === 'egresado') {
        await api.post('/api/auth/completar-perfil-estudiante', { ...data, rol: data.tipo, anio_egreso: data.anio_egreso });
      }
      // Después de completar el perfil, forzar una recarga del contexto para obtener el usuario actualizado
      // Opcional: Podríamos re-llamar a initializeAuth o simplemente redirigir al dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error("Error al completar el perfil:", error.response?.data || error.message);
      // Mostrar un mensaje de error al usuario
    }
  };

  if (loading || (!user && !loading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#062056] to-black text-white">
        Cargando...
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-center items-center overflow-hidden bg-gradient-to-b from-[#062056] to-black">
      <AuthNavbar />
      <DotGrid
        dotSize={4}
        gap={16}
        baseColor="#062056"
        activeColor="#38bdf8"
        proximity={200}
        shockRadius={250}
        shockStrength={20}
        resistance={1200}
        returnDuration={2}
        className="fixed inset-0 z-0 opacity-30"
      />
      <main className="relative z-10 flex flex-col items-center justify-center w-full min-h-[calc(100vh-4rem)] px-4">
        <div className="backdrop-blur-xl bg-white/10 border border-[#38bdf8]/20 shadow-2xl rounded-3xl p-8 md:p-10 w-full max-w-xl mx-2">
          <h2 className="text-3xl font-bold text-center text-white mb-8">
            Completa tu Perfil
          </h2>

          {user && !user.rol && user.tiposDisponibles && (
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2 text-gray-300">Selecciona tu tipo de perfil</label>
              <div className="relative">
                <FiTag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <select
                  {...register('tipo')}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-[#38bdf8]/30 bg-white/10 text-white focus:outline-none focus:border-[#38bdf8] transition-colors"
                  defaultValue={selectedProfileType}
                  onChange={(e) => setSelectedProfileType(e.target.value)}
                >
                  {user.tiposDisponibles.map((typeOption) => (
                    <option key={typeOption} value={typeOption} className="bg-[#062056]">
                      {typeOption.charAt(0).toUpperCase() + typeOption.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            {(selectedProfileType === 'estudiante' || selectedProfileType === 'egresado') && (
              <>
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2 text-gray-300">Carrera</label>
                  <div className="relative">
                    <FiBriefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      {...register('carrera')}
                      className={`w-full pl-10 pr-4 py-3 rounded-lg border-2 bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-[#38bdf8] transition-colors ${
                        errors.carrera ? 'border-red-500' : 'border-[#38bdf8]/30'
                      }`}
                      placeholder="Ej: Ingeniería de Sistemas"
                    />
                  </div>
                  {errors.carrera && (
                    <p className="mt-1 text-sm text-red-400 animate-pulse">{errors.carrera.message}</p>
                  )}
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2 text-gray-300">Teléfono (opcional)</label>
                  <div className="relative">
                    <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      {...register('telefono')}
                      className={`w-full pl-10 pr-4 py-3 rounded-lg border-2 bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-[#38bdf8] transition-colors ${
                        errors.telefono ? 'border-red-500' : 'border-[#38bdf8]/30'
                      }`}
                      placeholder="Ej: +51987654321"
                    />
                  </div>
                  {errors.telefono && (
                    <p className="mt-1 text-sm text-red-400 animate-pulse">{errors.telefono.message}</p>
                  )}
                </div>

                {selectedProfileType === 'egresado' && (
                  <div className="mb-8">
                    <label className="block text-sm font-medium mb-2 text-gray-300">Año de Egreso</label>
                    <div className="relative">
                      <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        {...register('anio_egreso', { valueAsNumber: true })}
                        type="number"
                        className={`w-full pl-10 pr-4 py-3 rounded-lg border-2 bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-[#38bdf8] transition-colors ${
                          errors.anio_egreso ? 'border-red-500' : 'border-[#38bdf8]/30'
                        }`}
                        placeholder="Ej: 2023"
                      />
                    </div>
                    {errors.anio_egreso && (
                      <p className="mt-1 text-sm text-red-400 animate-pulse">{errors.anio_egreso.message}</p>
                    )}
                  </div>
                )}
              </>
            )}

            {selectedProfileType === 'empresa' && (
              <>
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2 text-gray-300">RUC</label>
                  <div className="relative">
                    <FiTag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      {...register('ruc')}
                      className={`w-full pl-10 pr-4 py-3 rounded-lg border-2 bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-[#38bdf8] transition-colors ${
                        errors.ruc ? 'border-red-500' : 'border-[#38bdf8]/30'
                      }`}
                      placeholder="Ej: 20123456789"
                    />
                  </div>
                  {errors.ruc && (
                    <p className="mt-1 text-sm text-red-400 animate-pulse">{errors.ruc.message}</p>
                  )}
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2 text-gray-300">Nombre de la Empresa</label>
                  <div className="relative">
                    <FiBriefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      {...register('nombre_empresa')}
                      className={`w-full pl-10 pr-4 py-3 rounded-lg border-2 bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-[#38bdf8] transition-colors ${
                        errors.nombre_empresa ? 'border-red-500' : 'border-[#38bdf8]/30'
                      }`}
                      placeholder="Ej: TechCorp SAC"
                    />
                  </div>
                  {errors.nombre_empresa && (
                    <p className="mt-1 text-sm text-red-400 animate-pulse">{errors.nombre_empresa.message}</p>
                  )}
                </div>

                <div className="mb-8">
                  <label className="block text-sm font-medium mb-2 text-gray-300">Rubro</label>
                  <div className="relative">
                    <FiTag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      {...register('rubro')}
                      className={`w-full pl-10 pr-4 py-3 rounded-lg border-2 bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-[#38bdf8] transition-colors ${
                        errors.rubro ? 'border-red-500' : 'border-[#38bdf8]/30'
                      }`}
                      placeholder="Ej: Tecnología y Software"
                    />
                  </div>
                  {errors.rubro && (
                    <p className="mt-1 text-sm text-red-400 animate-pulse">{errors.rubro.message}</p>
                  )}
                </div>
              </>
            )}

            <button
              type="submit"
              className="w-full bg-[#38bdf8] text-[#062056] py-3 px-4 rounded-lg font-semibold shadow-lg hover:bg-[#0ea5e9] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#38bdf8] focus:ring-opacity-50"
            >
              Completar Perfil
            </button>
          </form>
        </div>
      </main>
    </div>
  );
} 