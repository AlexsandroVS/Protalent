'use client';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const navItems = [
  { href: '/dashboard/empresas', label: 'Ver Empresas' },
  { href: '/dashboard/empresas/crear', label: 'Crear Empresa' },
];

export default function EmpresasPage() {
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    fetchEmpresas();
  }, []);

  const fetchEmpresas = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/empresas');
      if (!response.ok) throw new Error('Error al cargar las empresas');
      const data = await response.json();
      setEmpresas(data);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al cargar las empresas');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta empresa?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/empresas/${id}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) throw new Error('Error al eliminar la empresa');
        
        toast.success('Empresa eliminada correctamente');
        fetchEmpresas(); // Refresh the list
      } catch (error) {
        console.error('Error:', error);
        toast.error('Error al eliminar la empresa');
      }
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
    <div className="min-h-screen bg-gray-50 pt-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Empresas</h1>
            <p className="text-gray-600">
              {pathname === '/dashboard/empresas' ? 'Lista de empresas registradas' : 'Registra una nueva empresa'}
            </p>
          </div>

          <div className="mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex flex-wrap gap-2">
                {navItems.map((item) => (
                  <button
                    key={item.href}
                    onClick={() => router.push(item.href)}
                    className={`px-4 py-2 rounded-md text-sm sm:text-base ${
                      pathname === item.href
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {pathname === '/dashboard/empresas' && (
                <button
                  onClick={() => router.push('/dashboard/empresas/crear')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center space-x-2 w-full sm:w-auto justify-center"
                >
                  <span>+</span>
                  <span>Nueva Empresa</span>
                </button>
              )}
            </div>

            {empresas.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">No hay empresas registradas aún</p>
                <button
                  onClick={() => router.push('/dashboard/empresas/crear')}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Crear mi primera empresa
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rubro</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {empresas.map((empresa) => (
                      <tr key={empresa._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{empresa.nombre}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {empresa.rubro || 'No especificado'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                          {empresa.descripcion || 'Sin descripción'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => router.push(`/dashboard/empresas/editar/${empresa._id}`)}
                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDelete(empresa._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}