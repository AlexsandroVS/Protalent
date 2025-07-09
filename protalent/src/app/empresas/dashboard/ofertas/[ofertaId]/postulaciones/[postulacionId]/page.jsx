'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  FiArrowLeft, 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiFileText, 
  FiDownload, 
  FiEye, 
  FiCheckCircle, 
  FiXCircle, 
  FiClock, 
  FiCalendar, 
  FiMapPin, 
  FiBriefcase,
  FiStar,
  FiMessageSquare,
  FiThumbsUp,
  FiThumbsDown,
  FiCheck,
  FiX
} from 'react-icons/fi';
import { useAuth } from '../../../../../../../context/auth/AuthContext';
import api from '../../../../../../../lib/axios';

export default function PostulacionDetallePage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const [postulacion, setPostulacion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [evaluacion, setEvaluacion] = useState({
    comentarios: '',
    puntuacion: 0,
    recomendacion: ''
  });
  const [guardando, setGuardando] = useState(false);

  const { ofertaId, postulacionId } = params;

  // Obtener detalles de la postulación
  useEffect(() => {
    const fetchPostulacion = async () => {
      try {
        setLoading(true);
        
        // Verificar que el usuario sea una empresa
        if (!user || user.rol !== 'empresa') {
          console.error('Usuario no es una empresa:', user);
          return;
        }

        // Obtener la postulación con todos sus datos
        const response = await api.get(`/api/postulaciones/${postulacionId}`);
        console.log('[PostulacionDetallePage] Datos de la postulación:', response.data);
        console.log('[PostulacionDetallePage] RespuestaPostulacions:', response.data.RespuestaPostulacions);
        console.log('[PostulacionDetallePage] Ofertum:', response.data.Ofertum);
        console.log('[PostulacionDetallePage] Estudiante:', response.data.Estudiante);
        setPostulacion(response.data);
        
        // Cargar comentarios existentes
        if (response.data.comentarios) {
          setEvaluacion(prev => ({
            ...prev,
            comentarios: response.data.comentarios
          }));
        }
        
      } catch (error) {
        console.error('Error al obtener postulación:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user && postulacionId) {
      fetchPostulacion();
    }
  }, [user, postulacionId]);

  // Cambiar estado de postulación
  const cambiarEstado = async (nuevoEstado) => {
    try {
      setGuardando(true);
      await api.put(`/api/postulaciones/${postulacionId}/estado`, { 
        estado: nuevoEstado 
      });
      
      setPostulacion(prev => ({ ...prev, estado: nuevoEstado }));
    } catch (error) {
      console.error('Error al cambiar estado:', error);
    } finally {
      setGuardando(false);
    }
  };

  // Guardar evaluación
  const guardarEvaluacion = async () => {
    try {
      setGuardando(true);
      await api.put(`/api/postulaciones/${postulacionId}/estado`, {
        estado: postulacion.estado,
        comentarios: evaluacion.comentarios,
        puntuacion: evaluacion.puntuacion,
        recomendacion: evaluacion.recomendacion
      });
      
      setPostulacion(prev => ({
        ...prev,
        comentarios: evaluacion.comentarios,
        puntuacion: evaluacion.puntuacion,
        recomendacion: evaluacion.recomendacion
      }));
    } catch (error) {
      console.error('Error al guardar evaluación:', error);
    } finally {
      setGuardando(false);
    }
  };

  // Descargar archivo
  const descargarArchivo = async (url, nombreArchivo) => {
    try {
      // Extraer el public_id de la URL de Cloudinary
      const urlParts = url.split('/');
      const publicId = urlParts[urlParts.length - 1].split('.')[0];
      
      // Usar el endpoint del backend para descarga
      const response = await api.get(`/api/upload/download/${publicId}`, {
        responseType: 'blob'
      });
      
      const blob = new Blob([response.data]);
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = nombreArchivo;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Error al descargar archivo:', error);
      // Fallback: intentar descargar directamente desde la URL
      try {
        const response = await fetch(url);
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = nombreArchivo;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);
      } catch (fallbackError) {
        console.error('Error en fallback de descarga:', fallbackError);
        alert('Error al descargar el archivo');
      }
    }
  };

  // Verificar si la respuesta es correcta
  const esRespuestaCorrecta = (respuesta, pregunta) => {
    if (pregunta.tipo === 'test') {
      try {
        const opciones = JSON.parse(pregunta.opciones);
        const opcionCorrecta = opciones.find(op => op.correcta);
        console.log('[esRespuestaCorrecta] Respuesta:', respuesta);
        console.log('[esRespuestaCorrecta] Opción correcta:', opcionCorrecta?.texto);
        console.log('[esRespuestaCorrecta] Es correcta:', respuesta === opcionCorrecta?.texto);
        return respuesta === opcionCorrecta?.texto;
      } catch (error) {
        console.error('[esRespuestaCorrecta] Error parsing opciones:', error);
        return false;
      }
    }
    return null; // Para preguntas abiertas no hay respuesta correcta
  };

  // Obtener icono del estado
  const getEstadoIcon = (estado) => {
    switch (estado) {
      case 'pendiente':
        return <FiClock className="mr-1" />;
      case 'revisada':
        return <FiEye className="mr-1" />;
      case 'aceptada':
        return <FiCheckCircle className="mr-1" />;
      case 'rechazada':
        return <FiXCircle className="mr-1" />;
      default:
        return <FiClock className="mr-1" />;
    }
  };

  // Obtener color del estado
  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800';
      case 'revisada':
        return 'bg-blue-100 text-blue-800';
      case 'aceptada':
        return 'bg-green-100 text-green-800';
      case 'rechazada':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Calcular estadísticas de respuestas
  const calcularEstadisticas = () => {
    console.log('[calcularEstadisticas] Postulación:', postulacion);
    console.log('[calcularEstadisticas] RespuestaPostulacions:', postulacion?.RespuestaPostulacions);
    
    if (!postulacion?.RespuestaPostulacions) return { correctas: 0, total: 0, porcentaje: 0 };
    
    const preguntasTest = postulacion.RespuestaPostulacions.filter(
      resp => resp.PreguntaOfertum.tipo === 'test'
    );
    
    console.log('[calcularEstadisticas] Preguntas test:', preguntasTest);
    
    const correctas = preguntasTest.filter(resp => 
      esRespuestaCorrecta(resp.respuesta, resp.PreguntaOfertum)
    ).length;
    
    console.log('[calcularEstadisticas] Correctas:', correctas, 'Total:', preguntasTest.length);
    
    return {
      correctas,
      total: preguntasTest.length,
      porcentaje: preguntasTest.length > 0 ? Math.round((correctas / preguntasTest.length) * 100) : 0
    };
  };

  const estadisticas = calcularEstadisticas();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!postulacion) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Postulación no encontrada</h2>
          <p className="text-gray-600 mb-4">La postulación que buscas no existe o ha sido eliminada.</p>
          <button
            onClick={() => router.push(`/empresas/dashboard/ofertas/${ofertaId}/postulaciones`)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Volver a postulaciones
          </button>
        </div>
      </div>
    );
  }

  const estudiante = postulacion.Estudiante;
  const oferta = postulacion.Ofertum;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-6">
          <button
            onClick={() => router.push(`/empresas/dashboard/ofertas/${ofertaId}/postulaciones`)}
            className="mr-4 p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Detalle de Postulación</h1>
            <p className="text-gray-600">{oferta?.titulo}</p>
          </div>
        </div>
      </div>

      {/* Debug Info */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold text-yellow-800 mb-2">Debug Info</h3>
        <div className="text-sm text-yellow-700">
          <p><strong>Postulación ID:</strong> {postulacion?.id}</p>
          <p><strong>RespuestaPostulacions:</strong> {postulacion?.RespuestaPostulacions ? `${postulacion.RespuestaPostulacions.length} respuestas` : 'No hay respuestas'}</p>
          <p><strong>Ofertum:</strong> {postulacion?.Ofertum ? 'Sí' : 'No'}</p>
          <p><strong>Estudiante:</strong> {postulacion?.Estudiante ? 'Sí' : 'No'}</p>
          <p><strong>Token:</strong> {typeof window !== 'undefined' ? localStorage.getItem('token') ? 'Sí' : 'No' : 'N/A'}</p>
        </div>
        
        {/* Raw Data */}
        <details className="mt-4">
          <summary className="cursor-pointer font-medium">Ver datos raw</summary>
          <pre className="mt-2 text-xs bg-yellow-100 p-2 rounded overflow-auto max-h-40">
            {JSON.stringify(postulacion, null, 2)}
          </pre>
        </details>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Información del candidato */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Información del Candidato</h2>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <FiUser className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-900">
                    {estudiante?.Usuario?.nombre || 'Estudiante'}
                  </div>
                  <div className="text-sm text-gray-500">
                    {estudiante?.Usuario?.email}
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <FiBriefcase className="mr-2 text-gray-400" />
                  <span>{estudiante?.carrera || 'Carrera no especificada'}</span>
                </div>
                {estudiante?.telefono && (
                  <div className="flex items-center">
                    <FiPhone className="mr-2 text-gray-400" />
                    <span>{estudiante.telefono}</span>
                  </div>
                )}
                <div className="flex items-center">
                  <FiCalendar className="mr-2 text-gray-400" />
                  <span>Postuló el {new Date(postulacion.createdAt).toLocaleDateString('es-ES')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Respuestas a las preguntas */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Respuestas del Candidato</h2>
            
            {postulacion.RespuestaPostulacions && postulacion.RespuestaPostulacions.length > 0 ? (
              <div className="space-y-6">
                {postulacion.RespuestaPostulacions.map((respuesta, index) => {
                  const pregunta = respuesta.PreguntaOfertum;
                  const esCorrecta = esRespuestaCorrecta(respuesta.respuesta, pregunta);
                  
                  return (
                    <div key={respuesta.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-sm font-medium text-gray-900">
                          Pregunta {index + 1}: {pregunta.pregunta}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          pregunta.tipo === 'test' 
                            ? esCorrecta 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {pregunta.tipo === 'test' 
                            ? esCorrecta ? <FiCheck className="inline" /> : <FiX className="inline" />
                            : pregunta.tipo
                          }
                        </span>
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-sm text-gray-700">{respuesta.respuesta}</p>
                      </div>
                      
                      {pregunta.tipo === 'test' && (
                        <div className="mt-2 text-xs text-gray-500">
                          {esCorrecta ? '✅ Respuesta correcta' : '❌ Respuesta incorrecta'}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No hay respuestas disponibles</p>
                <p className="text-sm text-gray-400 mt-2">Debug: RespuestaPostulacions = {JSON.stringify(postulacion.RespuestaPostulacions)}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 