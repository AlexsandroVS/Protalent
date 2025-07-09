'use client'
import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/app/context/auth/AuthContext';
import api from '@/app/lib/api';

// Schema para respuestas de preguntas
const respuestaSchema = z.object({
  preguntaId: z.number(),
  respuesta: z.string().min(1, 'Debes responder esta pregunta'),
  tipo: z.enum(['test', 'abierta'])
});

// Schema para el formulario de postulación
const postulacionSchema = z.object({
  ofertaId: z.number(),
  estudianteId: z.number().optional(),
  cv: z.any().optional(),
  carta: z.any().optional(),
  respuestas: z.array(respuestaSchema).optional()
});

export default function PostulacionPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const ofertaId = params.ofertaId;
  
  const [oferta, setOferta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitError, setSubmitError] = useState('');
  const [success, setSuccess] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(postulacionSchema),
    defaultValues: {
      ofertaId: parseInt(ofertaId),
      estudianteId: user?.Estudiante?.id || 0,
      respuestas: []
    },
    mode: 'onBlur',
  });

  // Actualizar estudianteId cuando el usuario esté disponible
  useEffect(() => {
    if (user?.Estudiante?.id) {
      setValue('estudianteId', user.Estudiante.id);
    }
  }, [user, setValue]);

  // Cargar datos de la oferta
  useEffect(() => {
    if (ofertaId) {
      fetchOferta();
    }
  }, [ofertaId]);

  const fetchOferta = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/ofertas/${ofertaId}`);
      setOferta(response.data);
      
      // Inicializar respuestas para cada pregunta
      const respuestas = response.data.PreguntaOferta?.map(pregunta => ({
        preguntaId: pregunta.id,
        respuesta: '',
        tipo: pregunta.tipo
      })) || [];
      
      setValue('respuestas', respuestas);
    } catch (error) {
      console.error('Error cargando oferta:', error);
      setSubmitError('Error al cargar la oferta');
    } finally {
      setLoading(false);
    }
  };

  // Función para subir archivos a Cloudinary
  const uploadToCloudinary = async (file, tipo) => {
    const formData = new FormData();
    formData.append('archivo', file);
    formData.append('tipo', tipo);

    try {
      const response = await api.post('/api/upload/postulacion', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data.url;
    } catch (error) {
      console.error('Error subiendo archivo:', error);
      throw new Error('Error al subir archivo');
    }
  };

  const onSubmit = async (data) => {
    setSubmitError('');
    setSuccess(false);
    setUploadingFiles(true);
    
    try {
      // Asegurar que el estudianteId esté correcto
      const estudianteId = user?.Estudiante?.id;
      if (!estudianteId) {
        console.log('❌ No se encontró estudianteId en el usuario:', user);
        setSubmitError('Error: No se pudo identificar al estudiante');
        setUploadingFiles(false);
        return;
      }

      // Validar que se respondieron todas las preguntas
      if (data.respuestas && data.respuestas.length > 0) {
        const preguntasSinResponder = data.respuestas.filter(resp => !resp.respuesta || resp.respuesta.trim() === '');
        if (preguntasSinResponder.length > 0) {
          setSubmitError('Debes responder todas las preguntas de la oferta');
          setUploadingFiles(false);
          return;
        }
      }
      
      let cvUrl = null;
      let cartaUrl = null;

      // Subir archivos a Cloudinary si están presentes
      if (data.cv && data.cv[0]) {
        cvUrl = await uploadToCloudinary(data.cv[0], 'cv');
      }
      if (data.carta && data.carta[0]) {
        cartaUrl = await uploadToCloudinary(data.carta[0], 'carta');
      }

      // Preparar payload para el backend
      const payload = {
        ofertaId: data.ofertaId,
        estudianteId: estudianteId, // Usar el ID real del estudiante
        respuestas: data.respuestas,
        cvUrl,
        cartaUrl
      };

      const response = await api.post('/api/postulaciones', payload);
      
      setSuccess(true);
      
      // Mostrar mensaje de éxito por 2 segundos antes de redirigir
      setTimeout(() => {
        router.push('/dashboard/postulaciones');
      }, 2000);
      
    } catch (err) {
      console.error('❌ Error al enviar postulación:', err);
      const errorMessage = err?.response?.data?.message || 
                          err?.response?.data?.error || 
                          err?.message || 
                          'Error al enviar postulación';
      setSubmitError(errorMessage);
    } finally {
      setUploadingFiles(false);
    }
  };

  const renderPregunta = (pregunta, index) => {
    
    if (!pregunta || !pregunta.id) {
      console.error(`❌ Pregunta ${index + 1} no válida:`, pregunta);
      return (
        <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">Error: Pregunta no válida</p>
        </div>
      );
    }
    
    return (
      <motion.div
        key={pregunta.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg p-6 mb-4 shadow-md border border-gray-200"
      >
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Pregunta {index + 1}
          </h3>
          <p className="text-gray-700 mb-4">{pregunta.pregunta}</p>
          
          {pregunta.tipo === 'test' && pregunta.opciones && (
            <div className="space-y-3">
              <p className="text-sm text-gray-600 mb-3">Selecciona una opción:</p>
              {(() => {
                try {
                  const opciones = JSON.parse(pregunta.opciones);
                  
                  if (!Array.isArray(opciones) || opciones.length === 0) {
                    return <p className="text-red-500">No hay opciones disponibles</p>;
                  }
                  
                  return opciones.map((opcion, opcionIndex) => (
                    <label key={opcionIndex} className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        value={opcion.texto}
                        className="text-blue-600 border-gray-300 focus:ring-blue-500"
                        {...register(`respuestas.${index}.respuesta`)}
                      />
                      <span className="text-gray-700 flex-1">{opcion.texto}</span>
                    </label>
                  ));
                } catch (error) {
                  console.error(`❌ Error parseando opciones para pregunta ${index + 1}:`, error);
                  return <p className="text-red-500">Error al cargar las opciones</p>;
                }
              })()}
            </div>
          )}
          
          {pregunta.tipo === 'abierta' && (
            <div>
              <p className="text-sm text-gray-600 mb-3">Escribe tu respuesta:</p>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={4}
                placeholder="Escribe tu respuesta aquí..."
                {...register(`respuestas.${index}.respuesta`)}
              />
            </div>
          )}
          
          {pregunta.tipo !== 'test' && pregunta.tipo !== 'abierta' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-yellow-700">Tipo de pregunta no soportado: {pregunta.tipo}</p>
            </div>
          )}
        </div>
        
        {errors.respuestas?.[index]?.respuesta && (
          <p className="text-red-500 text-sm mt-1">
            {errors.respuestas[index].respuesta.message}
          </p>
        )}
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando oferta...</p>
        </div>
      </div>
    );
  }

  if (!oferta) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Oferta no encontrada</h2>
          <p className="text-gray-600 mb-4">La oferta que buscas no existe o ha sido eliminada.</p>
          <button
            onClick={() => router.push('/dashboard/ofertas')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Volver a ofertas
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header de la oferta */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-lg p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">{oferta.titulo}</h1>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              {oferta.modalidad}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Empresa</h3>
              <p className="text-gray-700">{oferta.Empresa?.nombreEmpresa}</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Ubicación</h3>
              <p className="text-gray-700">{oferta.ubicacionNombres?.completo || 'Ubicación no especificada'}</p>
            </div>
            
            {oferta.salario && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Salario</h3>
                <p className="text-gray-700">{oferta.salario}</p>
              </div>
            )}
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Documentos requeridos</h3>
              <div className="space-y-1">
                {oferta.requiereCV && <p className="text-gray-700">• Currículum Vitae</p>}
                {oferta.requiereCarta && <p className="text-gray-700">• Carta de presentación</p>}
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Descripción</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{oferta.descripcion}</p>
          </div>
          
          {oferta.requisitos && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Requisitos</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{oferta.requisitos}</p>
            </div>
          )}
        </motion.div>

        {/* Formulario de postulación */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Postular a esta oferta</h2>
          
          <form onSubmit={handleSubmit((data) => {
            return onSubmit(data);
          }, (errors) => {
            console.log('❌ Errores de validación:', errors);
          })} className="space-y-6">
            {/* Documentos */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Documentos</h3>
              
              {oferta.requiereCV && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Currículum Vitae *
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    {...register('cv')}
                  />
                  <p className="text-xs text-gray-500 mt-1">Formatos aceptados: PDF, DOC, DOCX</p>
                </div>
              )}
              
              {oferta.requiereCarta && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Carta de presentación *
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    {...register('carta')}
                  />
                  <p className="text-xs text-gray-500 mt-1">Formatos aceptados: PDF, DOC, DOCX</p>
                </div>
              )}
            </div>

            {/* Preguntas */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Preguntas de la oferta ({oferta.PreguntaOferta?.length || 0})
              </h3>
              
              {!oferta.PreguntaOferta || oferta.PreguntaOferta.length === 0 ? (
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-gray-600">Esta oferta no tiene preguntas adicionales.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {oferta.PreguntaOferta.map((pregunta, index) => {
                    return renderPregunta(pregunta, index);
                  })}
                </div>
              )}
            </div>

            {/* Botón submit */}
            <div className="pt-6 border-t border-gray-200">
              {(() => {
                const isDisabled = isSubmitting || uploadingFiles || success;
                return (
                  <button
                    type="submit"
                    disabled={isDisabled}
                    onClick={() => {
                    }}
                    className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {(isSubmitting || uploadingFiles) && (
                      <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                      </svg>
                    )}
                    {isSubmitting || uploadingFiles
                      ? 'Enviando postulación...'
                      : success
                        ? '¡Postulación enviada!'
                        : 'Enviar postulación'}
                  </button>
                );
              })()}
              
              {submitError && (
                <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm text-center">{submitError}</p>
                </div>
              )}
              
              {success && (
                <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-600 text-sm text-center">
                    ¡Postulación enviada con éxito! Redirigiendo...
                  </p>
                </div>
              )}
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
} 