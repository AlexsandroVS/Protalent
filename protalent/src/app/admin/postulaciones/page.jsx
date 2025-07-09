'use client';
import { useState, useEffect } from 'react';
import { adminApiService } from '../adminApi';

export default function PostulacionesPage() {
  const [postulaciones, setPostulaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPostulaciones();
  }, []);

  const fetchPostulaciones = async () => {
    try {
      setLoading(true);
      const response = await adminApiService.getPostulaciones();
      setPostulaciones(response.data.data.postulaciones);
    } catch (error) {
      console.error('Error al cargar postulaciones:', error);
      setError('Error al cargar las postulaciones');
    } finally {
      setLoading(false);
    }
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const obtenerEstadoColor = (estado) => {
    switch (estado) {
      case 'pendiente':
        return { backgroundColor: '#fef3c7', color: '#92400e' };
      case 'en_revision':
        return { backgroundColor: '#dbeafe', color: '#1e40af' };
      case 'aceptada':
        return { backgroundColor: '#dcfce7', color: '#166534' };
      case 'rechazada':
        return { backgroundColor: '#fee2e2', color: '#991b1b' };
      default:
        return { backgroundColor: '#f3f4f6', color: '#374151' };
    }
  };

  const obtenerEstadoTexto = (estado) => {
    switch (estado) {
      case 'pendiente':
        return 'Pendiente';
      case 'en_revision':
        return 'En Revisión';
      case 'aceptada':
        return 'Aceptada';
      case 'rechazada':
        return 'Rechazada';
      default:
        return estado;
    }
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '400px' 
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            border: '4px solid #e5e7eb', 
            borderTop: '4px solid #3b82f6', 
            borderRadius: '50%', 
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem auto'
          }}></div>
          <p style={{ color: '#6b7280' }}>Cargando postulaciones...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        backgroundColor: '#fee2e2',
        border: '1px solid #fecaca',
        borderRadius: '8px',
        padding: '1rem',
        margin: '1rem 0'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}>⚠️</span>
          <div>
            <h3 style={{ margin: '0 0 0.25rem 0', color: '#991b1b' }}>Error</h3>
            <p style={{ margin: 0, color: '#b91c1c' }}>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .table-container {
          overflow-x: auto;
        }
        .table {
          width: 100%;
          border-collapse: collapse;
          font-size: 14px;
        }
        .table th,
        .table td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #e5e7eb;
        }
        .table th {
          background-color: #f9fafb;
          font-weight: 600;
          color: #374151;
          position: sticky;
          top: 0;
        }
        .table tr:hover {
          background-color: #f9fafb;
        }
        .status-badge {
          display: inline-block;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
        }
        .estudiante-cell {
          font-weight: 500;
          color: '#1f2937;
        }
        .oferta-cell {
          font-weight: 600;
          color: '#3b82f6';
        }
        .empresa-cell {
          color: '#059669';
          font-weight: 500;
        }
        .mensaje-cell {
          max-width: 250px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      `}</style>

      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        padding: '2rem',
        marginBottom: '2rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ 
              fontSize: '2rem', 
              fontWeight: 'bold', 
              color: '#1f2937',
              margin: '0 0 0.5rem 0'
            }}>
              📝 Gestión de Postulaciones
            </h1>
            <p style={{ 
              color: '#6b7280',
              margin: 0
            }}>
              Administra todas las postulaciones de los estudiantes
            </p>
          </div>
          <div style={{
            backgroundColor: '#dbeafe',
            color: '#1e40af',
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            fontWeight: '600'
          }}>
            Total: {postulaciones.length} postulaciones
          </div>
        </div>
      </div>

      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }}>
        {postulaciones.length === 0 ? (
          <div style={{ 
            padding: '3rem', 
            textAlign: 'center',
            color: '#6b7280'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>�</div>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem' }}>
              No hay postulaciones registradas
            </h3>
            <p style={{ margin: 0 }}>
              Aún no se han realizado postulaciones a ofertas de trabajo.
            </p>
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Estudiante</th>
                  <th>Email</th>
                  <th>Carrera</th>
                  <th>Oferta</th>
                  <th>Empresa</th>
                  <th>Mensaje</th>
                  <th>Estado</th>
                  <th>Fecha Postulación</th>
                </tr>
              </thead>
              <tbody>
                {postulaciones.map((postulacion) => (
                  <tr key={postulacion.id}>
                    <td className="estudiante-cell">
                      {postulacion.Estudiante?.nombre || 'Sin nombre'}
                    </td>
                    <td>
                      {postulacion.Estudiante?.Usuario?.email || 'Sin email'}
                    </td>
                    <td>
                      {postulacion.Estudiante?.carrera || 'Sin carrera'}
                    </td>
                    <td className="oferta-cell">
                      {postulacion.Oferta?.titulo || 'Sin oferta'}
                    </td>
                    <td className="empresa-cell">
                      {postulacion.Oferta?.Empresa?.nombre || 'Sin empresa'}
                    </td>
                    <td className="mensaje-cell" title={postulacion.mensaje}>
                      {postulacion.mensaje || 'Sin mensaje'}
                    </td>
                    <td>
                      <span 
                        className="status-badge"
                        style={obtenerEstadoColor(postulacion.estado)}
                      >
                        {obtenerEstadoTexto(postulacion.estado)}
                      </span>
                    </td>
                    <td>
                      {formatearFecha(postulacion.fechaPostulacion)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
