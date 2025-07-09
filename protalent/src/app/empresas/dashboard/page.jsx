'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiBriefcase, FiUsers, FiClock, FiTrendingUp, FiCheckCircle, FiDollarSign, FiMapPin } from 'react-icons/fi';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function EmpresasDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  
  // Datos simulados para el dashboard
  const [stats, setStats] = useState({
    totalOfertas: 0,
    ofertasActivas: 0,
    postulacionesTotales: 0,
    postulacionesNuevas: 0,
    tasaContratacion: 0,
    tiempoPromedioContratacion: 0,
  });

  // Datos para gráficos
  const [postulacionesPorMes, setPostulacionesPorMes] = useState({
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    datasets: [
      {
        label: 'Postulaciones por mes',
        data: [12, 19, 3, 5, 2, 3, 7, 10, 15, 8, 12, 17],
        backgroundColor: 'rgba(59, 130, 246, 0.6)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
        tension: 0.4,
        fill: true,
      },
    ],
  });

  const [postulacionesPorCargo, setPostulacionesPorCargo] = useState({
    labels: ['Desarrollador', 'Diseñador', 'Marketing', 'Ventas', 'Soporte'],
    datasets: [
      {
        label: 'Postulaciones por cargo',
        data: [12, 19, 3, 5, 2],
        backgroundColor: [
          'rgba(59, 130, 246, 0.7)',
          'rgba(16, 185, 129, 0.7)',
          'rgba(245, 158, 11, 0.7)',
          'rgba(139, 92, 246, 0.7)',
          'rgba(239, 68, 68, 0.7)',
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(139, 92, 246, 1)',
          'rgba(239, 68, 68, 1)',
        ],
        borderWidth: 1,
      },
    ],
  });

  useEffect(() => {
    // Simular carga de datos
    const timer = setTimeout(() => {
      setStats({
        totalOfertas: 24,
        ofertasActivas: 8,
        postulacionesTotales: 156,
        postulacionesNuevas: 12,
        tasaContratacion: 68, // %
        tiempoPromedioContratacion: 14, // días
      });
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }


  // Opciones para los gráficos
  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Encabezado */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Panel de Empresa</h1>
        <p className="text-gray-600 mt-2">Bienvenido de nuevo, aquí tienes un resumen de tu actividad</p>
      </div>

      {/* Tarjetas de métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Ofertas Activas"
          value={stats.ofertasActivas}
          total={stats.totalOfertas}
          icon={<FiBriefcase className="h-6 w-6 text-blue-600" />}
          color="blue"
          onClick={() => router.push('/empresas/dashboard/ofertas')}
        />
        <MetricCard
          title="Postulaciones Nuevas"
          value={stats.postulacionesNuevas}
          total={stats.postulacionesTotales}
          icon={<FiUsers className="h-6 w-6 text-green-600" />}
          color="green"
          onClick={() => router.push('/empresas/dashboard/postulaciones')}
        />
        <MetricCard
          title="Tasa de Contratación"
          value={`${stats.tasaContratacion}%`}
          description="del total de postulaciones"
          icon={<FiTrendingUp className="h-6 w-6 text-yellow-600" />}
          color="yellow"
        />
        <MetricCard
          title="Tiempo Promedio"
          value={`${stats.tiempoPromedioContratacion} días`}
          description="para contratación"
          icon={<FiClock className="h-6 w-6 text-purple-600" />}
          color="purple"
        />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Postulaciones por Mes</h3>
          <div className="h-80">
            <Line data={postulacionesPorMes} options={lineChartOptions} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Postulaciones por Cargo</h3>
          <div className="h-80">
            <Bar data={postulacionesPorCargo} options={barChartOptions} />
          </div>
        </div>
      </div>

      {/* Ofertas recientes */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Ofertas Recientes</h3>
          <button 
            onClick={() => router.push('/empresas/dashboard/ofertas/crear')}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Nueva Oferta
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Puesto</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ubicación</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Postulaciones</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Acciones</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[
                { id: 1, puesto: 'Desarrollador Frontend', ubicacion: 'Remoto', tipo: 'Tiempo Completo', postulaciones: 15, estado: 'Activa' },
                { id: 2, puesto: 'Diseñador UX/UI', ubicacion: 'Lima, Perú', tipo: 'Medio Tiempo', postulaciones: 8, estado: 'Activa' },
                { id: 3, puesto: 'Especialista en Marketing Digital', ubicacion: 'Arequipa, Perú', tipo: 'Tiempo Completo', postulaciones: 22, estado: 'Pendiente' },
              ].map((oferta) => (
                <tr key={oferta.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{oferta.puesto}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FiMapPin className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{oferta.ubicacion}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">{oferta.tipo}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FiUsers className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{oferta.postulaciones} postulantes</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      oferta.estado === 'Activa' 
                        ? 'bg-green-100 text-green-800' 
                        : oferta.estado === 'Pendiente' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-red-100 text-red-800'
                    }`}>
                      {oferta.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => router.push(`/empresas/dashboard/ofertas/${oferta.id}`)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Ver
                    </button>
                    <button className="text-indigo-600 hover:text-indigo-900">
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-gray-200 text-right">
          <button 
            onClick={() => router.push('/empresas/dashboard/ofertas')}
            className="text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            Ver todas las ofertas →
          </button>
        </div>
      </div>
    </div>
  );
}

// Componente para las tarjetas de métricas
function MetricCard({ title, value, total, description, icon, color, onClick }) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-700',
    green: 'bg-green-50 text-green-700',
    yellow: 'bg-yellow-50 text-yellow-700',
    purple: 'bg-purple-50 text-purple-700',
  };

  const iconBgClasses = {
    blue: 'bg-blue-100',
    green: 'bg-green-100',
    yellow: 'bg-yellow-100',
    purple: 'bg-purple-100',
  };

  return (
    <div 
      className={`p-6 rounded-xl ${colorClasses[color]} ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <div className="flex items-end mt-1">
            <p className="text-2xl font-semibold">{value}</p>
            {total !== undefined && (
              <p className="ml-2 text-sm text-gray-500">/ {total} total</p>
            )}
          </div>
          {description && (
            <p className="mt-1 text-xs text-gray-500">{description}</p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${iconBgClasses[color]} bg-opacity-50`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
