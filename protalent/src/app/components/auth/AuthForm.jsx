'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '../../context/auth/AuthContext';
import { FiMail, FiLock, FiUser, FiTag, FiBriefcase, FiCalendar, FiPhone } from 'react-icons/fi';
import { useEffect, useState, useCallback } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { cn } from '../../../lib/utils';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres')
});

const baseRegisterSchema = z.object({
  nombre: z.string().min(3, 'Mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
});

const studentAlumniSchema = baseRegisterSchema.extend({
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

const companySchema = baseRegisterSchema.extend({
  ruc: z.string().min(11, 'RUC debe tener 11 caracteres').max(11, 'RUC debe tener 11 caracteres'),
  nombreEmpresa: z.string().min(3, 'El nombre de la empresa es obligatorio'),
  rubro: z.string().min(3, 'El rubro es obligatorio')
});

export default function AuthForm({ type }) {
  // Solo para registro: manejo de roles
  const [selectedRole, setSelectedRole] = useState('estudiante');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const getCurrentSchema = useCallback(() => {
    if (type === 'login') return loginSchema;
    
    if (selectedRole === 'empresa') {
      return companySchema;
    } else {
      return studentAlumniSchema;
    }
  }, [type, selectedRole]);

  const { register, handleSubmit, formState: { errors }, reset, clearErrors, setValue } = useForm({
    resolver: zodResolver(getCurrentSchema()),
    defaultValues: { 
      nombre: '', 
      email: '', 
      password: '', 
      carrera: '', 
      tipo: 'estudiante', // Se inicializa como estudiante
      telefono: '', 
      anio_egreso: null, 
      ruc: '', 
      nombre_empresa: '', 
      rubro: '' 
    } 
  });

  // useEffect para resetear el formulario cuando el rol cambia (siempre es necesario, incluso con key)
  useEffect(() => {
    // Reinicia el formulario con los valores por defecto del rol actual
    reset({
      nombre: '',
      email: '',
      password: '',
      carrera: '',
      tipo: (selectedRole === 'estudiante' || selectedRole === 'egresado') ? selectedRole : '',
      telefono: '',
      anio_egreso: null,
      ruc: '',
      nombre_empresa: '',
      rubro: ''
    });
    clearErrors();
  }, [selectedRole, reset, clearErrors]);

  const { login, register: registerUser, loginWithGoogle, registerWithGoogle } = useAuth();

  const onSubmit = async (data) => {
    setSubmitError('');
    setIsSubmitting(true);
    
    try {
      if (type === 'login') {
        await login(data.email, data.password);
      } else {
        let userData = {
          nombre: data.nombre,
          email: data.email,
          password: data.password,
          rol: selectedRole,
        };

        if (selectedRole === 'estudiante' || selectedRole === 'egresado') {
          userData = { 
            ...userData, 
            carrera: data.carrera, 
            tipo: selectedRole, // siempre el valor correcto
            telefono: data.telefono || null
          };
          if (selectedRole === 'egresado') {
            userData.anio_egreso = parseInt(data.anio_egreso);
          }
        } else if (selectedRole === 'empresa') {
          userData = { 
            ...userData, 
            ruc: data.ruc, 
            nombre_empresa: data.nombreEmpresa, 
            rubro: data.rubro 
          };
        }
        
        await registerUser(userData);
      }
    } catch (error) {
      console.error('Error en el formulario:', error);
      setSubmitError(error.response?.data?.error || 'Ocurrió un error al procesar la solicitud');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    if (type === 'login') {
      await loginWithGoogle(credentialResponse.credential);
    } else {
      await registerWithGoogle(credentialResponse.credential);
    }
  };

  const handleGoogleError = () => {
    console.error('Google Login Falló');
  };

  // Separar el formulario de login y registro
  if (type === 'login') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#062056] to-black p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#38bdf8] to-[#3b82f6] mb-2">
              Bienvenido de nuevo
            </h1>
            <p className="text-gray-300">Inicia sesión para acceder a tu cuenta</p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="bg-white/5 border border-[#38bdf8]/20 rounded-2xl p-6 sm:p-8 shadow-2xl transition-all duration-300 backdrop-blur-sm">
            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-medium mb-2 text-gray-300">Email</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="email"
                  {...register('email')}
                  type="email"
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border-2 bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-[#38bdf8] transition-colors ${errors.email ? 'border-red-500' : 'border-[#38bdf8]/30'}`}
                  placeholder="tucorreo@ejemplo.com"
                />
              </div>
              {errors.email && (
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
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border-2 bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-[#38bdf8] transition-colors ${errors.password ? 'border-red-500' : 'border-[#38bdf8]/30'}`}
                  placeholder="••••••••"
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-400 animate-pulse">{errors.password.message}</p>
              )}
            </div>
            {submitError && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                {submitError}
              </div>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 px-4 rounded-lg font-semibold shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#38bdf8] focus:ring-opacity-50 mb-4 ${isSubmitting ? 'bg-[#38bdf8]/70 cursor-not-allowed' : 'bg-[#38bdf8] hover:bg-[#0ea5e9] text-[#062056]'}`}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Procesando...
                </div>
              ) : 'Iniciar Sesión'}
            </button>
            <div className="flex justify-center mb-6">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                theme="filled_blue"
                text="signin_with"
                shape="rectangular"
                width="350"
                locale="es"
              />
            </div>
            <div className="mt-6 text-center">
              <p className="text-gray-300">
                ¿No tienes una cuenta?{' '}
                <a href="/auth/register" className="text-[#38bdf8] font-medium hover:text-[#0ea5e9] transition-colors">
                  Regístrate
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // el formulario de registro sigue igual, solo se muestra si type === 'register'
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#062056] to-black p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#38bdf8] to-[#3b82f6] mb-2">
            {type === 'login' ? 'Bienvenido de nuevo' : 'Únete a Protalent'}
          </h1>
          <p className="text-gray-300">
            {type === 'login' 
              ? 'Inicia sesión para acceder a tu cuenta' 
              : 'Crea una cuenta para comenzar tu experiencia'}
          </p>
        </div>
        <form 
          key={selectedRole}
          onSubmit={handleSubmit(onSubmit)} 
          className="bg-white/5 border border-[#38bdf8]/20 rounded-2xl p-6 sm:p-8 shadow-2xl transition-all duration-300 backdrop-blur-sm"
        >
        
        {type === 'register' && (
          <div className="grid grid-cols-2 gap-4 mb-8 p-1 rounded-2xl bg-white/5 border border-[#38bdf8]/20 shadow-inner overflow-hidden">
            <button
              type="button"
              onClick={() => {
                setSelectedRole('estudiante');
                reset({ 
                  nombre: '', 
                  email: '', 
                  password: '', 
                  carrera: '', 
                  tipo: 'estudiante', 
                  telefono: '', 
                  anio_egreso: null, 
                  ruc: '', 
                  nombre_empresa: '', 
                  rubro: '' 
                });
                clearErrors();
              }}
              className={cn(
                "py-3 px-4 rounded-xl text-lg font-semibold text-center transition-all duration-300 focus:outline-none relative z-10",
                selectedRole === 'estudiante' || selectedRole === 'egresado'
                  ? "bg-[#38bdf8] text-[#062056] shadow-md border border-[#38bdf8]"
                  : "text-gray-300 hover:text-white"
              )}
            >
              Estudiante/Egresado
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedRole('empresa');
                reset({ 
                  nombre: '', 
                  email: '', 
                  password: '', 
                  carrera: '', 
                  tipo: '', 
                  telefono: '', 
                  anio_egreso: null, 
                  ruc: '', 
                  nombre_empresa: '', 
                  rubro: '' 
                });
                clearErrors();
              }}
              className={cn(
                "py-3 px-4 rounded-xl text-lg font-semibold text-center transition-all duration-300 focus:outline-none relative z-10",
                selectedRole === 'empresa'
                  ? "bg-[#38bdf8] text-[#062056] shadow-md border border-[#38bdf8]"
                  : "text-gray-300 hover:text-white"
              )}
            >
              Empresa
            </button>
          </div>
        )}

        {type === 'register' && (
          <div className="mb-6">
            <label htmlFor="nombre" className="block text-sm font-medium mb-2 text-gray-300">Nombre completo</label>
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                id="nombre"
                {...register('nombre')}
                className={`w-full pl-10 pr-4 py-3 rounded-lg border-2 bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-[#38bdf8] transition-colors ${
                  errors.nombre ? 'border-red-500' : 'border-[#38bdf8]/30'
                }`}
                placeholder="Ej: Juan Pérez"
              />
            </div>
            {errors.nombre && (
              <p className="mt-1 text-sm text-red-400 animate-pulse">{errors.nombre.message}</p>
            )}
          </div>
        )}
        
        <div className="mb-6">
          <label htmlFor="email" className="block text-sm font-medium mb-2 text-gray-300">Email</label>
          <div className="relative">
            <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              id="email"
              {...register('email')}
              type="email"
              className={`w-full pl-10 pr-4 py-3 rounded-lg border-2 bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-[#38bdf8] transition-colors ${
                errors.email ? 'border-red-500' : 'border-[#38bdf8]/30'
              }`}
              placeholder="tucorreo@ejemplo.com"
            />
          </div>
          {errors.email && (
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
                errors.password ? 'border-red-500' : 'border-[#38bdf8]/30'
              }`}
              placeholder="••••••••"
            />
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-400 animate-pulse">{errors.password.message}</p>
          )}
        </div>

        {/* Hidden input for 'tipo' for student/alumni roles */}
        {(selectedRole === 'estudiante' || selectedRole === 'egresado') && (
          <input type="hidden" {...register('tipo')} value={selectedRole} />
        )}

        {/* Conditional fields for Student/Alumni */}
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
                    errors.carrera ? 'border-red-500' : 'border-[#38bdf8]/30'
                  }`}
                  placeholder="Ej: Ingeniería de Sistemas"
                />
              </div>
              {errors.carrera && (
                <p className="mt-1 text-sm text-red-400 animate-pulse">{errors.carrera.message}</p>
              )}
            </div>

            {selectedRole === 'egresado' && (
              <div className="mb-6">
                <label htmlFor="anio_egreso" className="block text-sm font-medium mb-2 text-gray-300">Año de Egreso</label>
                <div className="relative">
                  <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    id="anio_egreso"
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

            <div className="mb-8">
              <label htmlFor="telefono" className="block text-sm font-medium mb-2 text-gray-300">Teléfono (opcional)</label>
              <div className="relative">
                <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="telefono"
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
          </>
        )}

        {/* Conditional fields for Company */}
        {selectedRole === 'empresa' && (
          <>
            <div className="mb-6">
              <label htmlFor="ruc" className="block text-sm font-medium mb-2 text-gray-300">RUC</label>
              <div className="relative">
                <FiTag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="ruc"
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
              <label htmlFor="nombreEmpresa" className="block text-sm font-medium mb-2 text-gray-300">Nombre de la Empresa</label>
              <div className="relative">
                <FiBriefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="nombreEmpresa"
                  {...register('nombreEmpresa')}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border-2 bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-[#38bdf8] transition-colors ${
                    errors.nombreEmpresa ? 'border-red-500' : 'border-[#38bdf8]/30'
                  }`}
                  placeholder="Ej: TechCorp SAC"
                />
              </div>
              {errors.nombreEmpresa && (
                <p className="mt-1 text-sm text-red-400 animate-pulse">{errors.nombreEmpresa.message}</p>
              )}
            </div>

            <div className="mb-8">
              <label htmlFor="rubro" className="block text-sm font-medium mb-2 text-gray-300">Rubro</label>
              <div className="relative">
                <FiTag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="rubro"
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

        {submitError && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
            {submitError}
          </div>
        )}
        
        <button 
          type="submit" 
          disabled={isSubmitting}
          className={`w-full py-3 px-4 rounded-lg font-semibold shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#38bdf8] focus:ring-opacity-50 mb-4 ${
            isSubmitting 
              ? 'bg-[#38bdf8]/70 cursor-not-allowed' 
              : 'bg-[#38bdf8] hover:bg-[#0ea5e9] text-[#062056]'
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
          ) : type === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
        </button>

        {/* Google Login Button */}
        <div className="flex justify-center mb-6">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            theme="filled_blue"
            text={type === 'login' ? 'signin_with' : 'signup_with'}
            shape="rectangular"
            width="350"
            locale="es"
          />
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-300">
            {type === 'login' ? '¿No tienes una cuenta?' : '¿Ya tienes una cuenta?'}{' '}
            <a 
              href={type === 'login' ? '/auth/register' : '/auth/login'} 
              className="text-[#38bdf8] font-medium hover:text-[#0ea5e9] transition-colors"
            >
              {type === 'login' ? 'Regístrate' : 'Inicia sesión'}
            </a>
          </p>
        </div>
        </form>
        {type === 'login' && (
          <div className="mt-6 text-center text-sm text-gray-400">
            <p>¿Eres nuevo en Protalent?{' '}
              <a href="/auth/register" className="text-[#38bdf8] hover:underline">
                Crea una cuenta
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}