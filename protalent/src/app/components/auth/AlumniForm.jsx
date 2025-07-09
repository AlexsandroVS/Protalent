'use client';
import { FiBriefcase, FiPhone, FiCalendar } from 'react-icons/fi';
import CommonFields from './CommonFields';

export default function AlumniForm({ 
  register, 
  errors, 
  touchedFields, 
  formSubmitted, 
  selectedRole 
}) {
  const shouldShowError = (fieldName) => {
    return (touchedFields[fieldName] || formSubmitted) && errors[fieldName];
  };

  return (
    <>
      <input type="hidden" {...register('tipo')} value="egresado" />
      
      <CommonFields 
        register={register} 
        errors={errors} 
        touchedFields={touchedFields} 
        formSubmitted={formSubmitted} 
        selectedRole={selectedRole} 
      />
      
      <div className="mb-6">
        <label htmlFor="carrera" className="block text-sm font-medium mb-2 text-gray-300">
          Carrera
        </label>
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
          <p className="mt-1 text-sm text-red-400 animate-pulse">{errors.carrera?.message}</p>
        )}
      </div>
      
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
          <p className="mt-1 text-sm text-red-400 animate-pulse">{errors.año_egreso?.message}</p>
        )}
      </div>
      
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
  );
}
