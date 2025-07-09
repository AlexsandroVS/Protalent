'use client';
import { useState, useEffect } from 'react';
import { adminApiService } from './adminApi';

export default function AdminPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await adminApiService.getDashboardStats();
        setStats(data.data);
      } catch (error) {
        console.error('Error al cargar estadísticas:', error);
        setError('Error al cargar las estadísticas del dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '400px',
        fontFamily: 'Arial, sans-serif'
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
          <p style={{ color: '#6b7280' }}>Cargando estadísticas...</p>
        </div>
        <style jsx global>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        backgroundColor: '#fef2f2',
        border: '1px solid #fca5a5',
        borderRadius: '8px',
        padding: '1rem',
        color: '#dc2626',
        fontFamily: 'Arial, sans-serif'
      }}>
        {error}
      </div>
    );
  }

  return (
    <div style={{ 
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Header de bienvenida */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        padding: '2rem',
        marginBottom: '2rem'
      }}>
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: 'bold', 
          color: '#1f2937',
          margin: '0 0 0.5rem 0'
        }}>
          🎉 ¡Bienvenido al Dashboard!
        </h1>
        <p style={{ 
          fontSize: '1.1rem', 
          color: '#6b7280',
          margin: '0.5rem 0 0 0'
        }}>
          Administra todos los aspectos de ProTalent desde aquí
        </p>
      </div>

      {/* Tarjetas de estadísticas rápidas */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        <StatsCard 
          title="Usuarios Totales" 
          value={stats?.totales?.usuarios || 0} 
          icon="👥" 
          color="#3b82f6"
        />
        <StatsCard 
          title="Empresas Registradas" 
          value={stats?.totales?.empresas || 0} 
          icon="🏢" 
          color="#10b981"
        />
        <StatsCard 
          title="Ofertas Activas" 
          value={stats?.totales?.ofertas || 0} 
          icon="💼" 
          color="#f59e0b"
        />
        <StatsCard 
          title="Postulaciones" 
          value={stats?.totales?.postulaciones || 0} 
          icon="📝" 
          color="#ef4444"
        />
      </div>

      {/* Últimos usuarios registrados */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        padding: '1.5rem',
        marginBottom: '2rem'
      }}>
        <h2 style={{
          fontSize: '1.25rem',
          fontWeight: '600',
          color: '#1f2937',
          margin: '0 0 1rem 0'
        }}>
          Últimos Usuarios Registrados
        </h2>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem'
        }}>
          {stats?.ultimosUsuarios && stats.ultimosUsuarios.length > 0 ? (
            stats.ultimosUsuarios.map((usuario) => (
              <UsuarioItem key={usuario.id} usuario={usuario} />
            ))
          ) : (
            <div style={{
              textAlign: 'center',
              color: '#6b7280',
              padding: '2rem'
            }}>
              No hay usuarios registrados aún
            </div>
          )}
        </div>
      </div>

      {/* Estado del sistema */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        padding: '1.5rem'
      }}>
        <h2 style={{
          fontSize: '1.25rem',
          fontWeight: '600',
          color: '#1f2937',
          margin: '0 0 1rem 0'
        }}>
          Estado del Sistema
        </h2>
        <div style={{
          padding: '1rem',
          backgroundColor: '#dcfce7',
          border: '1px solid #16a34a',
          borderRadius: '6px',
          color: '#15803d',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span style={{ fontSize: '1.25rem' }}>✅</span>
          <span>Sistema funcionando correctamente</span>
        </div>
      </div>
    </div>
  );
}

function UsuarioItem({ usuario }) {
  const formatearFecha = (fecha) => {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getIconoPorRol = (rol) => {
    switch (rol) {
      case 'empresa':
        return '🏢';
      case 'estudiante':
        return '🎓';
      default:
        return '👤';
    }
  };

  return (
    <div style={{
      padding: '0.75rem',
      backgroundColor: '#f9fafb',
      border: '1px solid #e5e7eb',
      borderRadius: '6px',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem'
    }}>
      <span style={{ fontSize: '1.5rem' }}>
        {getIconoPorRol(usuario.rol)}
      </span>
      <div style={{ flex: 1 }}>
        <p style={{ 
          margin: 0, 
          fontSize: '0.875rem', 
          color: '#374151',
          fontWeight: '500'
        }}>
          {usuario.descripcion}
        </p>
        <p style={{ 
          margin: 0, 
          fontSize: '0.75rem', 
          color: '#6b7280' 
        }}>
          {formatearFecha(usuario.fechaRegistro)}
        </p>
      </div>
    </div>
  );
}

function StatsCard({ title, value, icon, color }) {
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      padding: '1.5rem',
      border: `2px solid ${color}20`
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1rem'
      }}>
        <span style={{
          fontSize: '2rem'
        }}>
          {icon}
        </span>
        <span style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          color: color
        }}>
          {value}
        </span>
      </div>
      <h3 style={{
        fontSize: '1rem',
        fontWeight: '600',
        color: '#4b5563',
        margin: 0
      }}>
        {title}
      </h3>
    </div>
  );
}