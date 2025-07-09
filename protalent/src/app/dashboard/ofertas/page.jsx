'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { SparklesCore } from '../../components/ui/sparkles';
import InfiniteMenu from '../../components/ui/infinite-menu';
import api from '../../lib/api';
import { 
  LayoutGridIcon, 
  ListIcon 
} from 'lucide-react';

export default function OfertasPage() {
  const [ofertas, setOfertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const router = useRouter();

  // Función para formatear la ubicación
  const formatUbicacion = (oferta) => {
    // Usar los nombres de ubicación si están disponibles
    if (oferta.ubicacionNombres) {
      return oferta.ubicacionNombres.completo;
    }
    
    // Fallback a los códigos si no hay nombres
    if (oferta.departamento && oferta.provincia && oferta.distrito) {
      return `${oferta.departamento}, ${oferta.provincia}, ${oferta.distrito}`;
    } else if (oferta.departamento && oferta.provincia) {
      return `${oferta.departamento}, ${oferta.provincia}`;
    } else if (oferta.departamento) {
      return oferta.departamento;
    }
    return 'Ubicación no especificada';
  };

  useEffect(() => {
    fetchOfertas();
  }, []);

  const fetchOfertas = async () => {
    try {
      const { data } = await api.get('/api/ofertas');
      // Transformar ofertas para el InfiniteMenu
      const menuItems = data.map(oferta => ({
        image: oferta.imagen || `https://via.placeholder.com/900x900.png?text=${encodeURIComponent(oferta.titulo)}`,
        link: `/dashboard/postulaciones/crear/${oferta.id}`,
        title: oferta.titulo,
        description: `${oferta.Empresa?.nombreEmpresa || 'Empresa'} • ${oferta.modalidad || 'Modalidad'} • ${formatUbicacion(oferta)}`,
        ofertaData: oferta // Guardar datos completos para referencia
      }));
      
      setOfertas(menuItems);
      setLoading(false);
    } catch (error) {
      console.error('Error cargando ofertas:', error);
      setLoading(false);
    }
  };

  const handleCardClick = (ofertaId) => {
    router.push(`/dashboard/postulaciones/crear/${ofertaId}`);
  };

  if (loading) {
    return (
      <div className="relative flex justify-center items-center h-screen bg-black">
        <SparklesCore
          id="tsparticlesfullpage"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={100}
          className="absolute inset-0 w-full h-full"
          particleColor="#FFFFFF"
        />
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 z-10"></div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-black pt-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Fondo de partículas */}
      <div className="absolute inset-0 w-full h-full">
        <SparklesCore
          id="tsparticlesfullpage"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={100}
          className="w-full h-full"
          particleColor="#FFFFFF"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">        
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/10 p-6"
        >
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-white">Ofertas de Prácticas</h1>
            <div className="flex items-center space-x-4">
              <div className="flex space-x-2 bg-white/10 rounded-full p-1">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-full transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-blue-600 text-white' 
                      : 'text-white/50 hover:bg-white/20'
                  }`}
                >
                  <LayoutGridIcon className="h-5 w-5" />
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-full transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-blue-600 text-white' 
                      : 'text-white/50 hover:bg-white/20'
                  }`}
                >
                  <ListIcon className="h-5 w-5" />
                </button>
              </div>
              <button 
                onClick={() => router.push('/dashboard/ofertas/crear')}
                className="bg-[#38bdf8] hover:bg-[#0ea5e9] text-[#062056] px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                + Nueva Oferta
              </button>
            </div>
          </div>

          {ofertas.length === 0 ? (
            <div className="text-center py-16 text-white">
              <div className="mx-auto w-24 h-24 text-gray-300 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-white/50">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-white">No hay ofertas disponibles</h3>
              <p className="mt-1 text-gray-400">Crea tu primera oferta de prácticas.</p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="h-[600px] w-full">
              <InfiniteMenu 
                items={ofertas} 
                onListView={() => setViewMode('list')} 
              />
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {ofertas.map((oferta, index) => (
                  <motion.div
                    key={oferta.link}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ 
                      duration: 0.3, 
                      delay: index * 0.1 
                    }}
                    onClick={() => handleCardClick(oferta.link.split('/').pop())}
                    className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/10 p-4 hover:bg-white/20 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-white">
                          {oferta.title}
                        </h3>
                        <p className="text-sm text-gray-300 mt-1">
                          {oferta.description}
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm bg-white/10 px-3 py-1 rounded-full text-white/70">
                          {oferta.ofertaData?.modalidad || 'Modalidad no especificada'}
                        </span>
                        {oferta.ofertaData?.salario && (
                          <span className="text-sm bg-green-500/20 px-3 py-1 rounded-full text-green-300">
                            {oferta.ofertaData.salario}
                          </span>
                        )}
                        <span className="text-sm text-gray-300">
                          {formatUbicacion(oferta.ofertaData)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
} 