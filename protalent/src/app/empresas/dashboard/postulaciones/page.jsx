'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FiUser, FiMail, FiPhone, FiFileText, FiSearch, FiFilter, FiCheck, FiX, FiClock, FiCalendar, FiBriefcase, FiMapPin, FiChevronDown } from 'react-icons/fi';

export default function PostulacionesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const ofertaId = searchParams.get('oferta');
  
  const [postulaciones, setPostulaciones] = useState([]);
  const [ofertas, setOfertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    estado: 'todos',
    oferta: ofertaId || 'todas',
    fecha: 'recientes',
  });
  const [showFiltros, setShowFiltros] = useState(false);

  // Datos simulados
  useEffect(() => {
    const timer = setTimeout(() => {
      // Datos de ofertas
      const ofertasData = [
        { id: '1', titulo: 'Desarrollador Frontend' },
        { id: '2', titulo: 'Diseñador UX/UI' },
        { id: '3', titulo: 'Especialista en Marketing Digital' },
        { id: '4', titulo: 'Desarrollador Backend' },
        { id: '5', titulo: 'Community Manager' },
      ];
      setOfertas(ofertasData);

      // Datos de postulaciones
      const postulacionesData = [
        {
          id: 'p1',
          candidato: {
            nombre: 'Juan Pérez',
            email: 'juan.perez@email.com',
            telefono: '+51 987 654 321',
            carrera: 'Ingeniería de Software',
            ciclo: '8vo',
            cv: '/cvs/juan_perez.pdf',
          },
          oferta: {
            id: '1',
            titulo: 'Desarrollador Frontend',
            empresa: 'Tech Solutions S.A.',
            tipo: 'Tiempo Completo',
            ubicacion: 'Remoto',
          },
          fechaPostulacion: '2023-06-18T14:30:00',
          estado: 'nueva',
          puntaje: 92,
          comentarios: 'Buen perfil, experiencia en React',
        },
        {
          id: 'p2',
          candidato: {
            nombre: 'María García',
            email: 'maria.garcia@email.com',
            telefono: '+51 987 123 456',
            carrera: 'Diseño Gráfico',
            ciclo: '7mo',
            cv: '/cvs/maria_garcia.pdf',
          },
          oferta: {
            id: '2',
            titulo: 'Diseñador UX/UI',
            empresa: 'Digital Creators',
            tipo: 'Medio Tiempo',
            ubicacion: 'Lima, Perú',
          },
          fechaPostulacion: '2023-06-17T10:15:00',
          estado: 'revisada',
          puntaje: 85,
          comentarios: 'Portafolio interesante',
        },
        {
          id: 'p3',
          candidato: {
            nombre: 'Carlos López',
            email: 'carlos.lopez@email.com',
            telefono: '+51 987 789 123',
            carrera: 'Marketing Digital',
            ciclo: '6to',
            cv: '/cvs/carlos_lopez.pdf',
          },
          oferta: {
            id: '3',
            titulo: 'Especialista en Marketing Digital',
            empresa: 'Growth Marketing',
            tipo: 'Tiempo Completo',
            ubicacion: 'Arequipa, Perú',
          },
          fechaPostulacion: '2023-06-16T16:45:00',
          estado: 'seleccionado',
          puntaje: 95,
          comentarios: 'Excelente perfil, experiencia comprobada',
        },
        {
          id: 'p4',
          candidato: {
            nombre: 'Ana Torres',
            email: 'ana.torres@email.com',
            telefono: '+51 987 456 789',
            carrera: 'Ingeniería de Sistemas',
            ciclo: '9no',
            cv: '/cvs/ana_torres.pdf',
          },
          oferta: {
            id: '1',
            titulo: 'Desarrollador Frontend',
            empresa: 'Tech Solutions S.A.',
            tipo: 'Tiempo Completo',
            ubicacion: 'Remoto',
          },
          fechaPostulacion: '2023-06-15T11:20:00',
          estado: 'rechazada',
          puntaje: 78,
          comentarios: 'Falta experiencia en proyectos similares',
        },
      ];

      // Si hay un ofertaId en la URL, filtrar por esa oferta
      const filteredPostulaciones = ofertaId 
        ? postulacionesData.filter(p => p.oferta.id === ofertaId)
        : postulacionesData;

      setPostulaciones(filteredPostulaciones);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [ofertaId]);

  // Filtrar postulaciones
  const filteredPostulaciones = postulaciones.filter(postulacion => {
    const matchesSearch = 
      postulacion.candidato.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      postulacion.candidato.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      postulacion.candidato.carrera.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilters = 
      (filters.estado === 'todos' || postulacion.estado === filters.estado) &&
      (filters.oferta === 'todas' || postulacion.oferta.id === filters.oferta);
    
    return matchesSearch && matchesFilters;
  });

  // Cambiar estado de la postulación
  const cambiarEstadoPostulacion = (id, nuevoEstado) => {
    setPostulaciones(postulaciones.map(post => 
      post.id === id ? { ...post, estado: nuevoEstado } : post
    ));
  };

  // Formatear fecha
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  // Obtener clase de estado
  const getEstadoClass = (estado) => {
    switch (estado) {
      case 'nueva':
        return 'bg-blue-100 text-blue-800';
      case 'revisada':
        return 'bg-yellow-100 text-yellow-800';
      case 'seleccionado':
        return 'bg-green-100 text-green-800';
      case 'rechazada':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Obtener texto de estado
  const getEstadoText = (estado) => {
    switch (estado) {
      case 'nueva':
        return 'Nueva';
      case 'revisada':
        return 'Revisada';
      case 'seleccionado':
        return 'Seleccionado';
      case 'rechazada':
        return 'Rechazada';
      default:
        return estado;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Postulaciones</h1>
            {ofertaId && (
              <p className="text-sm text-gray-500 mt-1">
                Mostrando postulaciones para: {postulaciones[0]?.oferta.titulo || 'Oferta no encontrada'}
              </p>
            )}
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <button
              onClick={() => setShowFiltros(!showFiltros)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FiFilter className="mr-2 h-4 w-4" />
              Filtros
            </button>
            {ofertaId && (
              <button
                onClick={() => router.push('/empresas/dashboard/postulaciones')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Ver todas las postulaciones
              </button>
            )}
          </div>
        </div>

        {/* Filtros */}
        {showFiltros && (
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiSearch className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md h-10 border p-2"
                    placeholder="Buscar postulantes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <select
                  id="estado"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md h-10 border"
                  value={filters.estado}
                  onChange={(e) => setFilters({...filters, estado: e.target.value})}
                >
                  <option value="todos">Todos los estados</option>
                  <option value="nueva">Nuevas</option>
                  <option value="revisada">Revisadas</option>
                  <option value="seleccionado">Seleccionadas</option>
                  <option value="rechazada">Rechazadas</option>
                </select>
              </div>
              <div>
                <label htmlFor="oferta" className="block text-sm font-medium text-gray-700 mb-1">Oferta</label>
                <select
                  id="oferta"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md h-10 border"
                  value={filters.oferta}
                  onChange={(e) => setFilters({...filters, oferta: e.target.value})}
                >
                  <option value="todas">Todas las ofertas</option>
                  {ofertas.map((oferta) => (
                    <option key={oferta.id} value={oferta.id}>
                      {oferta.titulo}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Lista de postulaciones */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          {filteredPostulaciones.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {filteredPostulaciones.map((postulacion) => (
                <li key={postulacion.id} className="hover:bg-gray-50">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                          <FiUser className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{postulacion.candidato.nombre}</div>
                          <div className="text-sm text-gray-500">{postulacion.candidato.carrera} • {postulacion.candidato.ciclo}</div>
                        </div>
                      </div>
                      <div className="ml-2 flex-shrink-0">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getEstadoClass(postulacion.estado)}`}>
                          {getEstadoText(postulacion.estado)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          <FiMail className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                          {postulacion.candidato.email}
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                          <FiPhone className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                          {postulacion.candidato.telefono}
                        </div>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <FiCalendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                        Postuló el {new Date(postulacion.fechaPostulacion).toLocaleDateString('es-ES')}
                      </div>
                    </div>

                    <div className="mt-2">
                      <div className="flex items-center text-sm text-gray-500">
                        <FiBriefcase className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                        {postulacion.oferta.titulo} • {postulacion.oferta.empresa}
                      </div>
                      <div className="mt-1 flex items-center text-sm text-gray-500">
                        <FiMapPin className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                        {postulacion.oferta.ubicacion} • {postulacion.oferta.tipo}
                      </div>
                    </div>

                    {postulacion.comentarios && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded-md">
                          {postulacion.comentarios}
                        </p>
                      </div>
                    )}

                    <div className="mt-3 flex flex-wrap gap-2">
                      <a
                        href={postulacion.candidato.cv}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <FiFileText className="mr-1 h-3 w-3" />
                        Ver CV
                      </a>
                      
                      {postulacion.estado !== 'seleccionado' && (
                        <button
                          onClick={() => cambiarEstadoPostulacion(postulacion.id, 'seleccionado')}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                          <FiCheck className="mr-1 h-3 w-3" />
                          Seleccionar
                        </button>
                      )}
                      
                      {postulacion.estado !== 'rechazada' && (
                        <button
                          onClick={() => cambiarEstadoPostulacion(postulacion.id, 'rechazada')}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          <FiX className="mr-1 h-3 w-3" />
                          Rechazar
                        </button>
                      )}
                      
                      {['nueva', 'revisada'].includes(postulacion.estado) && (
                        <button
                          onClick={() => cambiarEstadoPostulacion(postulacion.id, 'revisada')}
                          className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                        >
                          <FiClock className="mr-1 h-3 w-3" />
                          Marcar como revisada
                        </button>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-12 text-center">
              <FiUser className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No se encontraron postulaciones</h3>
              <p className="mt-1 text-sm text-gray-500">
                No hay postulaciones que coincidan con los criterios de búsqueda.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
