'use client';
import { useState, useEffect } from 'react';
import { adminApiService } from '../adminApi';

export default function EmpresasPage() {
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEmpresas();
  }, []);

  const fetchEmpresas = async () => {
    try {
      setLoading(true);
      const response = await adminApiService.getEmpresas();
      setEmpresas(response.data.data.empresas);
    } catch (error) {
      console.error('Error al cargar empresas:', error);
      setError('Error al cargar las empresas');
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
            margin: '0 auto 1rem'
          }}></div>
          <p style={{ color: '#6b7280' }}>Cargando empresas...</p>
        </div>
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
        color: '#dc2626'
      }}>
        {error}
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Header */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        padding: '2rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem'
        }}>
          <h1 style={{ 
            fontSize: '2rem', 
            fontWeight: 'bold', 
            color: '#1f2937',
            margin: 0
          }}>
            🏢 Gestión de Empresas
          </h1>
          <div style={{
            backgroundColor: '#059669',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '20px',
            fontSize: '0.875rem',
            fontWeight: '500'
          }}>
            Total: {empresas.length}
          </div>
        </div>
        <p style={{ 
          color: '#6b7280',
          margin: 0
        }}>
          Lista de todas las empresas registradas en la plataforma
        </p>
      </div>

      {/* Lista de empresas */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }}>
        <div style={{
          padding: '1.5rem 1.5rem 0 1.5rem',
          borderBottom: '1px solid #e5e7eb'
        }}>
          <h2 style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: '#1f2937',
            margin: '0 0 1rem 0'
          }}>
            Empresas Registradas
          </h2>
        </div>

        {empresas.length === 0 ? (
          <div style={{ 
            padding: '3rem', 
            textAlign: 'center', 
            color: '#6b7280' 
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏢</div>
            <h3 style={{ margin: '0 0 0.5rem 0' }}>No hay empresas registradas</h3>
            <p style={{ margin: 0 }}>Aún no se han registrado empresas en la plataforma</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ backgroundColor: '#f9fafb' }}>
                <tr>
                  <th style={tableHeaderStyle}>Empresa</th>
                  <th style={tableHeaderStyle}>Email</th>
                  <th style={tableHeaderStyle}>Fecha de Registro</th>
                </tr>
              </thead>
              <tbody>
                {empresas.map((empresa) => (
                  <tr key={empresa.id} style={{ backgroundColor: 'white' }}>
                    <td style={cellStyle}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ fontSize: '1.5rem' }}>🏢</span>
                        <div>
                          <div style={{ fontWeight: '500', color: '#111827' }}>
                            {empresa.nombre || empresa.nombreEmpresa}
                          </div>
                          {empresa.descripcion && (
                            <div style={{ 
                              fontSize: '0.75rem', 
                              color: '#6b7280',
                              marginTop: '0.25rem'
                            }}>
                              {empresa.descripcion.length > 50 
                                ? `${empresa.descripcion.substring(0, 50)}...`
                                : empresa.descripcion
                              }
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td style={cellStyle}>
                      <span style={{ color: '#374151' }}>
                        {empresa.email || 'N/A'}
                      </span>
                    </td>
                    <td style={cellStyle}>
                      <span style={{ color: '#6b7280' }}>
                        {formatearFecha(empresa.fechaRegistro || empresa.createdAt)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

const tableHeaderStyle = {
  padding: '0.75rem',
  textAlign: 'left',
  fontSize: '0.875rem',
  fontWeight: '600',
  color: '#374151',
  borderBottom: '1px solid #e5e7eb'
};

const cellStyle = {
  padding: '0.75rem',
  borderBottom: '1px solid #e5e7eb',
  fontSize: '0.875rem'
};
