import { FiEdit2, FiMail, FiMapPin, FiPhone, FiGlobe, FiLinkedin, FiTwitter, FiInstagram } from 'react-icons/fi';
import Image from 'next/image';

export default function ProfileCard() {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 max-w-sm mx-auto space-y-5">
      <div className="flex flex-col items-center">
        <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-blue-100 mb-4">
          <Image 
            src="/images/avatar.jpg" 
            alt="Profile Picture" 
            width={96} 
            height={96} 
            className="object-cover w-full h-full"
          />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-800">Juan Pérez</h2>
          <p className="text-sm text-gray-500">Desarrollador Web Full Stack</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 text-center border-t pt-4">
        <div>
          <p className="text-lg font-bold text-blue-600">256</p>
          <p className="text-xs text-gray-500">Publicaciones</p>
        </div>
        <div>
          <p className="text-lg font-bold text-blue-600">1.2K</p>
          <p className="text-xs text-gray-500">Seguidores</p>
        </div>
        <div>
          <p className="text-lg font-bold text-blue-600">512</p>
          <p className="text-xs text-gray-500">Siguiendo</p>
        </div>
      </div>

      <div className="space-y-3">
        <button className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors">
          Editar Perfil
        </button>
        <div className="flex space-x-2">
          <button className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-md hover:bg-gray-200 transition-colors">
            Compartir
          </button>
          <button className="flex-1 bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition-colors">
            Contactar
          </button>
        </div>
      </div>
    </div>
  );
}
