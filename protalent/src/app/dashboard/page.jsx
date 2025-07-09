'use client';

import Link from 'next/link';
import { SparklesCore } from "../components/ui/sparkles"
import { BuildingOfficeIcon, UserGroupIcon, LightBulbIcon, ChartBarIcon, ClockIcon, ShieldCheckIcon, ArrowsPointingOutIcon, DevicePhoneMobileIcon, ChatBubbleLeftRightIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

export default function DashboardPage() {
  return (
    <div className="relative min-h-screen bg-black flex flex-col items-center overflow-hidden pt-24 px-4 sm:px-6 lg:px-8">
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
        
      <div className="relative z-10 max-w-7xl w-full">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/10 p-8"
        >
          {/* Sección de Bienvenida */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Bienvenido a <span className="text-[#38bdf8]">ProTalent</span>
          </h1>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto">
              Conectamos talento estudiantil con oportunidades profesionales de vanguardia
            </p>
          </div>

          {/* Sección de Acceso Rápido */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {[
              {
                icon: <BuildingOfficeIcon className="h-8 w-8 text-[#38bdf8]" />,
                title: 'Ofertas',
                description: 'Explora oportunidades de prácticas personalizadas',
                link: '/dashboard/ofertas',
                stats: '50+ Nuevas Ofertas'
              },
              {
                icon: <UserGroupIcon className="h-8 w-8 text-[#0ea5e9]" />,
                title: 'Postulaciones',
                description: 'Gestiona tus solicitudes en un solo lugar',
                link: '/dashboard/postulaciones',
                stats: '25 Postulaciones Activas'
              },
              {
                icon: <LightBulbIcon className="h-8 w-8 text-[#06b6d4]" />,
                title: 'Empresas',
                description: 'Conoce a nuestros socios estratégicos',
                link: '/dashboard/empresas',
                stats: '20 Empresas Asociadas'
              }
            ].map((item, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  delay: index * 0.2, 
                  duration: 0.5 
                }}
                whileHover={{ scale: 1.05 }}
                className="bg-white/10 border border-white/10 rounded-xl p-6 hover:border-[#38bdf8]/30 transition-all duration-300 cursor-pointer group"
                onClick={() => window.location.href = item.link}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="w-16 h-16 rounded-lg flex items-center justify-center bg-opacity-10" style={{ backgroundColor: `${item.icon.props.className.split(' ')[2]}10` }}>
                    {item.icon}
                  </div>
                  <span className="text-sm text-[#38bdf8] bg-[#38bdf8]/10 px-3 py-1 rounded-full">
                    {item.stats}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-gray-300 mb-4">{item.description}</p>
                <div className="flex items-center text-[#38bdf8] group-hover:translate-x-2 transition-transform">
                  <span className="mr-2">Explorar</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Sección de Estadísticas */}
          <div className="grid md:grid-cols-4 gap-6 mb-12 bg-white/5 rounded-xl p-6 border border-white/10">
            {[
              { 
                title: 'Ofertas Activas', 
                value: '50+', 
                icon: '💼',
                color: 'text-[#38bdf8]'
              },
              { 
                title: 'Empresas', 
                value: '20+', 
                icon: '🏢',
                color: 'text-[#0ea5e9]'
              },
              { 
                title: 'Postulantes', 
                value: '500+', 
                icon: '👥',
                color: 'text-[#06b6d4]'
              },
              { 
                title: 'Éxito', 
                value: '85%', 
                icon: '🎯',
                color: 'text-[#38bdf8]'
              }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  delay: index * 0.2, 
                  duration: 0.5 
                }}
                className="text-center bg-white/10 rounded-xl p-4 border border-white/10 hover:border-[#38bdf8]/30 transition-all"
              >
                <div className={`text-4xl font-bold mb-2 ${stat.color}`}>{stat.value}</div>
                <div className="text-xl mb-2">{stat.icon}</div>
                <p className="text-gray-300 text-sm">{stat.title}</p>
              </motion.div>
            ))}
      </div>

          {/* Sección de Próximas Acciones */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">Próximas Acciones</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  title: 'Completar Perfil',
                  description: 'Añade más detalles para aumentar tus posibilidades',
                  icon: '👤',
                  action: 'Editar Perfil',
                  link: '/dashboard/perfil/editar'
                },
                {
                  title: 'Nuevas Ofertas',
                  description: 'Descubre oportunidades que se ajustan a tu perfil',
                  icon: '🚀',
                  action: 'Explorar Ofertas',
                  link: '/dashboard/ofertas'
                }
              ].map((action, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    delay: index * 0.2, 
                    duration: 0.5 
                  }}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/10 border border-white/10 rounded-xl p-6 flex items-center justify-between hover:border-[#38bdf8]/30 transition-all cursor-pointer group"
                  onClick={() => window.location.href = action.link}
                >
                  <div>
                    <div className="text-3xl mb-2">{action.icon}</div>
                    <h3 className="text-xl font-bold text-white mb-2">{action.title}</h3>
                    <p className="text-gray-300 mb-4">{action.description}</p>
                </div>
                  <div className="text-[#38bdf8] group-hover:translate-x-2 transition-transform flex items-center">
                    <span className="mr-2">{action.action}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
              </div>
                </motion.div>
              ))}
        </div>
      </div>

          {/* Botón de Blog Mejorado */}
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="inline-block relative group"
            >
            <Link 
                href="/blog" 
                className="relative z-10 inline-flex items-center px-10 py-4 bg-gradient-to-r from-[#38bdf8] to-[#0ea5e9] text-[#062056] rounded-full font-semibold shadow-2xl hover:shadow-xl transition-all duration-300 transform hover:scale-105 group"
              >
                <motion.span
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 300, 
                    damping: 20 
                  }}
                  className="flex items-center relative z-20"
                >
                  <span className="mr-3 text-2xl">📝</span>
                  Descubre Nuestro Blog
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-3 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </motion.span>
                
                {/* Efecto de brillo */}
                <motion.div
                  className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-full transition-opacity duration-300 z-0"
                  initial={{ scale: 0 }}
                  whileHover={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                />
                
                {/* Efecto de partículas */}
                <div className="absolute inset-0 overflow-hidden rounded-full pointer-events-none">
                  <SparklesCore
                    id="blog-button-sparkles"
                    background="transparent"
                    minSize={0.2}
                    maxSize={0.8}
                    particleDensity={30}
                    className="w-full h-full opacity-30"
                    particleColor="#FFFFFF"
                  />
            </div>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}