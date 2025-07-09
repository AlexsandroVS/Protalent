'use client';
import { useState } from 'react';
import { adminApiService } from '../../adminApi';

export default function UsuarioRow({ usuario, onRefresh, getRoleColor, getRoleIcon, onSuccess, onError, onConfirm }) {
  const [loading, setLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleDelete = async () => {
    const confirmed = await onConfirm({
      title: 'Eliminar Usuario',
      message: `¿Estás seguro de que quieres eliminar a ${usuario.nombre}? Esta acción no se puede deshacer.`,
      type: 'danger',
      confirmText: 'Eliminar',
      cancelText: 'Cancelar'
    });

    if (!confirmed) return;

    try {
      setLoading(true);
      await adminApiService.deleteUsuario(usuario.id);
      onSuccess('Usuario eliminado exitosamente');
      onRefresh();
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      onError(error.response?.data?.error || 'Error al eliminar el usuario');
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

  const cellStyle = {
    padding: '0.75rem',
    borderBottom: '1px solid #e5e7eb',
    fontSize: '0.875rem'
  };

  return (
    <>
      <tr style={{ backgroundColor: loading ? '#f9fafb' : 'white' }}>
        <td style={cellStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '1.25rem' }}>
              {getRoleIcon(usuario.rol)}
            </span>
            <div>
              <div style={{ fontWeight: '500', color: '#111827' }}>
                {usuario.nombre}
              </div>
              {usuario.tieneGoogle && (
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.25rem',
                  marginTop: '0.25rem'
                }}>
                  <span style={{ fontSize: '0.75rem' }}>🔗</span>
                  <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    Google
                  </span>
                </div>
              )}
            </div>
          </div>
        </td>
        
        <td style={cellStyle}>
          <span style={{ color: '#374151' }}>{usuario.email}</span>
        </td>
        
        <td style={cellStyle}>
          <span style={{
            backgroundColor: `${getRoleColor(usuario.rol)}20`,
            color: getRoleColor(usuario.rol),
            padding: '0.25rem 0.5rem',
            borderRadius: '12px',
            fontSize: '0.75rem',
            fontWeight: '500',
            textTransform: 'capitalize'
          }}>
            {usuario.rol}
          </span>
        </td>
        
        <td style={cellStyle}>
          {usuario.empresa && (
            <div>
              <div style={{ fontWeight: '500', color: '#059669' }}>
                {usuario.empresa.nombre}
              </div>
              {usuario.empresa.descripcion && (
                <div style={{ 
                  fontSize: '0.75rem', 
                  color: '#6b7280',
                  marginTop: '0.25rem'
                }}>
                  {usuario.empresa.descripcion.length > 50 
                    ? `${usuario.empresa.descripcion.substring(0, 50)}...`
                    : usuario.empresa.descripcion
                  }
                </div>
              )}
            </div>
          )}
          {usuario.estudiante && (
            <div>
              <div style={{ fontWeight: '500', color: '#2563eb' }}>
                {usuario.estudiante.carrera}
              </div>
              {usuario.estudiante.anioIngreso && (
                <div style={{ 
                  fontSize: '0.75rem', 
                  color: '#6b7280',
                  marginTop: '0.25rem'
                }}>
                  Año: {usuario.estudiante.anioIngreso}
                </div>
              )}
            </div>
          )}
          {!usuario.empresa && !usuario.estudiante && (
            <span style={{ color: '#9ca3af', fontSize: '0.75rem' }}>
              Sin información adicional
            </span>
          )}
        </td>
        
        <td style={cellStyle}>
          <span style={{ color: '#6b7280' }}>
            {formatearFecha(usuario.fechaRegistro)}
          </span>
        </td>
        
        <td style={cellStyle}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => setShowEditModal(true)}
              disabled={loading}
              style={{
                backgroundColor: '#f59e0b',
                color: 'white',
                border: 'none',
                padding: '0.25rem 0.5rem',
                borderRadius: '4px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '0.75rem'
              }}
            >
              Editar
            </button>
            {usuario.rol !== 'admin' && (
              <button
                onClick={handleDelete}
                disabled={loading}
                style={{
                  backgroundColor: '#dc2626',
                  color: 'white',
                  border: 'none',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '4px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '0.75rem'
                }}
              >
                {loading ? '...' : 'Eliminar'}
              </button>
            )}
          </div>
        </td>
      </tr>

      {showEditModal && (
        <EditUsuarioModal
          usuario={usuario}
          onClose={() => setShowEditModal(false)}
          onSuccess={(message) => {
            onSuccess(message);
            onRefresh();
          }}
          onError={onError}
        />
      )}
    </>
  );
}

function EditUsuarioModal({ usuario, onClose, onSuccess, onError }) {
  const [formData, setFormData] = useState({
    nombre: usuario.nombre,
    email: usuario.email,
    rol: usuario.rol,
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
    
    if (formData.password && formData.password.length < 6) {
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
      const updateData = {
        nombre: formData.nombre.trim(),
        email: formData.email.trim(),
        rol: formData.rol
      };

      if (formData.password) {
        updateData.password = formData.password;
      }

      await adminApiService.updateUsuario(usuario.id, updateData);
      onSuccess('Usuario actualizado exitosamente');
      onClose();
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      onError(error.response?.data?.error || 'Error al actualizar el usuario');
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
        borderRadius: '8px',
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
          Editar Usuario: {usuario.nombre}
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
              Nombre *
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
                borderRadius: '6px',
                fontSize: '1rem',
                boxSizing: 'border-box',
                backgroundColor: errors.nombre ? '#fef2f2' : 'white'
              }}
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
                borderRadius: '6px',
                fontSize: '1rem',
                boxSizing: 'border-box',
                backgroundColor: errors.email ? '#fef2f2' : 'white'
              }}
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

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ 
              display: 'block', 
              fontSize: '0.875rem', 
              fontWeight: '500', 
              color: '#374151', 
              marginBottom: '0.5rem' 
            }}>
              Rol
            </label>
            <select
              value={formData.rol}
              onChange={(e) => setFormData(prev => ({ ...prev, rol: e.target.value }))}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '1rem',
                boxSizing: 'border-box'
              }}
              required
            >
              <option value="estudiante">Estudiante</option>
              <option value="empresa">Empresa</option>
              <option value="egresado">Egresado</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ 
              display: 'block', 
              fontSize: '0.875rem', 
              fontWeight: '500', 
              color: '#374151', 
              marginBottom: '0.5rem' 
            }}>
              Nueva Contraseña (opcional)
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
                borderRadius: '6px',
                fontSize: '1rem',
                boxSizing: 'border-box',
                backgroundColor: errors.password ? '#fef2f2' : 'white'
              }}
              placeholder="Dejar vacío para mantener la actual"
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
            {!errors.password && formData.password && (
              <p style={{ 
                color: '#059669', 
                fontSize: '0.75rem', 
                margin: '0.25rem 0 0 0' 
              }}>
                Mínimo 6 caracteres
              </p>
            )}
          </div>

          {Object.keys(errors).length > 0 && (
            <div style={{
              backgroundColor: '#fef2f2',
              border: '1px solid #fca5a5',
              color: '#dc2626',
              padding: '0.75rem',
              borderRadius: '6px',
              fontSize: '0.875rem',
              marginBottom: '1rem'
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
              style={{
                backgroundColor: '#6b7280',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.875rem'
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                backgroundColor: loading ? '#9ca3af' : '#2563eb',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '6px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '0.875rem'
              }}
            >
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
