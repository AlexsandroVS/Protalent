import React from 'react';
import { motion } from 'framer-motion';
import { 
  BriefcaseIcon, 
  MapPinIcon, 
  CalendarIcon, 
  DollarSignIcon,
  ArrowRightIcon
} from 'lucide-react';

export default function OfertaCard({ oferta, onPostular, onEditar, variant = 'grid' }) {
  // Función para generar un color de fondo basado en el título
  const generateBackgroundColor = (title) => {
    let hash = 0;
    for (let i = 0; i < title.length; i++) {
      hash = title.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = hash % 360;
    return `hsl(${hue}, 70%, 80%)`;
  };

  // Renderizar imagen o placeholder de color
  const renderImageOrPlaceholder = () => {
    if (oferta.imagen) {
      return (
        <img 
          src={oferta.imagen} 
          alt={oferta.titulo} 
          className="w-full h-full object-cover absolute inset-0 transform transition-transform duration-300 group-hover:scale-110"
        />
      );
    }
    
    const bgColor = generateBackgroundColor(oferta.titulo);
    return (
      <div 
        className="absolute inset-0 flex items-center justify-center"
        style={{ backgroundColor: bgColor }}
      >
        <span className="text-3xl font-bold text-white opacity-70">
          {oferta.titulo.charAt(0)}
        </span>
      </div>
    );
  };

  // Renderización condicional basada en el variant
  if (variant === 'list') {
    return (
      <motion.div 
        className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl overflow-hidden flex items-center p-6 space-x-6 group"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        whileHover={{ 
          scale: 1.02,
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
        }}
      >
        <div className="w-32 h-32 rounded-xl overflow-hidden relative">
          {renderImageOrPlaceholder()}
        </div>
        <div className="flex-grow">
          <h3 className="text-2xl font-bold text-white mb-2">{oferta.titulo}</h3>
          <div className="space-y-2 text-gray-300">
            <div className="flex items-center">
              <BriefcaseIcon className="h-5 w-5 mr-2 text-blue-400" />
              <span>{oferta.empresa}</span>
            </div>
            <div className="flex items-center">
              <MapPinIcon className="h-5 w-5 mr-2 text-green-400" />
              <span>{oferta.ubicacion}</span>
            </div>
            <div className="flex items-center">
              <DollarSignIcon className="h-5 w-5 mr-2 text-green-500" />
              <span>{oferta.salario}</span>
            </div>
          </div>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={() => onPostular(oferta.id)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-all duration-300 transform hover:translate-x-1"
          >
            <span>Postular</span>
            <ArrowRightIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => onEditar(oferta.id)}
            className="text-white/50 hover:text-white transition-colors flex items-center space-x-2"
          >
            <span>Editar</span>
          </button>
        </div>
      </motion.div>
    );
  }

  // Vista de grid por defecto
  return (
    <motion.div 
      className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl shadow-2xl overflow-hidden h-[450px] w-[320px] flex flex-col group relative"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      whileHover={{ 
        scale: 1.05,
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
      }}
    >
      <div className="relative h-56 overflow-hidden">
        {renderImageOrPlaceholder()}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
          <h3 className="text-2xl font-bold line-clamp-2 drop-shadow-lg">{oferta.titulo}</h3>
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-grow justify-between">
        <div className="space-y-4">
          {oferta.empresa && (
            <div className="flex items-center text-sm text-gray-300">
              <BriefcaseIcon className="h-5 w-5 mr-3 text-blue-400" />
              <span className="line-clamp-1">{oferta.empresa}</span>
            </div>
          )}
          {oferta.ubicacion && (
            <div className="flex items-center text-sm text-gray-300">
              <MapPinIcon className="h-5 w-5 mr-3 text-green-400" />
              <span className="line-clamp-1">{oferta.ubicacion}</span>
            </div>
          )}
          {oferta.fechaInicio && (
            <div className="flex items-center text-sm text-gray-300">
              <CalendarIcon className="h-5 w-5 mr-3 text-purple-400" />
              <span>
                Inicio: {new Date(oferta.fechaInicio).toLocaleDateString()}
              </span>
            </div>
          )}
          {oferta.salario && (
            <div className="flex items-center text-sm text-gray-300">
              <DollarSignIcon className="h-5 w-5 mr-3 text-green-500" />
              <span>{oferta.salario}</span>
            </div>
          )}
        </div>
        
        <div className="flex space-x-4 mt-4">
            <button
              onClick={() => onPostular(oferta.id)}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center justify-center space-x-2 transition-all duration-300 transform hover:translate-x-1"
            >
            <span>Postular</span>
            <ArrowRightIcon className="h-5 w-5" />
            </button>
            <button
              onClick={() => onEditar(oferta.id)}
            className="bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-lg transition-colors"
            >
              Editar
            </button>
        </div>
      </div>
    </motion.div>
  );
} 