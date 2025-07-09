'use client';
import { FiMail, FiLock, FiUser, FiPhone } from 'react-icons/fi';

export default function CommonFields({ register, errors, touchedFields, formSubmitted, selectedRole }) {
  const shouldShowError = (fieldName) => {
    return (touchedFields[fieldName] || formSubmitted) && errors[fieldName];
  };

  return (
    <>
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
        <label htmlFor="email" className="block text-sm font-medium mb-2 text-gray-300">
          Email
        </label>
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
        <label htmlFor="password" className="block text-sm font-medium mb-2 text-gray-300">
          Contraseña
        </label>
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
    </>
  );
}
