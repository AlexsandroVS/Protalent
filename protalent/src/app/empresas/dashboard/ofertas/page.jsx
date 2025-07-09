'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiBriefcase, FiPlus, FiSearch, FiFilter, FiEdit2, FiTrash2, FiEye, FiClock, FiCheckCircle, FiXCircle, FiUsers, FiDollarSign } from 'react-icons/fi';
import { useAuth } from '../../../context/auth/AuthContext';
import api from '../../../lib/axios';

export default function OfertasPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [ofertas, setOfertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    estado: 'todos',
    modalidad: 'todos',
    fecha: 'todos',
  });

  // Obtener ofertas de la empresa logueada
  useEffect(() => {
    const fetchOfertas = async () => {
      try {
        setLoading(true);
        
        // Verificar que el usuario sea una empresa
        if (!user || user.rol !== 'empresa') {
          console.error('Usuario no es una empresa:', user);
          return;
        }

        // Obtener el ID de la empresa del usuario
        const empresaId = user.Empresa?.id;
        if (!empresaId) {
          console.error('No se encontró ID de empresa para el usuario:', user);
          return;
        }

        // Obtener ofertas de la empresa
        const response = await api.get(`/api/ofertas/empresa/${empresaId}`);
        setOfertas(response.data);
        
      } catch (error) {
        console.error('Error al obtener ofertas:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOfertas();
    }
  }, [user]);

  // Filtrar ofertas
  const filteredOfertas = ofertas.filter(oferta => {
    const matchesSearch = oferta.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        oferta.descripcion?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilters = 
      (filters.estado === 'todos' || oferta.estado === filters.estado) &&
      (filters.modalidad === 'todos' || oferta.modalidad === filters.modalidad);
    
    return matchesSearch && matchesFilters;
  });

  // Manejar cambio de estado
  const toggleEstadoOferta = async (id) => {
    try {
      const oferta = ofertas.find(o => o.id === id);
      const nuevoEstado = oferta.estado === 'activa' ? 'cerrada' : 'activa';
      
      await api.put(`/api/ofertas/${id}`, { estado: nuevoEstado });
      
      setOfertas(ofertas.map(oferta => 
        oferta.id === id 
          ? { ...oferta, estado: nuevoEstado } 
          : oferta
      ));
    } catch (error) {
      console.error('Error al cambiar estado de oferta:', error);
    }
  };

  // Eliminar oferta
  const eliminarOferta = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta oferta?')) {
      return;
    }

    try {
      await api.delete(`/api/ofertas/${id}`);
      setOfertas(ofertas.filter(o => o.id !== id));
    } catch (error) {
      console.error('Error al eliminar oferta:', error);
    }
  };

  // Formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return 'No especificada';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  // Obtener número de postulaciones
  const getPostulacionesCount = (oferta) => {
    return oferta.Postulaciones?.length || 0;
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
                value={filters.modalidad}
                onChange={(e) => setFilters({...filters, modalidad: e.target.value})}
              >
                <option value="todos">Todas las modalidades</option>
                <option value="presencial">Presencial</option>
                <option value="remoto">Remoto</option>
                <option value="híbrido">Híbrido</option>
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
                          <div className="text-sm text-gray-500">
                            {oferta.ubicacionNombres?.completo || 'Ubicación no especificada'} • {oferta.modalidad}
                          </div>
                          <div className="text-sm text-gray-500">
                            {oferta.salario && `Salario: ${oferta.salario}`}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="text-sm text-gray-500">
                          <div className="flex items-center">
                            <FiUsers className="mr-1" />
                            {getPostulacionesCount(oferta)} postulaciones
                          </div>
                          <div className="flex items-center">
                            <FiClock className="mr-1" />
                            {formatDate(oferta.createdAt)}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            oferta.estado === 'activa' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {oferta.estado === 'activa' ? (
                              <>
                                <FiCheckCircle className="mr-1" />
                                Activa
                              </>
                            ) : (
                              <>
                                <FiXCircle className="mr-1" />
                                Cerrada
                              </>
                            )}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => router.push(`/empresas/dashboard/ofertas/${oferta.id}/postulaciones`)}
                            className="text-blue-600 hover:text-blue-800"
                            title="Ver postulaciones"
                          >
                            <FiEye className="h-4 w-4" />
                          </button>
                          
                          <button
                            onClick={() => router.push(`/empresas/dashboard/ofertas/${oferta.id}/editar`)}
                            className="text-gray-600 hover:text-gray-800"
                            title="Editar oferta"
                          >
                            <FiEdit2 className="h-4 w-4" />
                          </button>
                          
                          <button
                            onClick={() => toggleEstadoOferta(oferta.id)}
                            className={`${
                              oferta.estado === 'activa' 
                                ? 'text-red-600 hover:text-red-800' 
                                : 'text-green-600 hover:text-green-800'
                            }`}
                            title={oferta.estado === 'activa' ? 'Cerrar oferta' : 'Abrir oferta'}
                          >
                            {oferta.estado === 'activa' ? (
                              <FiXCircle className="h-4 w-4" />
                            ) : (
                              <FiCheckCircle className="h-4 w-4" />
                            )}
                          </button>
                          
                          <button
                            onClick={() => eliminarOferta(oferta.id)}
                            className="text-red-600 hover:text-red-800"
                            title="Eliminar oferta"
                          >
                            <FiTrash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <li className="px-4 py-8 text-center">
                <div className="text-gray-500">
                  <FiBriefcase className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-lg font-medium">No hay ofertas</p>
                  <p className="text-sm">Crea tu primera oferta para comenzar a recibir postulaciones.</p>
                </div>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
