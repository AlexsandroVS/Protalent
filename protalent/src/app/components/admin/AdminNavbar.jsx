// Forzando actualización con este comentario - AdminNavbar
'use client';
import Image from 'next/image';
import { useAdminAuth } from '../../context/admin/AdminAuthContext';
import { FiLogOut } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminNavbar() {
  const { adminUser, adminLogout } = useAdminAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showUserInfo, setShowUserInfo] = useState(false);

  useEffect(() => {
    if (adminUser) {
      const timer = setTimeout(() => setShowUserInfo(true), 100);
      return () => clearTimeout(timer);
    } else {
      setShowUserInfo(false);
    }
  }, [adminUser]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    adminLogout();
  };

  if (isLoggingOut) {
    return null;
  }

  return (
    <nav className="w-full bg-gray-900/95 backdrop-blur-md border-b border-gray-700 px-6 py-3 flex items-center justify-between shadow-2xl sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <Link href="/admin" className="flex items-center gap-3">
          <Image src="/logo.jpg" alt="Logo de ProTalent" width={40} height={40} priority className="rounded-lg shadow-md border-2 border-sky-500/50" />
          <span className="text-xl font-bold text-white tracking-tight">ProTalent</span>
        </Link>
        <span
          className="text-xs bg-gradient-to-r from-sky-500 via-cyan-500 to-teal-500 text-white px-3.5 py-1.5 rounded-full ml-2 font-semibold shadow-lg tracking-wider"
        >
          ADMIN PANEL
        </span>
      </div>
      <div className="flex items-center gap-5">
        {adminUser && (
          <span
            className={`text-slate-300 text-sm transition-opacity duration-500 ease-in-out ${showUserInfo ? 'opacity-100' : 'opacity-0'}`}
          >
            Admin: <span className="font-semibold text-sky-400">{adminUser.nombre}</span>
          </span>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75"
        >
          <FiLogOut className="w-4 h-4" />
          Salir
        </button>
      </div>
    </nav>
  );
} 