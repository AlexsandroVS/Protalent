'use client';
import { useState, useEffect } from 'react';
import api from '../../lib/api';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  DraggableContainer,
  GridBody,
  GridItem 
} from '../../components/ui/infinite-drag-scroll';
import PostulacionCard from './components/PostulacionCard';
import { SparklesCore } from '../../components/ui/sparkles';
import { 
  LayoutGridIcon, 
  ListIcon 
} from 'lucide-react';

export default function PostulacionesPage() {
  const [postulaciones, setPostulaciones] = useState([]);
  const [ofertas, setOfertas] = useState({});
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postulacionesRes, ofertasRes] = await Promise.all([
          api.get('/api/postulaciones'),
          api.get('/api/ofertas')
        ]);
        
        setPostulaciones(postulacionesRes.data || []);
        
        const ofertasMap = {};
        (ofertasRes.data || []).forEach(oferta => {
          ofertasMap[oferta.id] = oferta;
        });
        setOfertas(ofertasMap);
      } catch (error) {
        console.error('Error cargando datos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCardClick = (postulacionId) => {
    router.push(`/dashboard/postulaciones/${postulacionId}`);
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

      <div className="relative z-10 max-w-7xl mx-auto ">        
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/10 p-6"
        >
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-white">Mis Postulaciones</h1>
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
            </div>
          </div>

          {postulaciones.length === 0 ? (
            <div className="text-center py-16 text-white">
              <div className="mx-auto w-24 h-24 text-gray-300 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-white/50">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-white">No tienes postulaciones</h3>
              <p className="mt-1 text-gray-400">Comienza postulándote a una oferta que te interese.</p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="h-[calc(100vh-250px)] overflow-y-hidden">
              <DraggableContainer variant="masonry">
                <GridBody>
                  <AnimatePresence>
                    {postulaciones.map((postulacion, index) => (
                      <GridItem
                        key={postulacion.id}
                        className="relative h-[400px] w-[300px]"
                      >
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ 
                            duration: 0.3, 
                            delay: index * 0.1 
                          }}
                          className="cursor-pointer"
                          onClick={() => handleCardClick(postulacion.id)}
                        >
                          <PostulacionCard 
                            postulacion={postulacion} 
                            oferta={ofertas[postulacion.ofertaId] || {}} 
                          />
                        </motion.div>
                      </GridItem>
                    ))}
                  </AnimatePresence>
                </GridBody>
              </DraggableContainer>
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {postulaciones.map((postulacion, index) => (
                  <motion.div
                    key={postulacion.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ 
                      duration: 0.3, 
                      delay: index * 0.1 
                    }}
                    onClick={() => handleCardClick(postulacion.id)}
                    className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/10 p-4 hover:bg-white/20 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-white">
                          {ofertas[postulacion.ofertaId]?.titulo || 'Oferta no disponible'}
                        </h3>
                        <p className="text-sm text-gray-300 mt-1">
                          {postulacion.mensaje || 'Sin mensaje adicional'}
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          postulacion.estado === 'PENDIENTE' ? 'bg-yellow-100 text-yellow-800' :
                          postulacion.estado === 'ACEPTADA' ? 'bg-green-100 text-green-800' :
                          postulacion.estado === 'RECHAZADA' ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {postulacion.estado}
                        </span>
                        <span className="text-sm text-gray-300">
                          {new Date(postulacion.createdAt).toLocaleDateString()}
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
