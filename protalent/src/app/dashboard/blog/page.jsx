'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { FiPlus, FiRefreshCw } from 'react-icons/fi';
import api from '../../../app/lib/api';
import PostCard from '../../../app/components/blog/PostCard';
import CategoryFilter from '../../../app/components/blog/CategoryFilter';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from 'react-hot-toast';

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('todas');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [comentariosAbiertos, setComentariosAbiertos] = useState({});
  const [nuevosComentarios, setNuevosComentarios] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  const fetchData = useCallback(async () => {
      try {
      setLoading(true);
        const [postsResponse, categoriasResponse] = await Promise.all([
          api.get('/api/posts?include=autor,categoria,comentarios'),
          api.get('/api/categorias')
        ]);
        
        setPosts(postsResponse.data);
        setCategorias(categoriasResponse.data);
      setError('');
      } catch (err) {
        console.error('Error al cargar datos:', err);
        setError('Error al cargar el blog. Por favor, inténtalo de nuevo más tarde.');
      toast.error('Error al cargar el blog');
      } finally {
        setLoading(false);
      }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta publicación?')) {
      try {
        await api.delete(`/api/posts/${id}`);
        setPosts(posts.filter(post => post.id !== id));
        toast.success('Publicación eliminada exitosamente');
      } catch (err) {
        console.error('Error al eliminar:', err);
        toast.error('No se pudo eliminar la publicación');
      }
    }
  };

  const toggleComentarios = useCallback((postId) => {
    setComentariosAbiertos(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  }, []);

  const handleNuevoComentario = async (postId, e) => {
    e.preventDefault();
    const contenido = nuevosComentarios[postId]?.trim();
    if (!contenido) return;

    try {
      const response = await api.post(`/api/posts/${postId}/comentarios`, {
        contenido
      });
      
      setPosts(posts.map(post => 
        post.id === postId 
          ? { ...post, comentarios: [...post.comentarios, response.data] }
          : post
      ));
      
    setNuevosComentarios(prev => ({
      ...prev,
      [postId]: ''
    }));
      
      toast.success('Comentario agregado exitosamente');
    } catch (err) {
      console.error('Error al agregar comentario:', err);
      toast.error('No se pudo agregar el comentario');
    }
  };

  const postsFiltrados = useMemo(() => {
    return posts
      .filter(post => 
        categoriaSeleccionada === 'todas' || post.categoria?.nombre === categoriaSeleccionada
      )
      .filter(post =>
        searchTerm === '' ||
        post.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.contenido.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [posts, categoriaSeleccionada, searchTerm]);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
    </div>
  );

  if (error) return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-red-50 border-l-4 border-red-500 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
            <button 
              onClick={fetchData}
              className="mt-2 text-sm text-indigo-600 hover:text-indigo-500 flex items-center"
            >
              <FiRefreshCw className="mr-2" />
              Reintentar
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Blog</h1>
              <p className="text-gray-600">Publicaciones y artículos del blog</p>
            </div>
            <Link
              href="/dashboard/blog/crear"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 w-full sm:w-auto justify-center"
            >
              <FiPlus className="-ml-1 mr-2 h-5 w-5" />
              Nueva publicación
            </Link>
          </div>
          
          <div className="mb-8 space-y-4">
          <CategoryFilter 
            categories={categorias}
            selectedCategory={categoriaSeleccionada}
            onSelectCategory={setCategoriaSeleccionada}
          />
          
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar publicaciones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {postsFiltrados.length > 0 ? (
            postsFiltrados.map((post) => (
              <PostCard 
                key={post.id}
                post={post}
                onDelete={handleDelete}
                showActions={true}
                onToggleComments={toggleComentarios}
                isCommentsOpen={comentariosAbiertos[post.id]}
                onNewComment={handleNuevoComentario}
                newComment={nuevosComentarios[post.id]}
                onNewCommentChange={(value) => 
                  setNuevosComentarios(prev => ({ ...prev, [post.id]: value }))
                }
              />
            ))
          ) : (
            <div className="col-span-3 text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">
                No hay publicaciones
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm 
                  ? 'No se encontraron publicaciones que coincidan con tu búsqueda.'
                  : categoriaSeleccionada === 'todas'
                  ? 'Aún no hay publicaciones en el blog.'
                  : `No hay publicaciones en la categoría "${categoriaSeleccionada}".`}
              </p>
              <div className="mt-6">
                <Link
                  href="/dashboard/blog/crear"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                >
                  <FiPlus className="-ml-1 mr-2 h-5 w-5" />
                  Crear publicación
                </Link>
              </div>
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
}