import Image from 'next/image';
import { ReactNode } from 'react';
import { FiMoreHorizontal } from 'react-icons/fi';

interface BaseCardProps {
  title?: string;
  image?: string;
  avatar?: string;
  name?: string;
  description?: string;
  actions?: ReactNode;
  variant?: 'default' | 'compact' | 'detailed';
  className?: string;
}

export default function BaseCard({ 
  title, 
  image, 
  avatar, 
  name, 
  description, 
  actions, 
  variant = 'default',
  className = '' 
}: BaseCardProps) {
  return (
    <div className={`bg-white rounded-xl shadow-md overflow-hidden ${className}`}>
      {/* Encabezado */}
      {(name || title) && (
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            {avatar && (
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <Image 
                  src={avatar} 
                  alt={name || 'Avatar'} 
                  width={40} 
                  height={40} 
                  className="object-cover w-full h-full"
                />
              </div>
            )}
            <div>
              {name && <h3 className="font-semibold text-gray-800">{name}</h3>}
              {title && <h2 className="text-lg font-bold text-gray-900">{title}</h2>}
            </div>
          </div>
          <button className="text-gray-500 hover:text-gray-700">
            <FiMoreHorizontal />
          </button>
        </div>
      )}

      {/* Imagen */}
      {image && (
        <div className="w-full h-48 relative overflow-hidden">
          <Image 
            src={image} 
            alt={title || 'Card image'} 
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
      )}

      {/* Contenido */}
      {description && (
        <div className="p-4">
          <p className="text-gray-600 text-sm">{description}</p>
        </div>
      )}

      {/* Acciones */}
      {actions && (
        <div className="p-4 border-t border-gray-100">
          <div className="flex justify-between space-x-2">
            {actions}
          </div>
        </div>
      )}
    </div>
  );
} 