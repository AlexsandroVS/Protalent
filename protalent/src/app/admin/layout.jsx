'use client';
import { AdminProvider, useAdmin } from './AdminContext';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import AdminSidebar from './components/AdminSidebar';

function AdminLayoutContent({ children }) {
  const { adminUser, loading, isAuthenticated } = useAdmin();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated && pathname !== '/admin/login') {
      router.push('/admin/login');
    }
  }, [loading, isAuthenticated, pathname, router]);

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#f3f4f6'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            border: '4px solid #e5e7eb', 
            borderTop: '4px solid #3b82f6', 
            borderRadius: '50%', 
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <p style={{ color: '#6b7280' }}>Verificando acceso...</p>
        </div>
      </div>
    );
  }

  // Si es la página de login, renderizar sin el layout protegido
  if (pathname === '/admin/login') {
    return children;
  }

  // Si no está autenticado y no es la página de login, mostrar loading
  if (!isAuthenticated) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#f3f4f6'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            border: '4px solid #e5e7eb', 
            borderTop: '4px solid #3b82f6', 
            borderRadius: '50%', 
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <p style={{ color: '#6b7280' }}>Redirigiendo...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <AdminSidebar />
      
      {/* Contenido principal */}
      <div style={{ 
        flex: 1, 
        marginLeft: '280px',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <header style={{ 
          backgroundColor: 'white', 
          borderBottom: '1px solid #e5e7eb',
          padding: '1rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}>
          <h1 style={{ 
            margin: 0, 
            fontSize: '1.5rem', 
            fontWeight: 'bold',
            color: '#1f2937'
          }}>
            Panel de Administración
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ color: '#6b7280' }}>Hola, {adminUser?.nombre}</span>
            <LogoutButton />
          </div>
        </header>
        
        {/* Contenido */}
        <main style={{ 
          flex: 1,
          padding: '2rem',
          backgroundColor: '#f9fafb',
          minHeight: 'calc(100vh - 73px)'
        }}>
          {children}
        </main>
      </div>
    </div>
  );
}

function LogoutButton() {
  const { logout } = useAdmin();
  
  return (
    <button
      onClick={logout}
      style={{
        backgroundColor: '#dc2626',
        color: 'white',
        border: 'none',
        padding: '0.5rem 1rem',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '0.875rem'
      }}
    >
      Cerrar Sesión
    </button>
  );
}

export default function AdminLayout({ children }) {
  return (
    <AdminProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
      <style jsx global>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </AdminProvider>
  );
}
