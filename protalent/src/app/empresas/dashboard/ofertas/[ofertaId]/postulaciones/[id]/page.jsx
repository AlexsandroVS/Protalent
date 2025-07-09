'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { FiArrowLeft, FiUser, FiMail, FiPhone, FiFileText, FiDownload, FiEye, FiCheckCircle, FiXCircle, FiClock, FiCalendar, FiMapPin, FiBriefcase, FiMessageSquare, FiStar, FiThumbsUp, FiThumbsDown } from 'react-icons/fi';
import { useAuth } from '../../../../../../context/auth/AuthContext';
import api from '../../../../../../lib/axios';

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

  const { ofertaId, id: postulacionId } = params;

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
  const cambiarEstadoPostulacion = async (nuevoEstado) => {
    try {
      setGuardando(true);
      await api.put(`/api/postulaciones/${postulacionId}/estado`, { 
        estado: nuevoEstado,
        comentarios: evaluacion.comentarios,
        puntuacion: evaluacion.puntuacion,
        recomendacion: evaluacion.recomendacion
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

  // Formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return 'No especificada';
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
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
  const oferta = postulacion.Oferta;

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
            <h1 className="text-2xl font-bold text-gray-900">Evaluación de Postulación</h1>
            <p className="text-gray-600">{oferta?.titulo}</p>
          </div>
        </div>

        {/* Estado actual y acciones rápidas */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Estado actual</h2>
              <div className="flex items-center mt-2">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getEstadoColor(postulacion.estado)}`}>
                  {getEstadoIcon(postulacion.estado)}
                  {postulacion.estado}
                </span>
                <span className="ml-4 text-sm text-gray-500">
                  Postuló el {formatDate(postulacion.createdAt)}
                </span>
              </div>
            </div>
            
            <div className="flex space-x-3">
              {postulacion.estado === 'pendiente' && (
                <>
                  <button
                    onClick={() => cambiarEstadoPostulacion('revisada')}
                    disabled={guardando}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {guardando ? 'Guardando...' : 'Marcar como Revisada'}
                  </button>
                </>
              )}
              
              {postulacion.estado === 'revisada' && (
                <>
                  <button
                    onClick={() => cambiarEstadoPostulacion('aceptada')}
                    disabled={guardando}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center"
                  >
                    <FiThumbsUp className="mr-2" />
                    {guardando ? 'Guardando...' : 'Aceptar'}
                  </button>
                  <button
                    onClick={() => cambiarEstadoPostulacion('rechazada')}
                    disabled={guardando}
                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center"
                  >
                    <FiThumbsDown className="mr-2" />
                    {guardando ? 'Guardando...' : 'Rechazar'}
                  </button>
                </>
              )}
              
              {postulacion.estado === 'aceptada' && (
                <span className="inline-flex items-center px-3 py-2 rounded-md text-sm font-medium bg-green-100 text-green-800">
                  <FiCheckCircle className="mr-2" />
                  Postulación Aceptada
                </span>
              )}
              
              {postulacion.estado === 'rechazada' && (
                <span className="inline-flex items-center px-3 py-2 rounded-md text-sm font-medium bg-red-100 text-red-800">
                  <FiXCircle className="mr-2" />
                  Postulación Rechazada
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Información del estudiante */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Información del candidato</h2>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <FiUser className="mr-3 text-gray-400" />
                <div>
                  <p className="font-medium">{estudiante?.Usuario?.nombre || 'Nombre no disponible'}</p>
                  <p className="text-sm text-gray-500">Estudiante</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <FiMail className="mr-3 text-gray-400" />
                <div>
                  <p className="font-medium">{estudiante?.Usuario?.email || 'Email no disponible'}</p>
                  <p className="text-sm text-gray-500">Email</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <FiBriefcase className="mr-3 text-gray-400" />
                <div>
                  <p className="font-medium">{estudiante?.carrera || 'Carrera no especificada'}</p>
                  <p className="text-sm text-gray-500">Carrera</p>
                </div>
              </div>
              
              {estudiante?.tipo && (
                <div className="flex items-center">
                  <FiUser className="mr-3 text-gray-400" />
                  <div>
                    <p className="font-medium">{estudiante.tipo}</p>
                    <p className="text-sm text-gray-500">Tipo</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Documentos */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Documentos</h2>
            
            <div className="space-y-4">
              {postulacion.cvUrl && (
                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <FiFileText className="mr-3 text-blue-500" />
                    <div>
                      <p className="font-medium">Currículum Vitae</p>
                      <p className="text-sm text-gray-500">Documento subido</p>
                    </div>
                  </div>
                  <button
                    onClick={() => window.open(postulacion.cvUrl, '_blank')}
                    className="text-blue-600 hover:text-blue-800"
                    title="Ver CV"
                  >
                    <FiEye className="h-4 w-4" />
                  </button>
                </div>
              )}
              
              {postulacion.cartaUrl && (
                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <FiFileText className="mr-3 text-green-500" />
                    <div>
                      <p className="font-medium">Carta de presentación</p>
                      <p className="text-sm text-gray-500">Documento subido</p>
                    </div>
                  </div>
                  <button
                    onClick={() => window.open(postulacion.cartaUrl, '_blank')}
                    className="text-green-600 hover:text-green-800"
                    title="Ver carta"
                  >
                    <FiEye className="h-4 w-4" />
                  </button>
                </div>
              )}
              
              {!postulacion.cvUrl && !postulacion.cartaUrl && (
                <p className="text-gray-500 text-center py-4">No se subieron documentos</p>
              )}
            </div>
          </div>

          {/* Evaluación rápida */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Evaluación rápida</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Puntuación general
                </label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setEvaluacion(prev => ({ ...prev, puntuacion: star }))}
                      className={`text-2xl ${
                        star <= evaluacion.puntuacion 
                          ? 'text-yellow-400' 
                          : 'text-gray-300'
                      } hover:text-yellow-400 transition-colors`}
                    >
                      <FiStar />
                    </button>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {evaluacion.puntuacion > 0 ? `${evaluacion.puntuacion}/5 estrellas` : 'Sin puntuación'}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recomendación
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={evaluacion.recomendacion}
                  onChange={(e) => setEvaluacion(prev => ({ ...prev, recomendacion: e.target.value }))}
                >
                  <option value="">Seleccionar recomendación</option>
                  <option value="altamente_recomendado">Altamente recomendado</option>
                  <option value="recomendado">Recomendado</option>
                  <option value="neutral">Neutral</option>
                  <option value="no_recomendado">No recomendado</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Respuestas a las preguntas */}
        {postulacion.RespuestaPostulacion && postulacion.RespuestaPostulacion.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Respuestas a las preguntas</h2>
            
            <div className="space-y-4">
              {postulacion.RespuestaPostulacion.map((respuesta, index) => (
                <div key={respuesta.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="mb-3">
                    <h3 className="font-medium text-gray-900">
                      Pregunta {index + 1}
                    </h3>
                    <p className="text-gray-600 mt-1">
                      {respuesta.PreguntaOferta?.pregunta || 'Pregunta no disponible'}
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-3">
                    <h4 className="font-medium text-gray-700 mb-2">Respuesta:</h4>
                    <p className="text-gray-800">{respuesta.respuesta}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Comentarios y evaluación final */}
        <div className="bg-white rounded-lg shadow p-6 mt-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Evaluación y comentarios</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comentarios de evaluación
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                placeholder="Escribe tus comentarios sobre esta postulación, fortalezas, áreas de mejora, etc..."
                value={evaluacion.comentarios}
                onChange={(e) => setEvaluacion(prev => ({ ...prev, comentarios: e.target.value }))}
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => router.push(`/empresas/dashboard/ofertas/${ofertaId}/postulaciones`)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={guardarEvaluacion}
                disabled={guardando}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {guardando ? 'Guardando...' : 'Guardar evaluación'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 