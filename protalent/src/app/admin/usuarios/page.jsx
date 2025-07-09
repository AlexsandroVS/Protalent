'use client';
import { useState, useEffect } from 'react';
import { adminApiService } from '../adminApi';
import UsuarioRow from './components/UsuarioRow';
import AdvancedFilters from './components/AdvancedFilters';
import ExportButton from './components/ExportButton';
import { useToast, ToastContainer } from '../components/Toast';
import { useConfirmDialog } from '../components/ConfirmDialog';

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    rol: 'all',
    search: ''
  });
  const [pagination, setPagination] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Toast y Dialog hooks
  const { toasts, success, error: showError, warning, info, removeToast } = useToast();
  const { confirm, ConfirmDialog } = useConfirmDialog();

  // Cargar usuarios
  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      const [usuariosResponse, statsResponse] = await Promise.all([
        adminApiService.getUsuarios(filters),
        adminApiService.getUsuariosStats()
      ]);
      
      setUsuarios(usuariosResponse.data.data.usuarios);
      setPagination(usuariosResponse.data.data.pagination);
      setStats(statsResponse.data.data);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      setError('Error al cargar los usuarios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset page cuando cambian los filtros
    }));
  };

  const handleCreateSuccess = (message) => {
    success(message);
    setShowCreateModal(false);
    fetchUsuarios();
  };

  const handleError = (message) => {
    showError(message);
  };

  const handleSuccess = (message) => {
    success(message);
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({
      ...prev,
      page: newPage
    }));
  };

  const getRoleColor = (rol) => {
    const colors = {
      admin: '#dc2626',
      empresa: '#059669', 
      estudiante: '#2563eb',
      egresado: '#7c3aed'
    };
    return colors[rol] || '#6b7280';
  };

  const getRoleIcon = (rol) => {
    const icons = {
      admin: '⚡',
      empresa: '🏢',
      estudiante: '🎓',
      egresado: '👨‍🎓'
    };
    return icons[rol] || '👤';
  };

  if (loading && usuarios.length === 0) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
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
            👥 Gestión de Usuarios
          </h1>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <ExportButton 
              filters={filters}
              onSuccess={handleSuccess}
              onError={handleError}
            />
            <button
              onClick={() => setShowCreateModal(true)}
              style={{
                backgroundColor: '#2563eb',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '500',
                fontSize: '0.875rem'
              }}
            >
              + Crear Admin
            </button>
          </div>
        </div>
        <p style={{ 
          color: '#6b7280',
          margin: 0
        }}>
          Administra todos los usuarios de la plataforma
        </p>
      </div>

      {/* Estadísticas */}
      {stats && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <StatCard title="Total" value={stats.total} icon="👥" color="#6b7280" />
          <StatCard title="Estudiantes" value={stats.estudiantes} icon="🎓" color="#2563eb" />
          <StatCard title="Empresas" value={stats.empresas} icon="🏢" color="#059669" />
          <StatCard title="Admins" value={stats.admins} icon="⚡" color="#dc2626" />
          <StatCard title="Con Google" value={stats.usuariosGoogle} icon="🔗" color="#ea4335" />
        </div>
      )}

      {/* Filtros Avanzados */}
      <AdvancedFilters 
        filters={filters}
        onFilterChange={handleFilterChange}
        stats={stats}
      />

      {/* Tabla de usuarios */}
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
            Lista de Usuarios
          </h2>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: '#f9fafb' }}>
              <tr>
                <th style={tableHeaderStyle}>Usuario</th>
                <th style={tableHeaderStyle}>Email</th>
                <th style={tableHeaderStyle}>Rol</th>
                <th style={tableHeaderStyle}>Información Adicional</th>
                <th style={tableHeaderStyle}>Fecha de Registro</th>
                <th style={tableHeaderStyle}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <UsuarioRow 
                  key={usuario.id} 
                  usuario={usuario} 
                  onRefresh={fetchUsuarios}
                  getRoleColor={getRoleColor}
                  getRoleIcon={getRoleIcon}
                  onSuccess={handleSuccess}
                  onError={handleError}
                  onConfirm={confirm}
                />
              ))}
            </tbody>
          </table>
        </div>

        {usuarios.length === 0 && !loading && (
          <div style={{ 
            padding: '3rem', 
            textAlign: 'center', 
            color: '#6b7280' 
          }}>
            No se encontraron usuarios
          </div>
        )}

        {/* Paginación */}
        {pagination && pagination.totalPages > 1 && (
          <Pagination
            pagination={pagination}
            onPageChange={handlePageChange}
          />
        )}
      </div>

      {/* Modal de crear admin */}
      {showCreateModal && (
        <CreateAdminModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleCreateSuccess}
          onError={handleError}
        />
      )}

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      
      {/* Confirm Dialog */}
      <ConfirmDialog />
    </div>
  );
}

// Componentes auxiliares
const tableHeaderStyle = {
  padding: '0.75rem',
  textAlign: 'left',
  fontSize: '0.875rem',
  fontWeight: '600',
  color: '#374151',
  borderBottom: '1px solid #e5e7eb'
};

function LoadingSpinner() {
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
        <p style={{ color: '#6b7280' }}>Cargando usuarios...</p>
      </div>
    </div>
  );
}

function ErrorMessage({ message }) {
  return (
    <div style={{ 
      backgroundColor: '#fef2f2',
      border: '1px solid #fca5a5',
      borderRadius: '8px',
      padding: '1rem',
      color: '#dc2626'
    }}>
      {message}
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      padding: '1rem',
      border: `2px solid ${color}20`
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <span style={{ fontSize: '1.5rem' }}>{icon}</span>
        <span style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: color
        }}>
          {value}
        </span>
      </div>
      <h3 style={{
        fontSize: '0.875rem',
        fontWeight: '600',
        color: '#4b5563',
        margin: '0.5rem 0 0 0'
      }}>
        {title}
      </h3>
    </div>
  );
}

// Componente de paginación
function Pagination({ pagination, onPageChange }) {
  const { currentPage, totalPages, totalUsers } = pagination;
  
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    
    // Ajustar si estamos cerca del final
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  const pageButtonStyle = (isActive) => ({
    backgroundColor: isActive ? '#2563eb' : 'white',
    color: isActive ? 'white' : '#374151',
    border: '1px solid #d1d5db',
    padding: '0.5rem 0.75rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.875rem',
    minWidth: '40px',
    textAlign: 'center',
    transition: 'all 0.2s'
  });

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: '1.5rem',
      padding: '1rem',
      backgroundColor: '#f9fafb',
      borderRadius: '8px'
    }}>
      <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
        Mostrando {((currentPage - 1) * pagination.limit) + 1} - {Math.min(currentPage * pagination.limit, totalUsers)} de {totalUsers} usuarios
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {/* Botón anterior */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          style={{
            ...pageButtonStyle(false),
            opacity: currentPage === 1 ? 0.5 : 1,
            cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
          }}
        >
          ‹
        </button>
        
        {/* Primera página si no está visible */}
        {getPageNumbers()[0] > 1 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              style={pageButtonStyle(false)}
            >
              1
            </button>
            {getPageNumbers()[0] > 2 && (
              <span style={{ color: '#6b7280', padding: '0 0.5rem' }}>...</span>
            )}
          </>
        )}
        
        {/* Páginas numeradas */}
        {getPageNumbers().map(page => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            style={pageButtonStyle(page === currentPage)}
          >
            {page}
          </button>
        ))}
        
        {/* Última página si no está visible */}
        {getPageNumbers()[getPageNumbers().length - 1] < totalPages && (
          <>
            {getPageNumbers()[getPageNumbers().length - 1] < totalPages - 1 && (
              <span style={{ color: '#6b7280', padding: '0 0.5rem' }}>...</span>
            )}
            <button
              onClick={() => onPageChange(totalPages)}
              style={pageButtonStyle(false)}
            >
              {totalPages}
            </button>
          </>
        )}
        
        {/* Botón siguiente */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          style={{
            ...pageButtonStyle(false),
            opacity: currentPage === totalPages ? 0.5 : 1,
            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
          }}
        >
          ›
        </button>
      </div>
    </div>
  );
}

// Modal para crear nuevo administrador
function CreateAdminModal({ onClose, onSuccess, onError }) {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }
    
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      await adminApiService.createAdmin({
        nombre: formData.nombre.trim(),
        email: formData.email.trim(),
        password: formData.password
      });
      onSuccess('Administrador creado exitosamente');
      onClose();
    } catch (error) {
      console.error('Error al crear administrador:', error);
      onError(error.response?.data?.error || 'Error al crear el administrador');
    } finally {
      setLoading(false);
    }
  };

  return (
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
        margin: '1rem',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
      }}>
        <h3 style={{ 
          margin: '0 0 1.5rem 0',
          fontSize: '1.5rem',
          fontWeight: '600',
          color: '#1f2937',
          textAlign: 'center'
        }}>
          Crear Nuevo Administrador
        </h3>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ 
              display: 'block', 
              fontSize: '0.875rem', 
              fontWeight: '500', 
              color: '#374151', 
              marginBottom: '0.5rem' 
            }}>
              Nombre Completo *
            </label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, nombre: e.target.value }));
                if (errors.nombre) setErrors(prev => ({ ...prev, nombre: '' }));
              }}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: `1px solid ${errors.nombre ? '#dc2626' : '#d1d5db'}`,
                borderRadius: '8px',
                fontSize: '1rem',
                boxSizing: 'border-box',
                backgroundColor: errors.nombre ? '#fef2f2' : 'white',
                transition: 'border-color 0.2s, background-color 0.2s'
              }}
              placeholder="Ej: Juan Pérez"
              required
            />
            {errors.nombre && (
              <p style={{ 
                color: '#dc2626', 
                fontSize: '0.75rem', 
                margin: '0.25rem 0 0 0' 
              }}>
                {errors.nombre}
              </p>
            )}
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ 
              display: 'block', 
              fontSize: '0.875rem', 
              fontWeight: '500', 
              color: '#374151', 
              marginBottom: '0.5rem' 
            }}>
              Email *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, email: e.target.value }));
                if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
              }}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: `1px solid ${errors.email ? '#dc2626' : '#d1d5db'}`,
                borderRadius: '8px',
                fontSize: '1rem',
                boxSizing: 'border-box',
                backgroundColor: errors.email ? '#fef2f2' : 'white',
                transition: 'border-color 0.2s, background-color 0.2s'
              }}
              placeholder="admin@protalent.com"
              required
            />
            {errors.email && (
              <p style={{ 
                color: '#dc2626', 
                fontSize: '0.75rem', 
                margin: '0.25rem 0 0 0' 
              }}>
                {errors.email}
              </p>
            )}
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ 
              display: 'block', 
              fontSize: '0.875rem', 
              fontWeight: '500', 
              color: '#374151', 
              marginBottom: '0.5rem' 
            }}>
              Contraseña *
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, password: e.target.value }));
                if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
              }}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: `1px solid ${errors.password ? '#dc2626' : '#d1d5db'}`,
                borderRadius: '8px',
                fontSize: '1rem',
                boxSizing: 'border-box',
                backgroundColor: errors.password ? '#fef2f2' : 'white',
                transition: 'border-color 0.2s, background-color 0.2s'
              }}
              placeholder="Mínimo 6 caracteres"
              required
            />
            {errors.password && (
              <p style={{ 
                color: '#dc2626', 
                fontSize: '0.75rem', 
                margin: '0.25rem 0 0 0' 
              }}>
                {errors.password}
              </p>
            )}
            {!errors.password && formData.password && formData.password.length >= 6 && (
              <p style={{ 
                color: '#059669', 
                fontSize: '0.75rem', 
                margin: '0.25rem 0 0 0' 
              }}>
                ✓ Contraseña válida
              </p>
            )}
          </div>

          {Object.keys(errors).length > 0 && (
            <div style={{
              backgroundColor: '#fef2f2',
              border: '1px solid #fca5a5',
              color: '#dc2626',
              padding: '0.75rem',
              borderRadius: '8px',
              fontSize: '0.875rem',
              marginBottom: '1rem',
              textAlign: 'center'
            }}>
              Por favor, corrige los errores antes de continuar.
            </div>
          )}

          <div style={{ 
            display: 'flex', 
            gap: '1rem', 
            justifyContent: 'flex-end' 
          }}>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              style={{
                backgroundColor: 'white',
                color: '#374151',
                border: '1px solid #d1d5db',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '0.875rem',
                fontWeight: '500',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                if (!loading) e.target.style.backgroundColor = '#f9fafb';
              }}
              onMouseLeave={(e) => {
                if (!loading) e.target.style.backgroundColor = 'white';
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || Object.keys(errors).length > 0}
              style={{
                backgroundColor: loading || Object.keys(errors).length > 0 ? '#9ca3af' : '#059669',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                cursor: loading || Object.keys(errors).length > 0 ? 'not-allowed' : 'pointer',
                fontSize: '0.875rem',
                fontWeight: '500',
                transition: 'all 0.2s',
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
              {loading ? 'Creando...' : 'Crear Administrador'}
            </button>
          </div>
        </form>
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

// Exportar componentes que usaremos en archivos separados
export { StatCard, LoadingSpinner, ErrorMessage };
