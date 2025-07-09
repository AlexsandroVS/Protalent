'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  BuildingOfficeIcon, 
  UserGroupIcon, 
  LightBulbIcon, 
  ChartBarIcon, 
  ClockIcon, 
  ShieldCheckIcon 
} from '@heroicons/react/24/outline';

const World = dynamic(() => import('./components/ui/globe').then((mod) => mod.World), {
  ssr: false
});

export default function Home() {
  const globeConfig = {
    pointSize: 5,
    globeColor: "#062056",
    showAtmosphere: true,
    atmosphereColor: "#FFFFFF",
    atmosphereAltitude: 0.1,
    emissive: "#062056",
    emissiveIntensity: 0.2,
    shininess: 0.9,
    polygonColor: "rgba(255,255,255,0.7)",
    ambientLight: "#38bdf8",
    directionalLeftLight: "#ffffff",
    directionalTopLight: "#ffffff",
    pointLight: "#ffffff",
    arcTime: 1500,
    arcLength: 0.9,
    rings: 1,
    maxRings: 3,
    initialPosition: { lat: -12.0464, lng: -77.0428 }, // Coordenadas de Lima, Perú
    autoRotate: true,
    autoRotateSpeed: 0.3,
  };

  const sampleArcs = [
    {
      order: 1,
      startLat: -12.0464, // Lima
      startLng: -77.0428,
      endLat: -33.4489, // Santiago
      endLng: -70.6693,
      arcAlt: 0.3,
      color: "#06b6d4"
    },
    {
      order: 2,
      startLat: -12.0464, // Lima
      startLng: -77.0428,
      endLat: -22.9068, // Rio de Janeiro
      endLng: -43.1729,
      arcAlt: 0.4,
      color: "#3b82f6"
    },
    {
      order: 3,
      startLat: -12.0464, // Lima
      startLng: -77.0428,
      endLat: 40.7128, // New York
      endLng: -74.0060,
      arcAlt: 0.5,
      color: "#6366f1"
    }
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#062056] to-black flex flex-col items-center overflow-hidden">
      {/* Hero Section con Globo */}
      <div className="relative w-full h-screen flex flex-col items-center justify-center">
        <div className="absolute inset-0 z-10 opacity-70">
          <World 
            globeConfig={globeConfig} 
            data={sampleArcs} 
          />
        </div>

        <motion.div 
          className="relative z-20 text-center py-20 px-4 max-w-4xl"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, type: "spring", stiffness: 50 }}
        >
          <h1 className="text-4xl md:text-7xl font-bold text-white mb-6">
            Conecta tu Talento, <span className="text-[#38bdf8]">Impulsa tu Futuro</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-8">
            La plataforma que transforma tus prácticas profesionales en oportunidades reales
          </p>
          
          <Link 
            href="/auth/login" 
            className="px-10 py-4 bg-[#38bdf8] hover:bg-[#0ea5e9] text-white rounded-full font-semibold text-lg transition-all duration-300 ease-in-out transform hover:scale-105 inline-flex items-center gap-3 shadow-lg hover:shadow-xl"
          >
            Explorar Ofertas
            <UserGroupIcon className="h-6 w-6" />
          </Link>
        </motion.div>
      </div>

      {/* Sección de Características */}
      <div className="w-full bg-white py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#062056] mb-4">
              Tu Futuro Profesional, Nuestra Misión
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              ProTalent conecta estudiantes de TECSUP con las mejores oportunidades de prácticas y desarrollo profesional.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <BuildingOfficeIcon className="h-8 w-8 text-[#38bdf8]" />,
                title: 'Para Empresas',
                description: 'Encuentra talento excepcional de TECSUP para impulsar tu organización.'
              },
              {
                icon: <UserGroupIcon className="h-8 w-8 text-[#6366f1]" />,
                title: 'Para Estudiantes',
                description: 'Descubre prácticas que marcarán el inicio de tu carrera profesional.'
              },
              {
                icon: <LightBulbIcon className="h-8 w-8 text-[#06b6d4]" />,
                title: 'Innovación',
                description: 'Plataforma tecnológica diseñada para conectar talento con oportunidades.'
              },
              {
                icon: <ChartBarIcon className="h-8 w-8 text-[#3b82f6]" />,
                title: 'Métricas',
                description: 'Seguimiento en tiempo real de tus postulaciones y procesos.'
              },
              {
                icon: <ClockIcon className="h-8 w-8 text-[#0ea5e9]" />,
                title: 'Eficiencia',
                description: 'Simplificamos la búsqueda de prácticas para estudiantes y empresas.'
              },
              {
                icon: <ShieldCheckIcon className="h-8 w-8 text-[#062056]" />,
                title: 'Seguridad',
                description: 'Protegemos tus datos con los más altos estándares de privacidad.'
              }
            ].map((feature, index) => (
              <motion.div 
                key={index} 
                className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 ease-in-out"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-16 h-16 rounded-lg flex items-center justify-center mb-4 bg-opacity-10" style={{ backgroundColor: `${feature.icon.props.className.split(' ')[2]}10` }}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-[#062056] mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
