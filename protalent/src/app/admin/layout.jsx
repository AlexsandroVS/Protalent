'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdminAuthProvider, useAdminAuth } from '../context/admin/AdminAuthContext';
import AdminNavbar from '../components/admin/AdminNavbar';
import AdminSidebar from '../components/admin/AdminSidebar';

function AdminLayoutContent({ children }) {
  const { adminUser, loading, isAdmin } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.push('/admin/login');
    }
  }, [adminUser, loading, isAdmin, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Verificando acceso de administrador...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null; // El useEffect ya redirigirá
  }

  const sidebarWidth = 'w-64';
  const navHeight = '68px';

  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      <AdminNavbar />
      <div className="flex flex-1">
        <AdminSidebar />
        <main 
          className="flex-1 bg-gray-100 text-gray-800"
          style={{ 
            marginLeft: sidebarWidth.includes('w-') ? `${parseInt(sidebarWidth.split('-')[1]) * 0.25}rem` : sidebarWidth,
            paddingTop: navHeight,
          }}
        >
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }) {
  return (
    <AdminAuthProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AdminAuthProvider>
  );
} 