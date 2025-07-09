'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiBarChart2, FiUsers, FiDollarSign, FiClock, FiTrendingUp, FiFilter, FiDownload, FiCalendar, FiBriefcase } from 'react-icons/fi';
import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

// Registrar componentes de ChartJS
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function AnaliticasPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('6m');
  const [activeTab, setActiveTab] = useState('general');

  // Datos simulados
  const [metrics, setMetrics] = useState({
    totalOfertas: 0,
    ofertasActivas: 0,
    postulacionesTotales: 0,
    tasaConversion: 0,
    tiempoPromedioContratacion: 0,
    satisfaccionPromedio: 0,
  });

  // Datos para gráficos
  const [postulacionesPorMes, setPostulacionesPorMes] = useState({
    labels: [],
    datasets: [],
  });

  const [postulacionesPorCargo, setPostulacionesPorCargo] = useState({
    labels: [],
    datasets: [],
  });

  const [origenPostulaciones, setOrigenPostulaciones] = useState({
    labels: [],
    datasets: [],
  });

  const [estadoPostulaciones, setEstadoPostulaciones] = useState({
    labels: [],
    datasets: [],
  });

  // Cargar datos simulados
  useEffect(() => {
    const timer = setTimeout(() => {
      // Datos de métricas
      setMetrics({
        totalOfertas: 24,
        ofertasActivas: 8,
        postulacionesTotales: 156,
        tasaConversion: 12.5, // %
        tiempoPromedioContratacion: 14, // días
        satisfaccionPromedio: 4.3, // /5
      });

      // Datos para gráficos
      const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
      const mesesFiltrados = timeRange === '3m' ? meses.slice(-3) : timeRange === '6m' ? meses.slice(-6) : meses;
      
      setPostulacionesPorMes({
        labels: mesesFiltrados,
        datasets: [
          {
            label: 'Postulaciones',
            data: mesesFiltrados.map(() => Math.floor(Math.random() * 30) + 5),
            backgroundColor: 'rgba(59, 130, 246, 0.5)',
            borderColor: 'rgba(59, 130, 246, 1)',
            borderWidth: 2,
            tension: 0.3,
            fill: true,
          },
        ],
      });

      const cargos = ['Desarrollador', 'Diseñador', 'Marketing', 'Ventas', 'Soporte'];
      setPostulacionesPorCargo({
        labels: cargos,
        datasets: [
          {
            label: 'Postulaciones por cargo',
            data: cargos.map(() => Math.floor(Math.random() * 50) + 10),
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

      setOrigenPostulaciones({
        labels: ['Portal de empleo', 'Redes sociales', 'Sitio web', 'Referidos', 'Otros'],
        datasets: [
          {
            data: [35, 25, 20, 15, 5],
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

      setEstadoPostulaciones({
        labels: ['Nuevas', 'Revisadas', 'Seleccionadas', 'Rechazadas'],
        datasets: [
          {
            data: [25, 40, 15, 20],
            backgroundColor: [
              'rgba(59, 130, 246, 0.7)',
              'rgba(245, 158, 11, 0.7)',
              'rgba(16, 185, 129, 0.7)',
              'rgba(239, 68, 68, 0.7)',
            ],
            borderColor: [
              'rgba(59, 130, 246, 1)',
              'rgba(245, 158, 11, 1)',
              'rgba(16, 185, 129, 1)',
              'rgba(239, 68, 68, 1)',
            ],
            borderWidth: 1,
          },
        ],
      });

      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeRange]);

  // Opciones para los gráficos
  const lineChartOptions = {
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
        ticks: {
          stepSize: 5,
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

  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
    },
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
          <h1 className="text-2xl font-bold text-gray-900">Análisis y Reportes</h1>
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiCalendar className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="appearance-none bg-white border border-gray-300 text-gray-700 py-2 pl-10 pr-8 rounded-md leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="3m">Últimos 3 meses</option>
                <option value="6m">Últimos 6 meses</option>
                <option value="12m">Últimos 12 meses</option>
              </select>
            </div>
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <FiDownload className="mr-2 h-4 w-4" />
              Exportar
            </button>
          </div>
        </div>

        {/* Pestañas */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('general')}
              className={`${
                activeTab === 'general'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Visión General
            </button>
            <button
              onClick={() => setActiveTab('postulaciones')}
              className={`${
                activeTab === 'postulaciones'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Postulaciones
            </button>
            <button
              onClick={() => setActiveTab('ofertas')}
              className={`${
                activeTab === 'ofertas'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Ofertas
            </button>
            <button
              onClick={() => setActiveTab('rendimiento')}
              className={`${
                activeTab === 'rendimiento'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Rendimiento
            </button>
          </nav>
        </div>

        {/* Contenido de las pestañas */}
        {activeTab === 'general' && (
          <div className="space-y-8">
            {/* Tarjetas de métricas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard
                title="Ofertas Activas"
                value={metrics.ofertasActivas}
                total={metrics.totalOfertas}
                icon={<FiBriefcase className="h-6 w-6 text-blue-600" />}
                color="blue"
                trend="up"
                trendValue="12%"
              />
              <MetricCard
                title="Postulaciones Totales"
                value={metrics.postulacionesTotales}
                icon={<FiUsers className="h-6 w-6 text-green-600" />}
                color="green"
                trend="up"
                trendValue="8%"
              />
              <MetricCard
                title="Tasa de Conversión"
                value={`${metrics.tasaConversion}%`}
                icon={<FiTrendingUp className="h-6 w-6 text-yellow-600" />}
                color="yellow"
                trend="up"
                trendValue="2.5%"
              />
              <MetricCard
                title="Tiempo Promedio"
                value={`${metrics.tiempoPromedioContratacion} días`}
                icon={<FiClock className="h-6 w-6 text-purple-600" />}
                color="purple"
                trend="down"
                trendValue="3 días"
              />
            </div>

            {/* Gráficos principales */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Postulaciones por Mes</h3>
                </div>
                <div className="h-80">
                  <Line data={postulacionesPorMes} options={lineChartOptions} />
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Postulaciones por Cargo</h3>
                </div>
                <div className="h-80">
                  <Bar data={postulacionesPorCargo} options={barChartOptions} />
                </div>
              </div>
            </div>

            {/* Gráficos secundarios */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Origen de las Postulaciones</h3>
                </div>
                <div className="h-64">
                  <Doughnut data={origenPostulaciones} options={pieChartOptions} />
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Estado de las Postulaciones</h3>
                </div>
                <div className="h-64">
                  <Pie data={estadoPostulaciones} options={pieChartOptions} />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'postulaciones' && (
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tendencias de Postulaciones</h3>
              <div className="h-96">
                <Line data={postulacionesPorMes} options={lineChartOptions} />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Postulaciones por Cargo</h3>
                <div className="h-80">
                  <Bar data={postulacionesPorCargo} options={barChartOptions} />
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Estado de las Postulaciones</h3>
                <div className="h-80">
                  <Pie data={estadoPostulaciones} options={pieChartOptions} />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ofertas' && (
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Desempeño de Ofertas</h3>
              <div className="h-96">
                <Bar data={postulacionesPorCargo} options={barChartOptions} />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Postulaciones por Oferta</h3>
                <div className="h-80">
                  <Bar data={postulacionesPorCargo} options={barChartOptions} />
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tasa de Conversión por Oferta</h3>
                <div className="h-80">
                  <Bar data={postulacionesPorCargo} options={barChartOptions} />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'rendimiento' && (
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tendencias de Rendimiento</h3>
              <div className="h-96">
                <Line data={postulacionesPorMes} options={lineChartOptions} />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tiempo de Contratación</h3>
                <div className="h-80">
                  <Bar data={postulacionesPorCargo} options={barChartOptions} />
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Fuentes de Contratación</h3>
                <div className="h-80">
                  <Doughnut data={origenPostulaciones} options={pieChartOptions} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Componente para las tarjetas de métricas con tendencia
function MetricCard({ title, value, total, description, icon, color, trend, trendValue }) {
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
    <div className={`p-6 rounded-xl ${colorClasses[color]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <div className="flex items-end mt-1">
            <p className="text-2xl font-semibold">{value}</p>
            {total !== undefined && (
              <p className="ml-2 text-sm text-gray-500">/ {total} total</p>
            )}
          </div>
          {trend && (
            <div className={`mt-1 flex items-center text-xs ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              {trend === 'up' ? (
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12 7a1 1 0 01-1.707-.707L10 5.586 5.707 9.88a1 1 0 11-1.414-1.414l5-5a1 1 0 011.414 0l5 5A1 1 0 0112 7z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12 13a1 1 0 01-1.707.707L10 14.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0l5 5A1 1 0 0112 13z" clipRule="evenodd" />
                </svg>
              )}
              <span className="ml-1">{trendValue} {trend === 'up' ? 'más' : 'menos'} que el período anterior</span>
            </div>
          )}
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
