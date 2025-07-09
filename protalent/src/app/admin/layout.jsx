'use client';
import { AdminProvider, useAdmin } from './AdminContext';
import AdminLogin from './AdminLogin';

function AdminLayoutContent({ children }) {
  const { adminUser, loading, isAuthenticated } = useAdmin();

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

  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  return (
    <div>
      {/* Header simple */}
      <header style={{ 
        backgroundColor: '#1f2937', 
        color: 'white', 
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 'bold' }}>
          ProTalent Admin
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span>Hola, {adminUser?.nombre}</span>
          <LogoutButton />
        </div>
      </header>
      
      {/* Contenido */}
      <main style={{ padding: '2rem' }}>
        {children}
      </main>
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
