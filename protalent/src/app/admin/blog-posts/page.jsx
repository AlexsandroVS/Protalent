'use client';
import { useState, useEffect } from 'react';
import { adminApiService } from '../adminApi';

export default function BlogPostsPage() {
  const [blogPosts, setBlogPosts] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [formData, setFormData] = useState({ 
    titulo: '', 
    contenido: '', 
    categoriaId: '',
    imagenPortada: null
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [filters, setFilters] = useState({
    categoria: 'all',
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
      fetchBlogPosts(),
      fetchCategorias()
    ]);
  };

  const fetchBlogPosts = async () => {
    try {
      setLoading(true);
      const response = await adminApiService.getBlogPosts(filters);
      setBlogPosts(response.data.data.blogPosts);
      setPagination(response.data.data.pagination);
    } catch (error) {
      console.error('Error al cargar blog posts:', error);
      setError('Error al cargar los blog posts');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategorias = async () => {
    try {
      const response = await adminApiService.getCategorias();
      setCategorias(response.data.data.categorias);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
    }
  };

  const handleOpenModal = (post = null) => {
    setEditingPost(post);
    setFormData({
      titulo: post?.titulo || '',
      contenido: post?.contenido || '',
      categoriaId: post?.categoria?.id || '',
      imagenPortada: null
    });
    
    // Mostrar imagen existente si hay una
    if (post?.BlogPostMedia && post.BlogPostMedia.length > 0) {
      setPreviewImage(post.BlogPostMedia[0].ruta);
    } else {
      setPreviewImage(null);
    }
    
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingPost(null);
    setFormData({ titulo: '', contenido: '', categoriaId: '', imagenPortada: null });
    setPreviewImage(null);
    setError(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        setError('Por favor selecciona un archivo de imagen válido');
        return;
      }
      
      // Validar tamaño (5MB máximo)
      if (file.size > 5 * 1024 * 1024) {
        setError('La imagen no debe superar los 5MB');
        return;
      }
      
      setFormData({ ...formData, imagenPortada: file });
      
      // Crear preview
      const reader = new FileReader();
      reader.onload = (e) => setPreviewImage(e.target.result);
      reader.readAsDataURL(file);
      
      setError(null);
    }
  };

  const handleRemoveImage = () => {
    setFormData({ ...formData, imagenPortada: null });
    setPreviewImage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const submitData = {
        titulo: formData.titulo,
        contenido: formData.contenido,
        categoriaId: formData.categoriaId || null
      };

      // Agregar imagen si hay una nueva
      if (formData.imagenPortada) {
        submitData.imagenPortada = formData.imagenPortada;
      }

      if (editingPost) {
        await adminApiService.updateBlogPost(editingPost.id, submitData);
      } else {
        await adminApiService.createBlogPost(submitData);
      }
      
      await fetchBlogPosts();
      handleCloseModal();
    } catch (error) {
      console.error('Error al guardar blog post:', error);
      setError(error.response?.data?.error || 'Error al guardar el blog post');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (post) => {
    if (!confirm(`¿Estás seguro de que quieres eliminar el blog post "${post.titulo}"?`)) {
      return;
    }

    try {
      await adminApiService.deleteBlogPost(post.id);
      await fetchBlogPosts();
    } catch (error) {
      console.error('Error al eliminar blog post:', error);
      setError('Error al eliminar el blog post');
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

  const truncateText = (text, maxLength = 150) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };

  if (loading && blogPosts.length === 0) {
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
          <p style={{ color: '#6b7280' }}>Cargando blog posts...</p>
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
        .btn-outline {
          background-color: transparent;
          border: 1px solid #d1d5db;
          color: #374151;
        }
        .btn-outline:hover {
          background-color: #f3f4f6;
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
          max-width: 800px;
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
          min-height: 200px;
          resize: vertical;
          font-family: inherit;
        }
        .form-textarea:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
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
        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 8px;
          margin-top: 24px;
        }
        .post-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 16px;
          transition: all 0.2s;
        }
        .post-card:hover {
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        .post-title {
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 8px 0;
        }
        .post-meta {
          color: #6b7280;
          font-size: 14px;
          margin-bottom: 12px;
        }
        .post-content {
          color: #374151;
          line-height: 1.6;
          margin-bottom: 16px;
        }
        .post-actions {
          display: flex;
          gap: 8px;
          align-items: center;
        }
        .category-badge {
          background-color: #dbeafe;
          color: #1e40af;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
        }
        .image-upload-container {
          border: 2px dashed #d1d5db;
          border-radius: 8px;
          padding: 20px;
          text-align: center;
          background-color: #f9fafb;
          transition: all 0.2s;
        }
        .image-upload-container:hover {
          border-color: #3b82f6;
          background-color: #eff6ff;
        }
        .image-upload-container.has-image {
          border: 2px solid #10b981;
          background-color: #ecfdf5;
        }
        .image-preview {
          max-width: 100%;
          max-height: 300px;
          border-radius: 8px;
          margin: 10px 0;
        }
        .image-upload-input {
          display: none;
        }
        .upload-button {
          background-color: #3b82f6;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          margin: 5px;
        }
        .upload-button:hover {
          background-color: #2563eb;
        }
        .remove-button {
          background-color: #ef4444;
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
        }
        .remove-button:hover {
          background-color: #dc2626;
        }
        .post-image {
          width: 100px;
          height: 60px;
          object-fit: cover;
          border-radius: 6px;
          margin-right: 12px;
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
              📰 Gestión de Blog Posts
            </h1>
            <p style={{ 
              color: '#6b7280',
              margin: 0
            }}>
              Administra las entradas del blog de la plataforma
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
              Total: {pagination.totalItems} posts
            </div>
            <button 
              className="btn btn-primary"
              onClick={() => handleOpenModal()}
            >
              + Nuevo Post
            </button>
          </div>
        </div>

        {/* Filtros */}
        <div className="filters-container" style={{ marginTop: '1.5rem' }}>
          <div className="filter-group">
            <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
              Categoría
            </label>
            <select 
              className="form-select"
              style={{ width: '200px' }}
              value={filters.categoria}
              onChange={(e) => handleFilterChange('categoria', e.target.value)}
            >
              <option value="all">Todas las categorías</option>
              {categorias.map(categoria => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.nombre}
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
              placeholder="Buscar por título o contenido..."
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

      {/* Lista de blog posts */}
      <div>
        {blogPosts.length === 0 ? (
          <div style={{ 
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            padding: '3rem', 
            textAlign: 'center',
            color: '#6b7280'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📰</div>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem' }}>
              No hay blog posts
            </h3>
            <p style={{ margin: '0 0 1rem 0' }}>
              {filters.buscar || filters.categoria !== 'all' 
                ? 'No se encontraron posts con los filtros aplicados.'
                : 'Crea tu primer blog post para empezar a compartir contenido.'
              }
            </p>
            <button 
              className="btn btn-primary"
              onClick={() => handleOpenModal()}
            >
              + Crear Primer Post
            </button>
          </div>
        ) : (
          <>
            {blogPosts.map((post) => (
              <div key={post.id} className="post-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', flex: 1 }}>
                    {/* Imagen de portada */}
                    {post.BlogPostMedia && post.BlogPostMedia.length > 0 && (
                      <img 
                        src={post.BlogPostMedia[0].ruta} 
                        alt={post.titulo}
                        className="post-image"
                      />
                    )}
                    
                    <div style={{ flex: 1 }}>
                      <h3 className="post-title">{post.titulo}</h3>
                      <div className="post-meta">
                        Por {post.autor?.nombre || 'Autor desconocido'} • 
                        {formatearFecha(post.createdAt)} • 
                        {post.totalComentarios || 0} comentarios • 
                        {post.totalReacciones || 0} reacciones
                        {post.categoria && (
                          <>
                            {' • '}
                            <span className="category-badge">
                              {post.categoria.nombre}
                            </span>
                          </>
                        )}
                      </div>
                      <div className="post-content">
                        {truncateText(post.contenido)}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="post-actions">
                  <button 
                    className="btn btn-secondary"
                    onClick={() => handleOpenModal(post)}
                  >
                    Editar
                  </button>
                  <button 
                    className="btn btn-danger"
                    onClick={() => handleDelete(post)}
                  >
                    Eliminar
                  </button>
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
              {editingPost ? 'Editar Blog Post' : 'Nuevo Blog Post'}
            </h2>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="titulo">
                  Título *
                </label>
                <input
                  type="text"
                  id="titulo"
                  className="form-input"
                  value={formData.titulo}
                  onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                  placeholder="Título del blog post"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="categoria">
                  Categoría
                </label>
                <select
                  id="categoria"
                  className="form-select"
                  value={formData.categoriaId}
                  onChange={(e) => setFormData({ ...formData, categoriaId: e.target.value })}
                >
                  <option value="">Sin categoría</option>
                  {categorias.map(categoria => (
                    <option key={categoria.id} value={categoria.id}>
                      {categoria.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Imagen de Portada
                </label>
                <div className={`image-upload-container ${previewImage ? 'has-image' : ''}`}>
                  {previewImage ? (
                    <div>
                      <img 
                        src={previewImage} 
                        alt="Preview" 
                        className="image-preview"
                      />
                      <div>
                        <button 
                          type="button"
                          className="upload-button"
                          onClick={() => document.getElementById('imagen-upload').click()}
                        >
                          Cambiar Imagen
                        </button>
                        <button 
                          type="button"
                          className="remove-button"
                          onClick={handleRemoveImage}
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🖼️</div>
                      <p style={{ margin: '0 0 1rem 0', color: '#6b7280' }}>
                        Selecciona una imagen de portada para tu blog post
                      </p>
                      <button 
                        type="button"
                        className="upload-button"
                        onClick={() => document.getElementById('imagen-upload').click()}
                      >
                        Seleccionar Imagen
                      </button>
                      <p style={{ margin: '0.5rem 0 0 0', fontSize: '12px', color: '#9ca3af' }}>
                        JPG, PNG o WebP • Máximo 5MB • Recomendado: 1200x630px
                      </p>
                    </div>
                  )}
                  <input
                    id="imagen-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="image-upload-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="contenido">
                  Contenido *
                </label>
                <textarea
                  id="contenido"
                  className="form-textarea"
                  value={formData.contenido}
                  onChange={(e) => setFormData({ ...formData, contenido: e.target.value })}
                  placeholder="Contenido del blog post..."
                  required
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
                  {submitting ? 'Guardando...' : (editingPost ? 'Actualizar' : 'Crear')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
