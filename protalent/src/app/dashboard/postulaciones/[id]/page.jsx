'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '../../../lib/api';
import { motion } from 'framer-motion';
import { 
  BriefcaseIcon, 
  CalendarIcon, 
  ChatBubbleLeftIcon, 
  CheckCircleIcon, 
  ArrowLeftIcon 
} from '@heroicons/react/24/outline';
import { SparklesCore } from '../../../components/ui/sparkles';

export default function VerPostulacionPage() {
  const { id } = useParams();
  const router = useRouter();
  const [postulacion, setPostulacion] = useState(null);
  const [oferta, setOferta] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    // Obtener la postulación
    api.get(`/api/postulaciones/${id}`)
      .then(res => {
        setPostulacion(res.data);
        // Luego obtener la oferta asociada
        return api.get(`/api/ofertas/${res.data.ofertaId}`);
      })
      .then(res => {
        setOferta(res.data);
      })
      .catch(error => {
        console.error('Error al cargar los datos:', error);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const getStatusColor = (estado) => {
    switch (estado) {
      case 'PENDIENTE': return 'bg-yellow-100 text-yellow-800';
      case 'ACEPTADA': return 'bg-green-100 text-green-800';
      case 'RECHAZADA': return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-800';
    }
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

  if (!postulacion) {
    return (
      <div className="relative min-h-screen bg-black flex justify-center items-center">
        <SparklesCore
          id="tsparticlesfullpage"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={100}
          className="absolute inset-0 w-full h-full"
          particleColor="#FFFFFF"
        />
        <div className="text-center text-white z-10">
          <p className="text-2xl font-bold">No se encontró la postulación</p>
        </div>
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

      <div className="relative z-10 max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/10 p-8"
        >
          <div className="flex items-center justify-between mb-8">
            <button 
              onClick={() => router.back()}
              className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
            >
              <ArrowLeftIcon className="h-6 w-6" />
            </button>
            <div className={`px-4 py-1 rounded-full text-xs font-semibold ${getStatusColor(postulacion.estado)}`}>
              {postulacion.estado}
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-4">
              {oferta ? oferta.titulo : 'Detalle de Postulación'}
            </h1>
            <p className="text-gray-300 max-w-xl mx-auto">
              Información detallada de tu postulación
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-white/10 rounded-xl p-6 border border-white/20">
              <div className="flex items-center mb-4">
                <BriefcaseIcon className="h-6 w-6 text-blue-500 mr-3" />
                <h3 className="text-xl font-semibold text-white">Información de la Oferta</h3>
              </div>
              <div className="space-y-3 text-gray-300">
                <div>
                  <span className="font-medium text-white">Título:</span>{' '}
                  {oferta ? oferta.titulo : 'Cargando...'}
                </div>
                <div>
                  <span className="font-medium text-white">Empresa:</span>{' '}
                  {oferta?.empresa?.nombre || 'No especificada'}
                </div>
                <div>
                  <span className="font-medium text-white">Ubicación:</span>{' '}
                  {oferta?.ubicacion || 'No especificada'}
                </div>
              </div>
            </div>

            <div className="bg-white/10 rounded-xl p-6 border border-white/20">
              <div className="flex items-center mb-4">
                <ChatBubbleLeftIcon className="h-6 w-6 text-purple-500 mr-3" />
                <h3 className="text-xl font-semibold text-white">Mensaje de Postulación</h3>
              </div>
              <p className="text-gray-300 italic">
                {postulacion.mensaje || 'Sin mensaje adicional'}
              </p>
            </div>

            <div className="bg-white/10 rounded-xl p-6 border border-white/20">
              <div className="flex items-center mb-4">
                <CalendarIcon className="h-6 w-6 text-green-500 mr-3" />
                <h3 className="text-xl font-semibold text-white">Detalles de la Postulación</h3>
              </div>
              <div className="space-y-3 text-gray-300">
                <div>
                  <span className="font-medium text-white">Fecha de Postulación:</span>{' '}
                  {new Date(postulacion.createdAt).toLocaleDateString()}
                </div>
                <div>
                  <span className="font-medium text-white">ID de Postulación:</span>{' '}
                  {postulacion.id}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <button
              onClick={() => router.back()}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              <span>Volver a Postulaciones</span>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 