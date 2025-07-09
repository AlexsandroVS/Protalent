'use client';
import React from 'react';
import { 
  BriefcaseIcon, 
  CalendarIcon, 
  MapPinIcon, 
  SignalIcon,
  ChatBubbleLeftIcon
} from '@heroicons/react/24/outline';

const PostulacionCard = ({ postulacion, oferta }) => {
  const getStatusColor = (estado) => {
    switch (estado) {
      case 'PENDIENTE': return 'bg-yellow-100 text-yellow-800';
      case 'ACEPTADA': return 'bg-green-100 text-green-800';
      case 'RECHAZADA': return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getStatusText = (estado) => {
    switch (estado) {
      case 'PENDIENTE': return 'En revisión';
      case 'ACEPTADA': return 'Aprobada';
      case 'RECHAZADA': return 'Rechazada';
      default: return 'Estado desconocido';
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden h-full flex flex-col shadow-2xl transform transition-all hover:scale-105">
      <div className="p-6 flex-grow">
        <div className="flex justify-between items-start mb-6">
          <div className="flex-grow">
            <h3 className="text-2xl font-bold text-white mb-2 truncate">
              {oferta?.titulo || 'Oferta no disponible'}
            </h3>
            <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(postulacion.estado)}`}>
              {postulacion.estado}
            </div>
          </div>
          <div className="text-gray-300 text-sm ml-4">
            {new Date(postulacion.createdAt).toLocaleDateString()}
          </div>
        </div>

        <div className="space-y-4 text-gray-300">
          <div className="flex items-center">
            <BriefcaseIcon className="h-6 w-6 mr-3 text-blue-500" />
            <span className="text-base">{oferta?.empresa?.nombre || 'Empresa no especificada'}</span>
          </div>
          <div className="flex items-center">
            <MapPinIcon className="h-6 w-6 mr-3 text-green-500" />
            <span className="text-base">{oferta?.ubicacion || 'Ubicación no especificada'}</span>
          </div>
          <div className="flex items-center">
            <CalendarIcon className="h-6 w-6 mr-3 text-purple-500" />
            <span className="text-base">Duración: {oferta?.duracion || 'No especificada'}</span>
          </div>
        </div>

        {postulacion.mensaje && (
          <div className="mt-6 pt-4 border-t border-white/20">
            <div className="flex items-center mb-2">
              <ChatBubbleLeftIcon className="h-6 w-6 mr-3 text-indigo-500" />
              <h4 className="text-base font-semibold text-white">Mensaje</h4>
            </div>
            <p className="text-gray-300 italic text-sm">{postulacion.mensaje}</p>
          </div>
        )}
      </div>

      <div className="bg-white/5 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <SignalIcon className="h-5 w-5 text-blue-500" />
          <span className="text-sm text-gray-300">
            {getStatusText(postulacion.estado)}
          </span>
        </div>
        <div className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
          Ver detalles
        </div>
      </div>
    </div>
  );
};

export default PostulacionCard;
