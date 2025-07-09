'use client';
import { useState } from 'react';
import { adminApiService } from '../../adminApi';

export default function ExportButton({ filters, onSuccess, onError }) {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [exportOptions, setExportOptions] = useState({
    format: 'csv',
    includeFields: {
      id: true,
      nombre: true,
      email: true,
      rol: true,
      fechaRegistro: true,
      tieneGoogle: true,
      empresaInfo: false,
      estudianteInfo: false
    }
  });

  const handleExport = async () => {
    setLoading(true);
    try {
      const response = await adminApiService.exportUsuarios({
        ...filters,
        ...exportOptions
      });
      
      // Crear y descargar el archivo
      const blob = new Blob([response.data], { 
        type: exportOptions.format === 'csv' ? 'text/csv' : 'application/json' 
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `usuarios_${new Date().toISOString().split('T')[0]}.${exportOptions.format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      onSuccess(`Usuarios exportados exitosamente en formato ${exportOptions.format.toUpperCase()}`);
      setShowModal(false);
    } catch (error) {
      console.error('Error al exportar usuarios:', error);
      onError('Error al exportar los usuarios');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        style={{
          backgroundColor: '#059669',
          color: 'white',
          border: 'none',
          padding: '0.75rem 1.5rem',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '0.875rem',
          fontWeight: '500',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}
      >
        📊 Exportar
      </button>

      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '2rem',
            width: '100%',
            maxWidth: '500px',
            margin: '1rem'
          }}>
            <h3 style={{
              margin: '0 0 1.5rem 0',
              fontSize: '1.25rem',
              fontWeight: '600',
              color: '#1f2937'
            }}>
              Exportar Usuarios
            </h3>

            {/* Formato */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Formato de exportación
              </label>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="radio"
                    value="csv"
                    checked={exportOptions.format === 'csv'}
                    onChange={(e) => setExportOptions(prev => ({ ...prev, format: e.target.value }))}
                  />
                  CSV (Excel)
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="radio"
                    value="json"
                    checked={exportOptions.format === 'json'}
                    onChange={(e) => setExportOptions(prev => ({ ...prev, format: e.target.value }))}
                  />
                  JSON
                </label>
              </div>
            </div>

            {/* Campos a incluir */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Campos a incluir
              </label>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.5rem'
              }}>
                {Object.entries({
                  id: 'ID',
                  nombre: 'Nombre',
                  email: 'Email',
                  rol: 'Rol',
                  fechaRegistro: 'Fecha de Registro',
                  tieneGoogle: 'Cuenta Google',
                  empresaInfo: 'Info. Empresa',
                  estudianteInfo: 'Info. Estudiante'
                }).map(([key, label]) => (
                  <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                      type="checkbox"
                      checked={exportOptions.includeFields[key]}
                      onChange={(e) => setExportOptions(prev => ({
                        ...prev,
                        includeFields: {
                          ...prev.includeFields,
                          [key]: e.target.checked
                        }
                      }))}
                    />
                    <span style={{ fontSize: '0.875rem' }}>{label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Resumen */}
            <div style={{
              backgroundColor: '#f3f4f6',
              padding: '0.75rem',
              borderRadius: '6px',
              marginBottom: '1.5rem',
              fontSize: '0.875rem',
              color: '#374151'
            }}>
              <strong>Resumen:</strong> Se exportarán los usuarios que coincidan con los filtros actuales en formato {exportOptions.format.toUpperCase()}.
            </div>

            {/* Botones */}
            <div style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={() => setShowModal(false)}
                disabled={loading}
                style={{
                  backgroundColor: 'white',
                  color: '#374151',
                  border: '1px solid #d1d5db',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '6px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '0.875rem'
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleExport}
                disabled={loading}
                style={{
                  backgroundColor: loading ? '#9ca3af' : '#059669',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '6px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '0.875rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                {loading && (
                  <div style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid transparent',
                    borderTop: '2px solid white',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                )}
                {loading ? 'Exportando...' : 'Exportar'}
              </button>
            </div>
          </div>

          <style jsx>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}
    </>
  );
}
