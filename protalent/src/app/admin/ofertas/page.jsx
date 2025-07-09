'use client';
import { useState, useEffect } from 'react';
import { adminApiService } from '../adminApi';

export default function OfertasPage() {
  const [ofertas, setOfertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOfertas();
  }, []);

  const fetchOfertas = async () => {
    try {
      setLoading(true);
      const response = await adminApiService.getOfertas();
      setOfertas(response.data.data.ofertas);
    } catch (error) {
      console.error('Error al cargar ofertas:', error);
      setError('Error al cargar las ofertas');
    } finally {
      setLoading(false);
    }
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatearSalario = (salario) => {
    if (!salario) return 'No especificado';
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0
    }).format(salario);
  };

  const obtenerEstadoColor = (estado) => {
    switch (estado) {
      case 'activa':
        return { backgroundColor: '#dcfce7', color: '#166534' };
      case 'inactiva':
        return { backgroundColor: '#fef3c7', color: '#92400e' };
      case 'cerrada':
        return { backgroundColor: '#fee2e2', color: '#991b1b' };
      default:
        return { backgroundColor: '#f3f4f6', color: '#374151' };
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
          <p style={{ color: '#6b7280' }}>Cargando ofertas...</p>
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
          text-transform: capitalize;
        }
        .empresa-cell {
          font-weight: 500;
          color: #1f2937;
        }
        .titulo-cell {
          font-weight: 600;
          color: #3b82f6;
        }
        .descripcion-cell {
          max-width: 300px;
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
              💼 Gestión de Ofertas
            </h1>
            <p style={{ 
              color: '#6b7280',
              margin: 0
            }}>
              Administra todas las ofertas de trabajo publicadas
            </p>
          </div>
          <div style={{
            backgroundColor: '#dbeafe',
            color: '#1e40af',
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            fontWeight: '600'
          }}>
            Total: {ofertas.length} ofertas
          </div>
        </div>
      </div>

      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }}>
        {ofertas.length === 0 ? (
          <div style={{ 
            padding: '3rem', 
            textAlign: 'center',
            color: '#6b7280'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>�</div>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem' }}>
              No hay ofertas registradas
            </h3>
            <p style={{ margin: 0 }}>
              Aún no se han publicado ofertas de trabajo en la plataforma.
            </p>
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Empresa</th>
                  <th>Título</th>
                  <th>Descripción</th>
                  <th>Duración</th>
                  <th>Requiere CV</th>
                  <th>Requiere Carta</th>
                  <th>Fecha Publicación</th>
                </tr>
              </thead>
              <tbody>
                {ofertas.map((oferta) => (
                  <tr key={oferta.id}>
                    <td className="empresa-cell">
                      {oferta.Empresa?.nombre || 'Sin empresa'}
                    </td>
                    <td className="titulo-cell">
                      {oferta.titulo}
                    </td>
                    <td className="descripcion-cell" title={oferta.descripcion}>
                      {oferta.descripcion}
                    </td>
                    <td>
                      {oferta.duracion || 'No especificada'}
                    </td>
                    <td>
                      <span 
                        className="status-badge"
                        style={oferta.requiereCV ? 
                          { backgroundColor: '#dcfce7', color: '#166534' } : 
                          { backgroundColor: '#fee2e2', color: '#991b1b' }
                        }
                      >
                        {oferta.requiereCV ? 'Sí' : 'No'}
                      </span>
                    </td>
                    <td>
                      <span 
                        className="status-badge"
                        style={oferta.requiereCarta ? 
                          { backgroundColor: '#dcfce7', color: '#166534' } : 
                          { backgroundColor: '#fee2e2', color: '#991b1b' }
                        }
                      >
                        {oferta.requiereCarta ? 'Sí' : 'No'}
                      </span>
                    </td>
                    <td>
                      {formatearFecha(oferta.fechaPublicacion)}
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
