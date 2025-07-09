'use client';
import { useState, useEffect } from 'react';
import { adminApiService } from '../adminApi';

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingCategoria, setEditingCategoria] = useState(null);
  const [formData, setFormData] = useState({ nombre: '', descripcion: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCategorias();
  }, []);

  const fetchCategorias = async () => {
    try {
      setLoading(true);
      const response = await adminApiService.getCategorias();
      setCategorias(response.data.data.categorias);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
      setError('Error al cargar las categorías');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (categoria = null) => {
    setEditingCategoria(categoria);
    setFormData({
      nombre: categoria?.nombre || '',
      descripcion: categoria?.descripcion || ''
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCategoria(null);
    setFormData({ nombre: '', descripcion: '' });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      if (editingCategoria) {
        await adminApiService.updateCategoria(editingCategoria.id, formData);
      } else {
        await adminApiService.createCategoria(formData);
      }
      
      await fetchCategorias();
      handleCloseModal();
    } catch (error) {
      console.error('Error al guardar categoría:', error);
      setError(error.response?.data?.error || 'Error al guardar la categoría');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (categoria) => {
    if (!confirm(`¿Estás seguro de que quieres eliminar la categoría "${categoria.nombre}"?`)) {
      return;
    }

    try {
      await adminApiService.deleteCategoria(categoria.id);
      await fetchCategorias();
    } catch (error) {
      console.error('Error al eliminar categoría:', error);
      setError('Error al eliminar la categoría');
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
          <p style={{ color: '#6b7280' }}>Cargando categorías...</p>
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
        .btn {
          padding: 8px 16px;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          margin-right: 8px;
          transition: all 0.2s;
        }
        .btn-primary {
          background-color: #3b82f6;
          color: white;
        }
        .btn-primary:hover {
          background-color: #2563eb;
        }
        .btn-secondary {
          background-color: #6b7280;
          color: white;
        }
        .btn-secondary:hover {
          background-color: #4b5563;
        }
        .btn-danger {
          background-color: #ef4444;
          color: white;
        }
        .btn-danger:hover {
          background-color: #dc2626;
        }
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        .modal {
          background: white;
          border-radius: 8px;
          padding: 24px;
          width: 90%;
          max-width: 500px;
          max-height: 90vh;
          overflow-y: auto;
        }
        .form-group {
          margin-bottom: 16px;
        }
        .form-label {
          display: block;
          margin-bottom: 4px;
          font-weight: 500;
          color: #374151;
        }
        .form-input {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
        }
        .form-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        .form-textarea {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
          min-height: 80px;
          resize: vertical;
        }
        .form-textarea:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        .error-message {
          background-color: #fee2e2;
          border: 1px solid #fecaca;
          color: #b91c1c;
          padding: 12px;
          border-radius: 6px;
          margin-bottom: 16px;
        }
      `}</style>

      {/* Header */}
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
              🏷️ Gestión de Categorías
            </h1>
            <p style={{ 
              color: '#6b7280',
              margin: 0
            }}>
              Administra las categorías de ofertas de trabajo
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              backgroundColor: '#dbeafe',
              color: '#1e40af',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              fontWeight: '600'
            }}>
              Total: {categorias.length} categorías
            </div>
            <button 
              className="btn btn-primary"
              onClick={() => handleOpenModal()}
            >
              + Nueva Categoría
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* Tabla de categorías */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }}>
        {categorias.length === 0 ? (
          <div style={{ 
            padding: '3rem', 
            textAlign: 'center',
            color: '#6b7280'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏷️</div>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem' }}>
              No hay categorías registradas
            </h3>
            <p style={{ margin: '0 0 1rem 0' }}>
              Crea tu primera categoría para empezar a organizar las ofertas.
            </p>
            <button 
              className="btn btn-primary"
              onClick={() => handleOpenModal()}
            >
              + Crear Primera Categoría
            </button>
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th>Fecha de Creación</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {categorias.map((categoria) => (
                  <tr key={categoria.id}>
                    <td style={{ fontWeight: '500', color: '#1f2937' }}>
                      {categoria.nombre}
                    </td>
                    <td style={{ color: '#6b7280', maxWidth: '300px' }}>
                      {categoria.descripcion || 'Sin descripción'}
                    </td>
                    <td style={{ color: '#6b7280' }}>
                      {formatearFecha(categoria.createdAt)}
                    </td>
                    <td>
                      <button 
                        className="btn btn-secondary"
                        onClick={() => handleOpenModal(categoria)}
                      >
                        Editar
                      </button>
                      <button 
                        className="btn btn-danger"
                        onClick={() => handleDelete(categoria)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2 style={{ 
              margin: '0 0 1rem 0', 
              fontSize: '1.5rem', 
              fontWeight: '600',
              color: '#1f2937'
            }}>
              {editingCategoria ? 'Editar Categoría' : 'Nueva Categoría'}
            </h2>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="nombre">
                  Nombre *
                </label>
                <input
                  type="text"
                  id="nombre"
                  className="form-input"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  placeholder="Nombre de la categoría"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="descripcion">
                  Descripción
                </label>
                <textarea
                  id="descripcion"
                  className="form-textarea"
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  placeholder="Descripción de la categoría (opcional)"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <button 
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseModal}
                  disabled={submitting}
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting}
                >
                  {submitting ? 'Guardando...' : (editingCategoria ? 'Actualizar' : 'Crear')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
