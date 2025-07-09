'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '../../context/auth/AuthContext';
import { FiMail, FiLock, FiUser, FiBriefcase, FiPhone, FiCalendar, FiTag } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import Link from 'next/link';
import { cn } from '../../../lib/utils';

const baseRegisterSchema = z.object({
  nombre: z.string().min(3, 'Mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
});

const studentAlumniSchema = baseRegisterSchema.extend({
  carrera: z.string().min(3, 'La carrera es obligatoria'),
  tipo: z.enum(['estudiante', 'egresado'], { message: 'El tipo es obligatorio' }),
  telefono: z.string().optional(),
  año_egreso: z.number().int().min(1900, 'Año de egreso inválido')
    .max(new Date().getFullYear(), 'El año no puede ser en el futuro')
    .optional()
}).refine(data => {
  if (data.tipo === 'egresado') {
    return data.año_egreso !== undefined && data.año_egreso !== null;
  }
  return true;
}, {
  message: 'El año de egreso es obligatorio para egresados',
  path: ['año_egreso']
});

const companySchema = baseRegisterSchema.extend({
  ruc: z.string().min(11, 'RUC debe tener 11 caracteres').max(11, 'RUC debe tener 11 caracteres'),
  nombreEmpresa: z.string().min(3, 'El nombre de la empresa es obligatorio'),
  rubro: z.string().min(3, 'El rubro es obligatorio')
});

export default function RegisterForm() {
  const [selectedRole, setSelectedRole] = useState('estudiante');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const { register: registerUser, registerWithGoogle } = useAuth();

  const getCurrentSchema = () => {
    if (selectedRole === 'empresa') {
      return companySchema;
    } else {
      return studentAlumniSchema;
    }
  };

  const { register, handleSubmit, formState: { errors, touchedFields, isSubmitted }, reset, clearErrors, setValue, watch, trigger } = useForm({
    resolver: zodResolver(getCurrentSchema()),
    defaultValues: { 
      nombre: '', 
      email: '', 
      password: '', 
      carrera: '', 
      tipo: 'estudiante',
      telefono: '', 
      año_egreso: null, 
      ruc: '', 
      nombreEmpresa: '', 
      rubro: '' 
    } 
  });

  // Actualizar el esquema cuando cambia el rol
  useEffect(() => {
    const defaultValues = {
      nombre: '',
      email: '',
      password: '',
      carrera: '',
      tipo: selectedRole === 'empresa' ? '' : selectedRole,
      telefono: '',
      año_egreso: null,
      ruc: '',
      nombreEmpresa: '',
      rubro: ''
    };
    
    // Si es estudiante, forzar el tipo a 'estudiante'
    if (selectedRole === 'estudiante') {
      defaultValues.tipo = 'estudiante';
    }
    
    reset(defaultValues);
    trigger(); // Disparar validación después de resetear
    clearErrors();
  }, [selectedRole, reset, clearErrors, trigger]);
  
  // Observar cambios en el tipo para forzar validación
  const currentTipo = watch('tipo');
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    if (selectedRole === 'estudiante' || selectedRole === 'egresado') {
      trigger('tipo');
    }
  }, [currentTipo, selectedRole, trigger]);

  // Función para verificar si se debe mostrar el error
  const shouldShowError = (fieldName) => {
    return (touchedFields[fieldName] || formSubmitted) && errors[fieldName];
  };

  const onSubmit = async (data) => {
    setSubmitError('');
    setFormSubmitted(true);
    setIsSubmitting(true);
    
    try {
      console.log('Datos del formulario:', data); // Para depuración
      
      // Determinar el rol real basado en el tipo seleccionado
      const userRole = (selectedRole === 'estudiante' || selectedRole === 'egresado') ? 
        (data.tipo || selectedRole) : selectedRole;
      
      let userData = {
        nombre: data.nombre,
        email: data.email,
        password: data.password,
        rol: userRole, // Usar el rol determinado
      };

      if (userRole === 'estudiante' || userRole === 'egresado') {
        userData = { 
          ...userData, 
          carrera: data.carrera, 
          tipo: userRole, // Usar el rol directamente
          telefono: data.telefono || null
        };
        
        if (userRole === 'egresado') {
          userData.año_egreso = data.año_egreso ? parseInt(data.año_egreso) : null;
        }
      } else if (userRole === 'empresa') {
        userData = { 
          ...userData, 
          ruc: data.ruc, 
          nombre_empresa: data.nombreEmpresa, 
          rubro: data.rubro 
        };
      }
      
      await registerUser(userData);
    } catch (error) {
      console.error('Error en el registro:', error);
      setSubmitError(error.response?.data?.error || 'Ocurrió un error al procesar el registro');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      await registerWithGoogle(credentialResponse.credential);
    } catch (error) {
      console.error('Error en registro con Google:', error);
      setSubmitError('Error al registrarse con Google');
    }
  };

  const handleGoogleError = () => {
    console.error('Google Register Falló');
    setSubmitError('Error al registrarse con Google');
  };

  const tipo = watch('tipo');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#38bdf8] to-[#3b82f6] mb-2">
            Únete a Protalent
          </h1>
          <p className="text-gray-300">Crea una cuenta para comenzar tu experiencia</p>
        </div>
        
        <form 
          onSubmit={handleSubmit(onSubmit)} 
          className="bg-white/5 border border-[#38bdf8]/20 rounded-2xl p-6 sm:p-8 shadow-2xl transition-all duration-300 backdrop-blur-sm"
        >
          {/* Selector de rol */}
          <div className="grid grid-cols-3 gap-2 mb-8 p-1 rounded-2xl bg-white/5 border border-[#38bdf8]/20 shadow-inner overflow-hidden">
            <button
              type="button"
              onClick={() => setSelectedRole('estudiante')}
              className={cn(
                "py-3 px-4 rounded-xl text-sm sm:text-base font-semibold text-center transition-all duration-300 focus:outline-none relative z-10",
                selectedRole === 'estudiante'
                  ? "bg-[#38bdf8] text-[#062056] shadow-md border border-[#38bdf8]"
                  : "text-gray-300 hover:text-white"
              )}
            >
              Estudiante
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole('egresado')}
              className={cn(
                "py-3 px-4 rounded-xl text-sm sm:text-base font-semibold text-center transition-all duration-300 focus:outline-none relative z-10",
                selectedRole === 'egresado'
                  ? "bg-[#38bdf8] text-[#062056] shadow-md border border-[#38bdf8]"
                  : "text-gray-300 hover:text-white"
              )}
            >
              Egresado
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole('empresa')}
              className={cn(
                "py-3 px-4 rounded-xl text-sm sm:text-base font-semibold text-center transition-all duration-300 focus:outline-none relative z-10",
                selectedRole === 'empresa'
                  ? "bg-[#38bdf8] text-[#062056] shadow-md border border-[#38bdf8]"
                  : "text-gray-300 hover:text-white"
              )}
            >
              Empresa
            </button>
          </div>

          {/* Campos comunes */}
          <div className="mb-6">
            <label htmlFor="nombre" className="block text-sm font-medium mb-2 text-gray-300">
              {selectedRole === 'empresa' ? 'Nombre del representante' : 'Nombre completo'}
            </label>
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                id="nombre"
                {...register('nombre')}
                className={`w-full pl-10 pr-4 py-3 rounded-lg border-2 bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-[#38bdf8] transition-colors ${
                  shouldShowError('nombre') ? 'border-red-500' : 'border-[#38bdf8]/30'
                }`}
                placeholder={selectedRole === 'empresa' ? 'Ej: Juan Pérez' : 'Ej: María López'}
              />
            </div>
            {shouldShowError('nombre') && (
              <p className="mt-1 text-sm text-red-400 animate-pulse">{errors.nombre.message}</p>
            )}
          </div>
          
          <div className="mb-6">
            <label htmlFor="email" className="block text-sm font-medium mb-2 text-gray-300">Email</label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                id="email"
                {...register('email')}
                type="email"
                className={`w-full pl-10 pr-4 py-3 rounded-lg border-2 bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-[#38bdf8] transition-colors ${
                  shouldShowError('email') ? 'border-red-500' : 'border-[#38bdf8]/30'
                }`}
                placeholder="tucorreo@ejemplo.com"
              />
            </div>
            {shouldShowError('email') && (
              <p className="mt-1 text-sm text-red-400 animate-pulse">{errors.email.message}</p>
            )}
          </div>
          
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium mb-2 text-gray-300">Contraseña</label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                id="password"
                {...register('password')}
                type="password"
                className={`w-full pl-10 pr-4 py-3 rounded-lg border-2 bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-[#38bdf8] transition-colors ${
                  shouldShowError('password') ? 'border-red-500' : 'border-[#38bdf8]/30'
                }`}
                placeholder="••••••••"
              />
            </div>
            {shouldShowError('password') && (
              <p className="mt-1 text-sm text-red-400 animate-pulse">{errors.password.message}</p>
            )}
          </div>

          {/* Campos específicos para Estudiante */}
          {selectedRole === 'estudiante' && (
            <>
              <input type="hidden" {...register('tipo')} value="estudiante" />
            </>
          )}
          
          {/* Campos específicos para Egresado */}
          {selectedRole === 'egresado' && (
            <>
              <input type="hidden" {...register('tipo')} value="egresado" />
              <div className="mb-6">
                <label htmlFor="año_egreso" className="block text-sm font-medium mb-2 text-gray-300">
                  Año de egreso
                </label>
                <div className="relative">
                  <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    id="año_egreso"
                    {...register('año_egreso', { valueAsNumber: true })}
                    type="number"
                    min="1900"
                    max={new Date().getFullYear()}
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border-2 bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-[#38bdf8] transition-colors ${
                      errors.año_egreso ? 'border-red-500' : 'border-[#38bdf8]/30'
                    }`}
                    placeholder="Ej: 2023"
                  />
                </div>
                {errors.año_egreso && (
                  <p className="mt-1 text-sm text-red-400 animate-pulse">{errors.año_egreso.message}</p>
                )}
              </div>
            </>
          )}

          {/* Campos comunes para Estudiante y Egresado */}
          {(selectedRole === 'estudiante' || selectedRole === 'egresado') && (
            <>
              <div className="mb-6">
                <label htmlFor="carrera" className="block text-sm font-medium mb-2 text-gray-300">Carrera</label>
                <div className="relative">
                  <FiBriefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    id="carrera"
                    {...register('carrera')}
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border-2 bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-[#38bdf8] transition-colors ${
                      shouldShowError('carrera') ? 'border-red-500' : 'border-[#38bdf8]/30'
                    }`}
                    placeholder="Ej: Ingeniería de Sistemas"
                  />
                </div>
                {shouldShowError('carrera') && (
                  <p className="mt-1 text-sm text-red-400 animate-pulse">{errors.carrera.message}</p>
                )}
              </div>

              {tipo === 'egresado' && (
                <div className="mb-6">
                  <label htmlFor="año_egreso" className="block text-sm font-medium mb-2 text-gray-300">
                    Año de egreso
                  </label>
                  <div className="relative">
                    <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      id="año_egreso"
                      {...register('año_egreso', { valueAsNumber: true })}
                      type="number"
                      min="1900"
                      max={new Date().getFullYear()}
                      className={`w-full pl-10 pr-4 py-3 rounded-lg border-2 bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-[#38bdf8] transition-colors ${
                        shouldShowError('año_egreso') ? 'border-red-500' : 'border-[#38bdf8]/30'
                      }`}
                      placeholder="Ej: 2023"
                    />
                  </div>
                  {shouldShowError('año_egreso') && (
                    <p className="mt-1 text-sm text-red-400 animate-pulse">{errors.año_egreso.message}</p>
                  )}
                </div>
              )}

              <div className="mb-6">
                <label htmlFor="telefono" className="block text-sm font-medium mb-2 text-gray-300">
                  Teléfono (opcional)
                </label>
                <div className="relative">
                  <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    id="telefono"
                    {...register('telefono')}
                    type="tel"
                    className="w-full pl-10 pr-4 py-3 rounded-lg border-2 bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-[#38bdf8] transition-colors border-[#38bdf8]/30"
                    placeholder="Ej: 999888777"
                  />
                </div>
                {errors.telefono && (
                  <p className="mt-1 text-sm text-red-400 animate-pulse">{errors.telefono.message}</p>
                )}
              </div>
            </>
          )}

          {/* Campos específicos para Empresa */}
          {selectedRole === 'empresa' && (
            <>
              <div className="mb-6">
                <label htmlFor="nombreEmpresa" className="block text-sm font-medium mb-2 text-gray-300">
                  Nombre de la empresa
                </label>
                <div className="relative">
                  <FiBriefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    id="nombreEmpresa"
                    {...register('nombreEmpresa')}
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border-2 bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-[#38bdf8] transition-colors ${
                      shouldShowError('nombreEmpresa') ? 'border-red-500' : 'border-[#38bdf8]/30'
                    }`}
                    placeholder="Ej: Mi Empresa S.A.C."
                  />
                </div>
                {shouldShowError('nombreEmpresa') && (
                  <p className="mt-1 text-sm text-red-400 animate-pulse">{errors.nombreEmpresa.message}</p>
                )}
              </div>
              
              <div className="mb-6">
                <label htmlFor="ruc" className="block text-sm font-medium mb-2 text-gray-300">
                  RUC
                </label>
                <div className="relative">
                  <FiTag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    id="ruc"
                    {...register('ruc')}
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border-2 bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-[#38bdf8] transition-colors ${
                      shouldShowError('ruc') ? 'border-red-500' : 'border-[#38bdf8]/30'
                    }`}
                    placeholder="Ej: 20123456781"
                  />
                </div>
                {shouldShowError('ruc') && (
                  <p className="mt-1 text-sm text-red-400 animate-pulse">{errors.ruc.message}</p>
                )}
              </div>
              
              <div className="mb-6">
                <label htmlFor="rubro" className="block text-sm font-medium mb-2 text-gray-300">
                  Rubro de la empresa
                </label>
                <div className="relative">
                  <FiBriefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    id="rubro"
                    {...register('rubro')}
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border-2 bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-[#38bdf8] transition-colors ${
                      shouldShowError('rubro') ? 'border-red-500' : 'border-[#38bdf8]/30'
                    }`}
                    placeholder="Ej: Tecnología"
                  />
                </div>
                {shouldShowError('rubro') && (
                  <p className="mt-1 text-sm text-red-400 animate-pulse">{errors.rubro.message}</p>
                )}
              </div>
            </>
          )}

          {submitError && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
              {submitError}
            </div>
          )}

          <div className="mt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 px-4 rounded-lg font-semibold shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#38bdf8] focus:ring-opacity-50 mb-4 ${
                isSubmitting ? 'bg-[#38bdf8]/70 cursor-not-allowed' : 'bg-[#38bdf8] hover:bg-[#0ea5e9] text-[#062056]'
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Procesando...
                </div>
              ) : 'Registrarse'}
            </button>
          </div>

          <div className="flex justify-center mb-6">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              theme="filled_blue"
              text="signup_with"
              shape="rectangular"
              width="350"
              locale="es"
            />
          </div>

          <div className="mt-6 text-center">
            <p className="text-gray-300">
              ¿Ya tienes una cuenta?{' '}
              <Link href="/auth/login" className="text-[#38bdf8] font-medium hover:text-[#0ea5e9] transition-colors">
                Inicia sesión
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
