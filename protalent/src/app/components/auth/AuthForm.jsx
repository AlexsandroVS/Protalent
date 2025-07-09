'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '../../context/auth/AuthContext';
import { FiMail, FiLock, FiUser, FiTag } from 'react-icons/fi';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres')
});

const registerSchema = loginSchema.extend({
  nombre: z.string().min(3, 'Mínimo 3 caracteres'),
  rol: z.enum(['postulante', 'empresa'])
});

export default function AuthForm({ type }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(type === 'login' ? loginSchema : registerSchema)
  });

  const { login, register: registerUser } = useAuth();

  const onSubmit = async (data) => {
    if (type === 'login') {
      await login(data.email, data.password);
    } else {
      await registerUser(data);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#062056] to-black p-4">
      <form 
        onSubmit={handleSubmit(onSubmit)} 
        className="w-full max-w-md bg-white/10 border border-[#38bdf8]/20 rounded-3xl p-8 shadow-2xl transition-all duration-300"
      >
        <h2 className="text-3xl font-bold text-center text-white mb-8">
          {type === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
        </h2>
        
        {type === 'register' && (
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-gray-300">Nombre completo</label>
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
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
          <label className="block text-sm font-medium mb-2 text-gray-300">Email</label>
          <div className="relative">
            <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
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
          <label className="block text-sm font-medium mb-2 text-gray-300">Contraseña</label>
          <div className="relative">
            <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
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

        {type === 'register' && (
          <div className="mb-8">
            <label className="block text-sm font-medium mb-2 text-gray-300">Rol</label>
            <div className="relative">
              <FiTag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <select
                {...register('rol')}
                className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-[#38bdf8]/30 bg-white/10 text-white focus:outline-none focus:border-[#38bdf8] transition-colors"
              >
                <option value="postulante" className="bg-[#062056]">Postulante</option>
                <option value="empresa" className="bg-[#062056]">Empresa</option>
              </select>
            </div>
          </div>
        )}

        <button 
          type="submit" 
          className="w-full bg-[#38bdf8] text-[#062056] py-3 px-4 rounded-lg font-semibold shadow-lg hover:bg-[#0ea5e9] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#38bdf8] focus:ring-opacity-50"
        >
          {type === 'login' ? 'Iniciar Sesión' : 'Registrarse'}
        </button>

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
    </div>
  );
}