'use client';
import { FiBriefcase, FiTag } from 'react-icons/fi';
import CommonFields from './CommonFields';

export default function CompanyForm({ 
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
      <CommonFields 
        register={register} 
        errors={errors} 
        touchedFields={touchedFields} 
        formSubmitted={formSubmitted} 
        selectedRole={selectedRole} 
      />
      
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
          <p className="mt-1 text-sm text-red-400 animate-pulse">{errors.nombreEmpresa?.message}</p>
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
            placeholder="11 dígitos"
            maxLength={11}
          />
        </div>
        {shouldShowError('ruc') && (
          <p className="mt-1 text-sm text-red-400 animate-pulse">{errors.ruc?.message}</p>
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
          <p className="mt-1 text-sm text-red-400 animate-pulse">{errors.rubro?.message}</p>
        )}
      </div>
    </>
  );
}
