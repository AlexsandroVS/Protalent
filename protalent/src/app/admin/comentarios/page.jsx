'use client';
import { useState, useEffect } from 'react';
import { adminApiService } from '../adminApi';

export default function ComentariosPage() {
  const [comentarios, setComentarios] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    blogPostId: 'all',
    buscar: '',
    page: 1
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0
  });

  useEffect(() => {
    fetchData();
  }, [filters]);

  const fetchData = async () => {
    await Promise.all([
      fetchComentarios(),
      fetchBlogPosts()
    ]);
  };

  const fetchComentarios = async () => {
    try {
      setLoading(true);
      const response = await adminApiService.getComentarios(filters);
      setComentarios(response.data.data.comentarios);
      setPagination(response.data.data.pagination);
    } catch (error) {
      console.error('Error al cargar comentarios:', error);
      setError('Error al cargar los comentarios');
    } finally {
      setLoading(false);
    }
  };

  const fetchBlogPosts = async () => {
    try {
      const response = await adminApiService.getBlogPosts();
      setBlogPosts(response.data.data.blogPosts);
    } catch (error) {
      console.error('Error al cargar blog posts:', error);
    }
  };

  const handleDelete = async (comentario) => {
    if (!confirm(`¿Estás seguro de que quieres eliminar este comentario?`)) {
      return;
    }

    try {
      await adminApiService.deleteComentario(comentario.id);
      await fetchComentarios();
    } catch (error) {
      console.error('Error al eliminar comentario:', error);
      setError('Error al eliminar el comentario');
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset page cuando cambian filtros
    }));
  };

  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }));
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

  const truncateText = (text, maxLength = 200) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };

  if (loading && comentarios.length === 0) {
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
          <p style={{ color: '#6b7280' }}>Cargando comentarios...</p>
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
        .btn {
          padding: 8px 16px;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          margin-right: 8px;
          transition: all 0.2s;
          text-decoration: none;
          display: inline-block;
        }
        .btn-danger {
          background-color: #ef4444;
          color: white;
        }
        .btn-danger:hover {
          background-color: #dc2626;
        }
        .btn-outline {
          background-color: transparent;
          border: 1px solid #d1d5db;
          color: #374151;
        }
        .btn-outline:hover {
          background-color: #f3f4f6;
        }
        .error-message {
          background-color: #fee2e2;
          border: 1px solid #fecaca;
          color: #b91c1c;
          padding: 12px;
          border-radius: 6px;
          margin-bottom: 16px;
        }
        .filters-container {
          display: flex;
          gap: 16px;
          align-items: center;
          flex-wrap: wrap;
          margin-bottom: 16px;
        }
        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .form-select {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
          background-color: white;
        }
        .form-select:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
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
        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 8px;
          margin-top: 24px;
        }
        .comment-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 16px;
          transition: all 0.2s;
        }
        .comment-card:hover {
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        .comment-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;
        }
        .comment-meta {
          color: #6b7280;
          font-size: 14px;
        }
        .comment-content {
          color: #374151;
          line-height: 1.6;
          margin-bottom: 12px;
          background-color: #f9fafb;
          padding: 12px;
          border-radius: 6px;
          border-left: 4px solid #e5e7eb;
        }
        .blog-post-link {
          color: #3b82f6;
          text-decoration: none;
          font-weight: 500;
        }
        .blog-post-link:hover {
          text-decoration: underline;
        }
        .comment-actions {
          display: flex;
          justify-content: flex-end;
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
              💬 Gestión de Comentarios
            </h1>
            <p style={{ 
              color: '#6b7280',
              margin: 0
            }}>
              Administra los comentarios de los blog posts
            </p>
          </div>
          <div style={{
            backgroundColor: '#dbeafe',
            color: '#1e40af',
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            fontWeight: '600'
          }}>
            Total: {pagination.totalItems} comentarios
          </div>
        </div>

        {/* Filtros */}
        <div className="filters-container" style={{ marginTop: '1.5rem' }}>
          <div className="filter-group">
            <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
              Blog Post
            </label>
            <select 
              className="form-select"
              style={{ width: '300px' }}
              value={filters.blogPostId}
              onChange={(e) => handleFilterChange('blogPostId', e.target.value)}
            >
              <option value="all">Todos los blog posts</option>
              {blogPosts.map(post => (
                <option key={post.id} value={post.id}>
                  {post.titulo}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
              Buscar
            </label>
            <input
              type="text"
              className="form-input"
              style={{ width: '300px' }}
              placeholder="Buscar en contenido del comentario..."
              value={filters.buscar}
              onChange={(e) => handleFilterChange('buscar', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* Lista de comentarios */}
      <div>
        {comentarios.length === 0 ? (
          <div style={{ 
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            padding: '3rem', 
            textAlign: 'center',
            color: '#6b7280'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>�</div>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem' }}>
              No hay comentarios
            </h3>
            <p style={{ margin: '0 0 1rem 0' }}>
              {filters.buscar || filters.blogPostId !== 'all' 
                ? 'No se encontraron comentarios con los filtros aplicados.'
                : 'Aún no hay comentarios en los blog posts.'
              }
            </p>
          </div>
        ) : (
          <>
            {comentarios.map((comentario) => (
              <div key={comentario.id} className="comment-card">
                <div className="comment-header">
                  <div>
                    <div className="comment-meta">
                      Por {comentario.autor?.nombre || 'Usuario anónimo'} • 
                      {formatearFecha(comentario.createdAt)} • 
                      En: <a 
                        href={`/admin/blog-posts`} 
                        className="blog-post-link"
                        title={comentario.blogPost?.titulo}
                      >
                        {comentario.blogPost?.titulo || 'Blog post eliminado'}
                      </a>
                    </div>
                  </div>
                  <div className="comment-actions">
                    <button 
                      className="btn btn-danger"
                      onClick={() => handleDelete(comentario)}
                      title="Eliminar comentario"
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                </div>
                
                <div className="comment-content">
                  {truncateText(comentario.contenido)}
                </div>
              </div>
            ))}

            {/* Paginación */}
            {pagination.totalPages > 1 && (
              <div className="pagination">
                <button 
                  className="btn btn-outline"
                  disabled={pagination.currentPage === 1}
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                >
                  Anterior
                </button>
                
                <span style={{ color: '#6b7280' }}>
                  Página {pagination.currentPage} de {pagination.totalPages}
                </span>
                
                <button 
                  className="btn btn-outline"
                  disabled={pagination.currentPage === pagination.totalPages}
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                >
                  Siguiente
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
