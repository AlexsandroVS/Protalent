'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminSidebar() {
  const pathname = usePathname();

  const menuItems = [
    {
      title: 'Dashboard',
      href: '/admin',
      icon: '📊'
    },
    {
      title: 'Usuarios',
      href: '/admin/usuarios',
      icon: '👥'
    },
    {
      title: 'Empresas',
      href: '/admin/empresas',
      icon: '🏢'
    },
    {
      title: 'Ofertas',
      href: '/admin/ofertas',
      icon: '💼'
    },
    {
      title: 'Categorías',
      href: '/admin/categorias',
      icon: '🏷️'
    },
    {
      title: 'Blog Posts',
      href: '/admin/blog-posts',
      icon: '📰'
    },
    {
      title: 'Comentarios',
      href: '/admin/comentarios',
      icon: '💬'
    },
  ];

  return (
    <div style={{
      width: '280px',
      height: '100vh',
      backgroundColor: '#1f2937',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      left: 0,
      top: 0,
      zIndex: 1000
    }}>
      {/* Header del sidebar */}
      <div style={{
        padding: '1.5rem',
        borderBottom: '1px solid #374151',
        backgroundColor: '#111827'
      }}>
        <h2 style={{
          margin: 0,
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: '#3b82f6'
        }}>
          ProTalent
        </h2>
        <p style={{
          margin: '0.5rem 0 0 0',
          fontSize: '0.875rem',
          color: '#9ca3af'
        }}>
          Panel de Administración
        </p>
      </div>

      {/* Menú principal */}
      <nav style={{
        flex: 1,
        padding: '1rem 0',
        overflowY: 'auto'
      }}>
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '0.75rem 1.5rem',
                color: isActive ? '#3b82f6' : '#d1d5db',
                backgroundColor: isActive ? '#1e3a8a' : 'transparent',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
                borderLeft: isActive ? '4px solid #3b82f6' : '4px solid transparent'
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.target.style.backgroundColor = '#374151';
                  e.target.style.color = 'white';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = '#d1d5db';
                }
              }}
            >
              <span style={{
                fontSize: '1.25rem',
                marginRight: '0.75rem'
              }}>
                {item.icon}
              </span>
              <span style={{
                fontSize: '0.875rem',
                fontWeight: isActive ? '600' : '500'
              }}>
                {item.title}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Footer del sidebar */}
      <div style={{
        padding: '1rem 1.5rem',
        borderTop: '1px solid #374151',
        backgroundColor: '#111827'
      }}>
        <p style={{
          margin: 0,
          fontSize: '0.75rem',
          color: '#6b7280',
          textAlign: 'center'
        }}>
          © 2025 ProTalent Admin
        </p>
      </div>
    </div>
  );
}
