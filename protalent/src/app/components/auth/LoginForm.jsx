'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '../../context/auth/AuthContext';
import { FiMail, FiLock } from 'react-icons/fi';
import { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import Link from 'next/link';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres')
});

export default function LoginForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [showRoleSelector, setShowRoleSelector] = useState(false);
  const [googleCredential, setGoogleCredential] = useState('');
  const [selectedRole, setSelectedRole] = useState('estudiante');
  const { login, loginWithGoogle } = useAuth();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { 
      email: '', 
      password: ''
    } 
  });

  const onSubmit = async (data) => {
    setSubmitError('');
    setIsSubmitting(true);
    
    try {
      await login(data.email, data.password);
    } catch (error) {
      console.error('Error en el login:', error);
      setSubmitError(error.response?.data?.error || 'Ocurrió un error al iniciar sesión');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setGoogleCredential(credentialResponse.credential);
      setShowRoleSelector(true);
    } catch (error) {
      console.error('Error en login con Google:', error);
      setSubmitError('Error al procesar la autenticación de Google');
    }
  };

  const handleRoleSelect = async () => {
    if (!googleCredential || !selectedRole) {
      setSubmitError('Por favor selecciona un rol');
      return;
    }

    try {
      await loginWithGoogle(googleCredential, selectedRole);
      setShowRoleSelector(false);
    } catch (error) {
      console.error('Error en login con Google:', error);
      setSubmitError('Error al iniciar sesión con Google');
      setShowRoleSelector(false);
    }
  };

  const handleGoogleError = () => {
    console.error('Google Login Falló');
    setSubmitError('Error al autenticar con Google');
  };

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
              clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              cookiePolicy="single_host_origin"
              theme="filled_blue"
              text="signin_with"
              shape="rectangular"
              width="350"
              locale="es"
            />
          </div>
          {isSubmitting && (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Procesando...
            </div>
          )}
          {showRoleSelector && (
            <div className="mt-6 p-4 bg-white/5 rounded-lg border border-[#38bdf8]/20">
              <h3 className="text-center text-gray-300 mb-4">Selecciona tu tipo de cuenta</h3>
              <div className="space-y-3">
                {['estudiante', 'egresado', 'empresa'].map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setSelectedRole(role)}
                    className={`w-full py-2 px-4 rounded-lg text-center transition-colors ${
                      selectedRole === role
                        ? 'bg-[#38bdf8] text-gray-900 font-medium'
                        : 'bg-white/5 text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </button>
                ))}
              </div>
              <div className="mt-4 flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowRoleSelector(false)}
                  className="flex-1 py-2 px-4 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleRoleSelect}
                  className="flex-1 py-2 px-4 bg-[#38bdf8] text-gray-900 font-medium rounded-lg hover:bg-[#38bdf8]/90 transition-colors"
                >
                  Continuar
                </button>
              </div>
            </div>
          )}
          <div className="mt-6 text-center">
            <p className="text-gray-300">
              ¿No tienes una cuenta?{' '}
              <Link href="/auth/register" className="text-[#38bdf8] font-medium hover:text-[#0ea5e9] transition-colors">
                Regístrate
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
