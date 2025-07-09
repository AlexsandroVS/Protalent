'use client'
import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/app/context/auth/AuthContext';
import api from '@/app/lib/api';

const preguntaTestSchema = z.object({
  texto: z.string().min(5, 'La pregunta es obligatoria'),
  tipo: z.literal('test'),
  opciones: z.array(
    z.object({
      texto: z.string().min(1, 'La opción es obligatoria'),
      correcta: z.boolean()
    })
  ).min(2, 'Debe haber al menos 2 opciones'),
});

const preguntaAbiertaSchema = z.object({
  texto: z.string().min(5, 'La pregunta es obligatoria'),
  tipo: z.literal('abierta'),
});

const preguntaSchema = z.discriminatedUnion('tipo', [preguntaTestSchema, preguntaAbiertaSchema]);

const ofertaSchema = z.object({
  titulo: z.string().min(5, 'El título es obligatorio'),
  descripcion: z.string().min(10, 'La descripción es obligatoria'),
  requisitos: z.string().optional(),
  modalidad: z.string().min(2, 'Selecciona una modalidad'),
  salario: z.string().optional(),
  departamento: z.string().min(1, 'Selecciona un departamento'),
  provincia: z.string().min(1, 'Selecciona una provincia'),
  distrito: z.string().min(1, 'Selecciona un distrito'),
  requiereCV: z.boolean().default(true),
  requiereCarta: z.boolean().default(false),
  preguntas: z.array(preguntaSchema).min(1, 'Agrega al menos una pregunta'),
});

export default function CrearOfertaPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [submitError, setSubmitError] = useState('');
  const [success, setSuccess] = useState(false);
  const [departamentos, setDepartamentos] = useState([]);
  const [provincias, setProvincias] = useState([]);
  const [distritos, setDistritos] = useState([]);
  const [loadingUbicacion, setLoadingUbicacion] = useState(false);

  // Depuración: mostrar el objeto user al renderizar
  console.log('[CrearOfertaPage] user:', user);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(ofertaSchema),
    defaultValues: {
      titulo: '',
      descripcion: '',
      requisitos: '',
      modalidad: '',
      salario: '',
      departamento: '',
      provincia: '',
      distrito: '',
      requiereCV: true,
      requiereCarta: false,
      preguntas: [],
    },
    mode: 'onBlur',
  });

  // Observar cambios en departamento y provincia para cargar datos dependientes
  const selectedDepartamento = watch('departamento');
  const selectedProvincia = watch('provincia');

  // Cargar departamentos al montar el componente
  useEffect(() => {
    fetchDepartamentos();
  }, []);

  // Cargar provincias cuando cambie el departamento
  useEffect(() => {
    if (selectedDepartamento) {
      fetchProvincias(selectedDepartamento);
      setValue('provincia', '');
      setValue('distrito', '');
      setProvincias([]);
      setDistritos([]);
    }
  }, [selectedDepartamento, setValue]);

  // Cargar distritos cuando cambie la provincia
  useEffect(() => {
    if (selectedProvincia) {
      fetchDistritos(selectedProvincia);
      setValue('distrito', '');
      setDistritos([]);
    }
  }, [selectedProvincia, setValue]);

  const fetchDepartamentos = async () => {
    try {
      setLoadingUbicacion(true);
      const response = await api.get('/api/ubicaciones/departamentos');
      setDepartamentos(response.data);
    } catch (error) {
      console.error('Error cargando departamentos:', error);
    } finally {
      setLoadingUbicacion(false);
    }
  };

  const fetchProvincias = async (departamentoId) => {
    try {
      setLoadingUbicacion(true);
      const response = await api.get(`/api/ubicaciones/provincias/${departamentoId}`);
      setProvincias(response.data);
    } catch (error) {
      console.error('Error cargando provincias:', error);
    } finally {
      setLoadingUbicacion(false);
    }
  };

  const fetchDistritos = async (provinciaId) => {
    try {
      setLoadingUbicacion(true);
      const response = await api.get(`/api/ubicaciones/distritos/${provinciaId}`);
      setDistritos(response.data);
    } catch (error) {
      console.error('Error cargando distritos:', error);
    } finally {
      setLoadingUbicacion(false);
    }
  };

  const { fields: preguntas, append, remove, update } = useFieldArray({
    control,
    name: 'preguntas',
  });

  // Animación para feedback visual
  const fieldAnim = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.2 },
  };

  const onSubmit = async (data) => {
    setSubmitError('');
    setSuccess(false);
    try {
      const empresaId = user?.Empresa?.id;
      const payload = { ...data, empresaId };
      console.log('[CrearOfertaPage] Payload a enviar:', payload);
      if (!empresaId) {
        console.warn('[CrearOfertaPage] No se encontró la empresa asociada en user:', user);
        throw new Error('No se encontró la empresa asociada.');
      }
      await api.post('/api/ofertas', payload);
      setSuccess(true);
      reset();
      setTimeout(() => router.push('/empresas/dashboard/ofertas'), 1200);
    } catch (err) {
      setSubmitError(err?.response?.data?.message || err.message || 'Error al crear la oferta');
    }
  };

  // UI para preguntas
  const renderPregunta = (pregunta, idx) => (
    <motion.div key={pregunta.id} {...fieldAnim} className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-4 shadow-lg border border-blue-200 relative">
      <div className="flex items-center gap-2 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-blue-800">Pregunta #{idx + 1}</span>
          <span className="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-medium border border-blue-200">
            {pregunta.tipo === 'test' ? 'Test' : 'Abierta'}
          </span>
        </div>
        <button 
          type="button" 
          className="ml-auto text-red-500 hover:text-red-700 transition-colors duration-200 p-1 rounded-full hover:bg-red-50" 
          onClick={() => remove(idx)}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <input
        className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg px-4 py-3 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
        placeholder="Escribe tu pregunta aquí..."
        {...register(`preguntas.${idx}.texto`)}
      />
      {errors.preguntas?.[idx]?.texto && (
        <p className="text-red-500 text-sm font-medium animate-pulse">{errors.preguntas[idx].texto.message}</p>
      )}
      {pregunta.tipo === 'test' && (
        <Controller
          control={control}
          name={`preguntas.${idx}.opciones`}
          render={({ field }) => (
            <div className="mt-4">
              <span className="text-sm font-semibold text-blue-800 mb-3 block">Opciones de respuesta:</span>
              {field.value?.map((op, opIdx) => (
                <motion.div key={opIdx} {...fieldAnim} className="flex items-center gap-3 mt-2 p-3 bg-white rounded-lg border border-gray-200">
                  <input
                    className="bg-gray-50 text-gray-900 border border-gray-300 rounded-lg px-3 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder={`Opción ${opIdx + 1}`}
                    value={op.texto}
                    onChange={e => {
                      const newOpciones = [...field.value];
                      newOpciones[opIdx].texto = e.target.value;
                      field.onChange(newOpciones);
                    }}
                  />
                  <label className="flex items-center gap-2 text-sm text-green-700 font-medium">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                      checked={op.correcta}
                      onChange={e => {
                        const newOpciones = [...field.value];
                        newOpciones[opIdx].correcta = e.target.checked;
                        field.onChange(newOpciones);
                      }}
                    />
                    Correcta
                  </label>
                  <button 
                    type="button" 
                    className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors duration-200" 
                    onClick={() => {
                      const newOpciones = field.value.filter((_, i) => i !== opIdx);
                      field.onChange(newOpciones);
                    }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </motion.div>
              ))}
              <button
                type="button"
                className="mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1 transition-colors duration-200"
                onClick={() => field.onChange([...(field.value || []), { texto: '', correcta: false }])}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Agregar opción
              </button>
              {errors.preguntas?.[idx]?.opciones && (
                <p className="text-red-500 text-sm font-medium animate-pulse mt-2">{errors.preguntas[idx].opciones.message}</p>
              )}
            </div>
          )}
        />
      )}
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Crear nueva oferta</h1>
          <p className="text-gray-600">Completa los detalles de tu oferta de trabajo</p>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl shadow-xl p-8 space-y-6 border border-gray-100">
          {/* Información básica */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div {...fieldAnim}>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Título de la oferta *</label>
              <input
                className="w-full bg-gray-50 text-gray-900 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Ej: Desarrollador Frontend React"
                {...register('titulo')}
              />
              {errors.titulo && <p className="text-red-500 text-sm font-medium mt-1 animate-pulse">{errors.titulo.message}</p>}
            </motion.div>
            
            <motion.div {...fieldAnim}>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Modalidad *</label>
              <select
                className="w-full bg-gray-50 text-gray-900 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                {...register('modalidad')}
              >
                <option value="">Selecciona una modalidad</option>
                <option value="presencial">Presencial</option>
                <option value="remoto">Remoto</option>
                <option value="hibrido">Híbrido</option>
              </select>
              {errors.modalidad && <p className="text-red-500 text-sm font-medium mt-1 animate-pulse">{errors.modalidad.message}</p>}
            </motion.div>
          </div>

          <motion.div {...fieldAnim}>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Descripción *</label>
            <textarea
              className="w-full bg-gray-50 text-gray-900 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Describe la posición, responsabilidades, beneficios, etc."
              rows={4}
              {...register('descripcion')}
            />
            {errors.descripcion && <p className="text-red-500 text-sm font-medium mt-1 animate-pulse">{errors.descripcion.message}</p>}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div {...fieldAnim}>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Requisitos</label>
              <textarea
                className="w-full bg-gray-50 text-gray-900 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Ej: React, Node.js, trabajo en equipo, experiencia mínima 2 años..."
                rows={3}
                {...register('requisitos')}
              />
            </motion.div>
            
            <motion.div {...fieldAnim}>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Salario (opcional)</label>
              <input
                className="w-full bg-gray-50 text-gray-900 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Ej: $1500 - $2500 USD"
                {...register('salario')}
              />
            </motion.div>
          </div>

          {/* Ubicación */}
          <motion.div {...fieldAnim} className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
            <h3 className="text-lg font-semibold text-green-900 mb-4">Ubicación de la oferta</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Departamento *</label>
                <select
                  className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  {...register('departamento')}
                  disabled={loadingUbicacion}
                >
                  <option value="">Selecciona un departamento</option>
                  {departamentos.map((depto) => (
                    <option key={depto.id} value={depto.id}>
                      {depto.nombre}
                    </option>
                  ))}
                </select>
                {errors.departamento && <p className="text-red-500 text-sm font-medium mt-1 animate-pulse">{errors.departamento.message}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Provincia *</label>
                <select
                  className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  {...register('provincia')}
                  disabled={!selectedDepartamento || loadingUbicacion}
                >
                  <option value="">Selecciona una provincia</option>
                  {provincias.map((prov) => (
                    <option key={prov.id} value={prov.id}>
                      {prov.nombre}
                    </option>
                  ))}
                </select>
                {errors.provincia && <p className="text-red-500 text-sm font-medium mt-1 animate-pulse">{errors.provincia.message}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Distrito *</label>
                <select
                  className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  {...register('distrito')}
                  disabled={!selectedProvincia || loadingUbicacion}
                >
                  <option value="">Selecciona un distrito</option>
                  {distritos.map((dist) => (
                    <option key={dist.id} value={dist.id}>
                      {dist.nombre}
                    </option>
                  ))}
                </select>
                {errors.distrito && <p className="text-red-500 text-sm font-medium mt-1 animate-pulse">{errors.distrito.message}</p>}
              </div>
            </div>
            {loadingUbicacion && (
              <div className="flex items-center justify-center mt-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
                <span className="ml-2 text-sm text-green-700">Cargando ubicaciones...</span>
              </div>
            )}
          </motion.div>

          {/* Configuración de documentos */}
          <motion.div {...fieldAnim} className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Documentos requeridos</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-blue-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700">Currículum Vitae</label>
                    <p className="text-xs text-gray-500">Los postulantes deberán adjuntar su CV</p>
                  </div>
                </div>
                <Controller
                  name="requiereCV"
                  control={control}
                  render={({ field }) => (
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={field.value}
                        onChange={field.onChange}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  )}
                />
              </div>
              
              <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-blue-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700">Carta de presentación</label>
                    <p className="text-xs text-gray-500">Los postulantes deberán adjuntar una carta</p>
                  </div>
                </div>
                <Controller
                  name="requiereCarta"
                  control={control}
                  render={({ field }) => (
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={field.value}
                        onChange={field.onChange}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  )}
                />
              </div>
            </div>
          </motion.div>

          {/* Preguntas */}
          <motion.div {...fieldAnim}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Preguntas para postulantes</h3>
                <p className="text-sm text-gray-600">Agrega preguntas para evaluar a los candidatos</p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium flex items-center gap-2"
                  onClick={() => append({ tipo: 'test', texto: '', opciones: [{ texto: '', correcta: false }, { texto: '', correcta: false }] })}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Pregunta Test
                </button>
                <button
                  type="button"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 text-sm font-medium flex items-center gap-2"
                  onClick={() => append({ tipo: 'abierta', texto: '' })}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Pregunta Abierta
                </button>
              </div>
            </div>
            <AnimatePresence>
              {preguntas.map((pregunta, idx) => renderPregunta(pregunta, idx))}
            </AnimatePresence>
            {errors.preguntas && typeof errors.preguntas.message === 'string' && (
              <p className="text-red-500 text-sm font-medium animate-pulse mt-2">{errors.preguntas.message}</p>
            )}
          </motion.div>

          {/* Botón submit */}
          <motion.div {...fieldAnim} className="pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creando oferta...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Crear oferta
                </>
              )}
            </button>
            {submitError && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-sm font-medium mt-3 text-center bg-red-50 p-3 rounded-lg border border-red-200"
              >
                {submitError}
              </motion.p>
            )}
            {success && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-green-600 text-sm font-medium mt-3 text-center bg-green-50 p-3 rounded-lg border border-green-200"
              >
                ¡Oferta creada con éxito! Redirigiendo...
              </motion.p>
            )}
          </motion.div>
        </form>
      </div>
    </div>
  );
} 