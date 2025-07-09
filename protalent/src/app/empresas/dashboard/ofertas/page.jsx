'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiBriefcase, FiPlus, FiSearch, FiFilter, FiEdit2, FiTrash2, FiEye, FiClock, FiCheckCircle, FiXCircle, FiUsers, FiDollarSign } from 'react-icons/fi';

export default function OfertasPage() {
  const router = useRouter();
  const [ofertas, setOfertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    estado: 'todos',
    tipo: 'todos',
    fecha: 'todos',
  });

  // Datos simulados
  useEffect(() => {
    const timer = setTimeout(() => {
      setOfertas([
        {
          id: 1,
          titulo: 'Desarrollador Frontend',
          empresa: 'Tech Solutions S.A.',
          ubicacion: 'Remoto',
          tipo: 'Tiempo Completo',
          salario: 'S/ 3,500 - 4,500',
          fechaPublicacion: '2023-06-15',
          fechaCierre: '2023-07-15',
          estado: 'activa',
          postulaciones: 15,
          descripcion: 'Buscamos un desarrollador frontend con experiencia en React y TypeScript.'
        },
        {
          id: 2,
          titulo: 'Diseñador UX/UI',
          empresa: 'Digital Creators',
          ubicacion: 'Lima, Perú',
          tipo: 'Medio Tiempo',
          salario: 'S/ 2,500 - 3,500',
          fechaPublicacion: '2023-06-10',
          fechaCierre: '2023-07-10',
          estado: 'activa',
          postulaciones: 8,
          descripcion: 'Diseñador con experiencia en herramientas de diseño y prototipado.'
        },
        {
          id: 3,
          titulo: 'Especialista en Marketing Digital',
          empresa: 'Growth Marketing',
          ubicacion: 'Arequipa, Perú',
          tipo: 'Tiempo Completo',
          salario: 'S/ 3,000 - 4,000',
          fechaPublicacion: '2023-06-05',
          fechaCierre: '2023-07-05',
          estado: 'cerrada',
          postulaciones: 22,
          descripcion: 'Experto en estrategias de marketing digital y redes sociales.'
        },
        {
          id: 4,
          titulo: 'Desarrollador Backend',
          empresa: 'Tech Solutions S.A.',
          ubicacion: 'Remoto',
          tipo: 'Tiempo Completo',
          salario: 'S/ 4,000 - 5,500',
          fechaPublicacion: '2023-06-20',
          fechaCierre: '2023-07-20',
          estado: 'activa',
          postulaciones: 12,
          descripcion: 'Experiencia en Node.js, MongoDB y arquitectura de microservicios.'
        },
        {
          id: 5,
          titulo: 'Community Manager',
          empresa: 'Social Media Pro',
          ubicacion: 'Lima, Perú',
          tipo: 'Medio Tiempo',
          salario: 'S/ 1,800 - 2,500',
          fechaPublicacion: '2023-05-25',
          fechaCierre: '2023-06-25',
          estado: 'cerrada',
          postulaciones: 18,
          descripcion: 'Manejo de redes sociales y creación de contenido digital.'
        },
      ]);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Filtrar ofertas
  const filteredOfertas = ofertas.filter(oferta => {
    const matchesSearch = oferta.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        oferta.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilters = 
      (filters.estado === 'todos' || oferta.estado === filters.estado) &&
      (filters.tipo === 'todos' || oferta.tipo === filters.tipo);
    
    return matchesSearch && matchesFilters;
  });

  // Manejar cambio de estado
  const toggleEstadoOferta = (id) => {
    setOfertas(ofertas.map(oferta => 
      oferta.id === id 
        ? { ...oferta, estado: oferta.estado === 'activa' ? 'cerrada' : 'activa' } 
        : oferta
    ));
  };

  // Formatear fecha
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
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
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Ofertas</h1>
          <button
            onClick={() => router.push('/empresas/dashboard/ofertas/crear')}
            className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FiPlus className="mr-2 h-4 w-4" />
            Crear Nueva Oferta
          </button>
        </div>

        {/* Filtros y búsqueda */}
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
                  placeholder="Buscar ofertas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div>
              <select
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md h-10 border"
                value={filters.estado}
                onChange={(e) => setFilters({...filters, estado: e.target.value})}
              >
                <option value="todos">Todos los estados</option>
                <option value="activa">Activas</option>
                <option value="cerrada">Cerradas</option>
              </select>
            </div>
            <div>
              <select
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md h-10 border"
                value={filters.tipo}
                onChange={(e) => setFilters({...filters, tipo: e.target.value})}
              >
                <option value="todos">Todos los tipos</option>
                <option value="Tiempo Completo">Tiempo Completo</option>
                <option value="Medio Tiempo">Medio Tiempo</option>
                <option value="Práctica">Práctica</option>
              </select>
            </div>
          </div>
        </div>

        {/* Lista de ofertas */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {filteredOfertas.length > 0 ? (
              filteredOfertas.map((oferta) => (
                <li key={oferta.id} className="hover:bg-gray-50">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                          <FiBriefcase className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-blue-600">{oferta.titulo}</div>
                          <div className="text-sm text-gray-500">{oferta.empresa} • {oferta.ubicacion}</div>
                        </div>
                      </div>
                      <div className="ml-2 flex-shrink-0 flex
                      ">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          oferta.estado === 'activa' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {oferta.estado === 'activa' ? 'Activa' : 'Cerrada'}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          <FiClock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                          Cierra el {formatDate(oferta.fechaCierre)}
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                          <FiUsers className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                          {oferta.postulaciones} postulaciones
                        </div>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <FiDollarSign className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                        {oferta.salario}
                      </div>
                    </div>
                    <div className="mt-2 flex justify-end space-x-3">
                      <button
                        onClick={() => router.push(`/empresas/dashboard/postulaciones?oferta=${oferta.id}`)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Ver Postulaciones
                      </button>
                      <button
                        onClick={() => router.push(`/empresas/dashboard/ofertas/editar/${oferta.id}`)}
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <FiEdit2 className="mr-1 h-3 w-3" />
                        Editar
                      </button>
                      <button
                        onClick={() => toggleEstadoOferta(oferta.id)}
                        className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                          oferta.estado === 'activa'
                            ? 'text-yellow-700 bg-yellow-100 hover:bg-yellow-200 focus:ring-yellow-500'
                            : 'text-green-700 bg-green-100 hover:bg-green-200 focus:ring-green-500'
                        }`}
                      >
                        {oferta.estado === 'activa' ? (
                          <>
                            <FiXCircle className="mr-1 h-3 w-3" />
                            Cerrar
                          </>
                        ) : (
                          <>
                            <FiCheckCircle className="mr-1 h-3 w-3" />
                            Reabrir
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <li className="px-4 py-12 text-center">
                <FiBriefcase className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No se encontraron ofertas</h3>
                <p className="mt-1 text-sm text-gray-500">
                  No hay ofertas que coincidan con los criterios de búsqueda.
                </p>
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={() => router.push('/empresas/dashboard/ofertas/crear')}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <FiPlus className="-ml-1 mr-2 h-5 w-5" />
                    Nueva Oferta
                  </button>
                </div>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
