'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { FiArrowLeft, FiUser, FiMail, FiPhone, FiFileText, FiDownload, FiEye, FiCheckCircle, FiXCircle, FiClock, FiCalendar, FiMapPin, FiBriefcase, FiStar } from 'react-icons/fi';
import { useAuth } from '../../../../../context/auth/AuthContext';
import api from '../../../../../lib/axios';

export default function PostulacionesPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const [oferta, setOferta] = useState(null);
  const [postulaciones, setPostulaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    estado: 'todos',
    fecha: 'todos',
    orden: 'rendimiento' // 'rendimiento', 'fecha', 'nombre'
  });

  const ofertaId = params.ofertaId;

  // Obtener oferta y postulaciones
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('[PostulacionesPage] Iniciando fetchData con ofertaId:', ofertaId);
        setLoading(true);
        
        // Verificar que el usuario sea una empresa
        if (!user || user.rol !== 'empresa') {
          console.error('Usuario no es una empresa:', user);
          return;
        }

        console.log('[PostulacionesPage] Obteniendo oferta...');
        // Obtener la oferta
        const ofertaResponse = await api.get(`/api/ofertas/${ofertaId}`);
        console.log('[PostulacionesPage] Oferta obtenida:', ofertaResponse.data);
        setOferta(ofertaResponse.data);

        console.log('[PostulacionesPage] Obteniendo postulaciones...');
        // Obtener postulaciones de la oferta
        const postulacionesResponse = await api.get(`/api/postulaciones/oferta/${ofertaId}`);
        console.log('[PostulacionesPage] Postulaciones obtenidas:', postulacionesResponse.data);
        setPostulaciones(postulacionesResponse.data);
        
      } catch (error) {
        console.error('[PostulacionesPage] Error al obtener datos:', error);
        console.error('[PostulacionesPage] Error response:', error.response?.data);
      } finally {
        console.log('[PostulacionesPage] Finalizando fetchData');
        setLoading(false);
      }
    };

    if (user && ofertaId) {
      console.log('[PostulacionesPage] Ejecutando fetchData');
      fetchData();
    } else {
      console.log('[PostulacionesPage] No ejecutando fetchData - user:', !!user, 'ofertaId:', ofertaId);
    }
  }, [user, ofertaId]);

  // Calcular rendimiento de cada postulación
  const calcularRendimiento = (postulacion) => {
    if (!postulacion.RespuestaPostulacions || postulacion.RespuestaPostulacions.length === 0) {
      return 0;
    }
    
    const preguntasTest = postulacion.RespuestaPostulacions.filter(
      resp => resp.PreguntaOfertum.tipo === 'test'
    );
    
    if (preguntasTest.length === 0) return 0;
    
    const correctas = preguntasTest.filter(resp => {
      try {
        const opciones = JSON.parse(resp.PreguntaOfertum.opciones);
        const opcionCorrecta = opciones.find(op => op.correcta);
        return resp.respuesta === opcionCorrecta?.texto;
      } catch (error) {
        return false;
      }
    }).length;
    
    return Math.round((correctas / preguntasTest.length) * 100);
  };

  // Ordenar postulaciones según el filtro seleccionado
  const ordenarPostulaciones = (postulaciones) => {
    return [...postulaciones].sort((a, b) => {
      switch (filters.orden) {
        case 'rendimiento':
          const rendimientoA = calcularRendimiento(a);
          const rendimientoB = calcularRendimiento(b);
          return rendimientoB - rendimientoA; // Orden descendente
        case 'fecha':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'nombre':
          const nombreA = a.Estudiante?.Usuario?.nombre || '';
          const nombreB = b.Estudiante?.Usuario?.nombre || '';
          return nombreA.localeCompare(nombreB);
        default:
          return 0;
      }
    });
  };

  // Filtrar y ordenar postulaciones
  const filteredPostulaciones = ordenarPostulaciones(
    postulaciones.filter(postulacion => {
      const matchesFilters = 
        (filters.estado === 'todos' || postulacion.estado === filters.estado);
      
      return matchesFilters;
    })
  );

  // Cambiar estado de postulación
  const cambiarEstadoPostulacion = async (postulacionId, nuevoEstado) => {
    try {
      await api.put(`/api/postulaciones/${postulacionId}/estado`, { 
        estado: nuevoEstado 
      });
      
      setPostulaciones(postulaciones.map(post => 
        post.id === postulacionId 
          ? { ...post, estado: nuevoEstado } 
          : post
      ));
    } catch (error) {
      console.error('Error al cambiar estado:', error);
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

  if (!oferta) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Oferta no encontrada</h2>
          <p className="text-gray-600 mb-4">La oferta que buscas no existe o ha sido eliminada.</p>
          <button
            onClick={() => router.push('/empresas/dashboard/ofertas')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Volver a ofertas
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-6">
          <button
            onClick={() => router.push('/empresas/dashboard/ofertas')}
            className="mr-4 p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Postulaciones</h1>
            <p className="text-gray-600">{oferta.titulo}</p>
          </div>
        </div>

        {/* Información de la oferta */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Detalles de la oferta</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <FiBriefcase className="mr-2" />
                  <span>{oferta.modalidad}</span>
                </div>
                <div className="flex items-center">
                  <FiMapPin className="mr-2" />
                  <span>{oferta.ubicacionNombres?.completo || 'Ubicación no especificada'}</span>
                </div>
                {oferta.salario && (
                  <div className="flex items-center">
                    <FiCalendar className="mr-2" />
                    <span>Salario: {oferta.salario}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Estadísticas</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div>Total de postulaciones: <span className="font-semibold">{postulaciones.length}</span></div>
                <div>Pendientes: <span className="font-semibold">{postulaciones.filter(p => p.estado === 'pendiente').length}</span></div>
                <div>Revisadas: <span className="font-semibold">{postulaciones.filter(p => p.estado === 'revisada').length}</span></div>
                <div>Aceptadas: <span className="font-semibold">{postulaciones.filter(p => p.estado === 'aceptada').length}</span></div>
                <div>Rechazadas: <span className="font-semibold">{postulaciones.filter(p => p.estado === 'rechazada').length}</span></div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Filtros</h3>
              <div className="space-y-3">
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={filters.estado}
                  onChange={(e) => setFilters({...filters, estado: e.target.value})}
                >
                  <option value="todos">Todos los estados</option>
                  <option value="pendiente">Pendientes</option>
                  <option value="revisada">Revisadas</option>
                  <option value="aceptada">Aceptadas</option>
                  <option value="rechazada">Rechazadas</option>
                </select>
                
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={filters.orden}
                  onChange={(e) => setFilters({...filters, orden: e.target.value})}
                >
                  <option value="rendimiento">Ordenar por rendimiento</option>
                  <option value="fecha">Ordenar por fecha</option>
                  <option value="nombre">Ordenar por nombre</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de postulaciones */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          {filteredPostulaciones.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {filteredPostulaciones.map((postulacion) => (
                <li 
                  key={postulacion.id} 
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => router.push(`/empresas/dashboard/ofertas/${ofertaId}/postulaciones/${postulacion.id}`)}
                >
                  <div className="px-4 py-6 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                          <FiUser className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-blue-600">
                            {postulacion.Estudiante?.Usuario?.nombre || 'Estudiante'}
                          </div>
                          <div className="text-sm text-gray-500">
                            <div className="flex items-center">
                              <FiMail className="mr-1" />
                              {postulacion.Estudiante?.Usuario?.email || 'Email no disponible'}
                            </div>
                            <div className="flex items-center">
                              <FiBriefcase className="mr-1" />
                              {postulacion.Estudiante?.carrera || 'Carrera no especificada'}
                            </div>
                          </div>
                          <div className="text-sm text-gray-500">
                            <div className="flex items-center">
                              <FiCalendar className="mr-1" />
                              Postuló el {formatDate(postulacion.createdAt)}
                            </div>
                            {/* Indicador de rendimiento */}
                            {postulacion.RespuestaPostulacions && postulacion.RespuestaPostulacions.length > 0 && (
                              <div className="flex items-center mt-1">
                                <FiStar className="mr-1 text-yellow-500" />
                                <span className="text-xs font-medium">
                                  Rendimiento: {calcularRendimiento(postulacion)}%
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4" onClick={(e) => e.stopPropagation()}>
                        <div className="text-sm text-gray-500">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEstadoColor(postulacion.estado)}`}>
                            {getEstadoIcon(postulacion.estado)}
                            {postulacion.estado}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {/* Indicador de clickeable */}
                          <FiEye className="h-4 w-4 text-gray-400" title="Click para ver detalle" />
                          
                          {/* Ver respuestas */}
                          {postulacion.RespuestaPostulacions && postulacion.RespuestaPostulacions.length > 0 && (
                            <button
                              onClick={() => router.push(`/empresas/dashboard/ofertas/${ofertaId}/postulaciones/${postulacion.id}`)}
                              className="text-green-600 hover:text-green-800"
                              title="Ver respuestas"
                            >
                              <FiEye className="h-4 w-4" />
                            </button>
                          )}
                          
                          {/* Ver documentos */}
                          {(postulacion.cvUrl || postulacion.cartaUrl) && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const urls = [];
                                if (postulacion.cvUrl) urls.push(postulacion.cvUrl);
                                if (postulacion.cartaUrl) urls.push(postulacion.cartaUrl);
                                urls.forEach(url => window.open(url, '_blank'));
                              }}
                              className="text-blue-600 hover:text-blue-800"
                              title="Ver documentos"
                            >
                              <FiFileText className="h-4 w-4" />
                            </button>
                          )}
                          
                          {/* Cambiar estado */}
                          <select
                            className="text-xs border border-gray-300 rounded px-2 py-1"
                            value={postulacion.estado}
                            onChange={(e) => {
                              e.stopPropagation();
                              cambiarEstadoPostulacion(postulacion.id, e.target.value);
                            }}
                          >
                            <option value="pendiente">Pendiente</option>
                            <option value="revisada">Revisada</option>
                            <option value="aceptada">Aceptada</option>
                            <option value="rechazada">Rechazada</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-8 text-center">
              <div className="text-gray-500">
                <FiUser className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-lg font-medium">No hay postulaciones</p>
                <p className="text-sm">
                  {filters.estado === 'todos' 
                    ? 'Aún no hay postulaciones para esta oferta.' 
                    : `No hay postulaciones con estado "${filters.estado}".`
                  }
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 