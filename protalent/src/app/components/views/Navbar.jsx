'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../../context/auth/AuthContext';

export default function AuthNavbar() {
  const { user, logout, loading } = useAuth();

  // console.log('[AuthNavbar] Renderizando. User:', user, 'Loading:', loading);

  return (
    <nav className="w-full bg-[#062056]/80 backdrop-blur-md border-b border-[#38bdf8]/20 px-6 py-3 flex items-center justify-between shadow-xl sticky top-0 z-50">
      <Link href="/" className="flex items-center gap-3 text-xl font-bold text-white hover:text-[#38bdf8] transition-colors duration-300">
        <Image src="/logo.jpg" alt="Logo de ProTalent" width={45} height={45} priority className="rounded-lg shadow-lg" /> 
        <span className="text-2xl font-bold text-white tracking-tight">ProTalent</span>
      </Link>
      <div className="space-x-6 flex items-center">
        {!loading && user ? (
          <>
            <Link href="/dashboard/perfil" 
              className="text-gray-200 hover:text-[#38bdf8] transition-colors duration-300 font-medium text-sm">
              Perfil
            </Link>
            <button 
              onClick={async () => { await logout(); }}
              className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-[#38bdf8] hover:bg-[#0ea5e9] shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#38bdf8] focus:ring-opacity-60"
            >
              Cerrar Sesión
            </button>
          </>
        ) : !loading && !user ? (
          <>
            <Link href="/auth/login" 
              className="px-4 py-2 rounded-lg text-sm font-semibold text-[#38bdf8] hover:text-[#0ea5e9] hover:bg-[#38bdf8]/10 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#38bdf8] focus:ring-opacity-50">
              Login
            </Link>
            <Link href="/auth/register" 
              className="px-5 py-2.5 rounded-lg text-sm font-semibold text-[#062056] bg-[#38bdf8] hover:bg-[#0ea5e9] shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#38bdf8] focus:ring-opacity-60">
              Registro
            </Link>
          </>
        ) : (
          <div className="h-[42px] flex items-center animate-pulse">
            <div className="w-20 h-5 bg-gray-300/70 rounded mr-4"></div>
            <div className="w-24 h-9 bg-gray-300/70 rounded"></div>
          </div>
        )}
      </div>
    </nav>
  );
}