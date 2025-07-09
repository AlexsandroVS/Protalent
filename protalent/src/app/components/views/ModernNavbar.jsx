'use client';

import { useState, useEffect, Fragment } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, Transition } from '@headlessui/react';
import { FiLogOut, FiUser, FiEdit2, FiChevronDown, FiMenu, FiX, FiHome, FiFileText, FiBriefcase, FiUsers, FiBookOpen } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '../../context/auth/AuthContext';

// Navigation items with icons and paths
const navItems = [
  { name: 'Inicio', path: '/dashboard', icon: <FiHome className="w-5 h-5" /> },
  { name: 'Postulaciones', path: '/dashboard/postulaciones', icon: <FiFileText className="w-5 h-5" /> },
  { name: 'Ofertas', path: '/dashboard/ofertas', icon: <FiBriefcase className="w-5 h-5" /> },
  { name: 'Empresas', path: '/dashboard/empresas', icon: <FiUsers className="w-5 h-5" /> },
];

export default function ModernNavbar() {
  const { user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-[#062056]/95 backdrop-blur-md shadow-lg py-2' 
          : 'bg-[#062056]/80 backdrop-blur-sm py-3'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center space-x-2">
            <div className="w-10 h-10 relative">
              <Image 
                src="/logo.jpg" 
                alt="ProTalent" 
                fill 
                className="rounded-lg object-cover"
                priority
              />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              ProTalent
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center ${
                  pathname === item.path
                    ? 'bg-[#38bdf8]/20 text-[#38bdf8]'
                    : 'text-white hover:bg-[#38bdf8]/10 hover:text-[#38bdf8]'
                }`}
              >
                <span className="mr-2 text-base">{item.icon}</span>
                {item.name}
                {pathname === item.path && (
                  <motion.span 
                    className="absolute bottom-0 left-0 w-full h-0.5 bg-[#38bdf8]"
                    layoutId="activeNavItem"
                    transition={{
                      type: 'spring',
                      stiffness: 300,
                      damping: 24
                    }}
                  />
                )}
              </Link>
            ))}

            {/* Blog Button con animación */}
            <Link 
              href="/blog"
              className="ml-4 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#38bdf8] to-[#0ea5e9] text-white text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:rotate-3 group relative overflow-hidden"
            >
              <motion.span 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 300, 
                  damping: 20 
                }}
                className="flex items-center"
              >
                <FiBookOpen className="w-5 h-5 mr-2" /> Blog
                <motion.div
                  className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                  initial={{ scale: 0 }}
                  whileHover={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.span>
            </Link>
          </nav>

          {/* User Menu */}
          <div className="hidden md:flex items-center
          ">
            <Menu as="div" className="relative ml-3">
              <div>
                <Menu.Button className="flex items-center space-x-2 max-w-xs rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  <div className="h-9 w-9 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                    {user?.nombre?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="hidden lg:inline-block text-sm font-medium text-gray-700">
                    {user?.nombre || 'Usuario'}
                  </span>
                  <FiChevronDown className="h-4 w-4 text-gray-400" />
                </Menu.Button>
              </div>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 py-1 focus:outline-none">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900 truncate">{user?.nombre || 'Usuario'}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email || ''}</p>
                  </div>
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        href="/dashboard/perfil"
                        className={`${
                          active ? 'bg-gray-100' : ''
                        } block px-4 py-2.5 text-sm text-gray-700 flex items-center`}
                      >
                        <FiUser className="mr-3 h-5 w-5 text-gray-400" />
                        Mi Perfil
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        href="/dashboard/perfil/editar"
                        className={`${
                          active ? 'bg-gray-100' : ''
                        } block px-4 py-2.5 text-sm text-gray-700 flex items-center`}
                      >
                        <FiEdit2 className="mr-3 h-5 w-5 text-gray-400" />
                        Editar Perfil
                      </Link>
                    )}
                  </Menu.Item>
                  <div className="border-t border-gray-100 my-1"></div>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={handleLogout}
                        className={`${
                          active ? 'bg-gray-100' : ''
                        } w-full text-left px-4 py-2.5 text-sm text-red-600 flex items-center`}
                      >
                        <FiLogOut className="mr-3 h-5 w-5" />
                        Cerrar Sesión
                      </button>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              <span className="sr-only">Abrir menú principal</span>
              {mobileMenuOpen ? (
                <FiX className="block h-6 w-6" />
              ) : (
                <FiMenu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white border-t border-gray-200"
          >
            <div className="pt-2 pb-3 space-y-1 px-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2.5 rounded-md text-base font-medium ${
                    pathname === item.path
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center">
                    <span className="mr-3">{item.icon}</span>
                    {item.name}
                  </div>
                </Link>
              ))}
              <div className="pt-4 pb-2 border-t border-gray-200 mt-2">
                <div className="flex items-center px-3 py-2">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm mr-3">
                    {user?.nombre?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{user?.nombre || 'Usuario'}</p>
                    <p className="text-xs text-gray-500">{user?.email || ''}</p>
                  </div>
                </div>
                <div className="mt-2 space-y-1">
                  <Link
                    href="/dashboard/perfil"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                  >
                    Mi Perfil
                  </Link>
                  <Link
                    href="/dashboard/perfil/editar"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                  >
                    Editar Perfil
                  </Link>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
