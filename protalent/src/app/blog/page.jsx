'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/auth/AuthContext';
import { useChatNotifications } from '../context/chat/ChatContext';
import { FiHeart, FiShare2, FiX } from 'react-icons/fi';
import api from '../lib/axios';

export default function BlogPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { getTotalUnreadCount, getRecentChats, addToRecentChats } = useChatNotifications();
  const [blogPosts, setBlogPosts] = useState([]);
  const [allPosts, setAllPosts] = useState([]); // Todos los posts sin filtrar
  const [categorias, setCategorias] = useState([]);
  const [selectedCategoria, setSelectedCategoria] = useState(null);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [loadingCategorias, setLoadingCategorias] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  
  // Estados para usuarios
  const [usuarios, setUsuarios] = useState([]);
  const [loadingUsuarios, setLoadingUsuarios] = useState(true);
  const [usuariosModalOpen, setUsuariosModalOpen] = useState(false);
  const [searchUsuarios, setSearchUsuarios] = useState('');
  const [usuariosBusqueda, setUsuariosBusqueda] = useState([]);
  const [loadingBusqueda, setLoadingBusqueda] = useState(false);

  // Estados para chat
  const [chatModalOpen, setChatModalOpen] = useState(false);

  useEffect(() => {
    // Si no está cargando y no hay usuario, redirigir al login
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  // Cargar categorías
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        setLoadingCategorias(true);
        const response = await api.get('/api/categorias');
        console.log('Categorías recibidas:', response.data);
        
        // Tomar solo las primeras 5 categorías
        const topCategorias = response.data.slice(0, 5);
        setCategorias(topCategorias);
      } catch (error) {
        console.error('Error al cargar categorías:', error);
      } finally {
        setLoadingCategorias(false);
      }
    };

    if (user) {
      fetchCategorias();
    }
  }, [user]);

  // Cargar usuarios
  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        setLoadingUsuarios(true);
        const response = await api.get('/api/auth/usuarios-publicos?limit=10');
        console.log('Usuarios recibidos:', response.data);
        
        setUsuarios(response.data.usuarios || []);
      } catch (error) {
        console.error('Error al cargar usuarios:', error);
      } finally {
        setLoadingUsuarios(false);
      }
    };

    if (user) {
      fetchUsuarios();
    }
  }, [user]);

  // Cargar posts del blog
  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        setLoadingPosts(true);
        const response = await api.get('/api/posts');
        
        console.log('Datos recibidos del backend:', response.data);
        
        // Procesar los datos y obtener reacciones para cada post
        const postsProcessed = await Promise.all(response.data.map(async (post) => {
          // Procesar imagen de BlogPostMedia
          let imagen = null;
          if (post.BlogPostMedia && post.BlogPostMedia.length > 0) {
            imagen = post.BlogPostMedia[0].ruta;
          }
          
          // Obtener reacciones del nuevo endpoint
          let likes = 0;
          let userLiked = false;
          
          try {
            console.log(`Obteniendo reacciones para post ${post.id} usando nuevo endpoint...`);
            const reactionResponse = await api.get(`/api/posts/${post.id}/reactions`);
            const reactionData = reactionResponse.data;
            
            console.log(`Reacciones obtenidas para post ${post.id}:`, reactionData);
            
            likes = reactionData.resumen.likes || 0;
            userLiked = reactionData.reacciones.some(r => r.userId === user.id && r.tipo === 'like');
            
            console.log(`Post ${post.id}: ${likes} likes, userLiked: ${userLiked}`);
            
          } catch (error) {
            console.error(`Error al obtener reacciones para post ${post.id}:`, error);
            
            // Fallback a los datos incluidos
            if (post.BlogPostReaction && Array.isArray(post.BlogPostReaction)) {
              console.log(`Usando fallback para post ${post.id}`);
              likes = post.BlogPostReaction.filter(r => r.tipo === 'like').length;
              userLiked = post.BlogPostReaction.some(r => r.userId === user.id && r.tipo === 'like');
            }
          }
          
          return {
            ...post,
            likes,
            userLiked,
            imagen,
            categoria: post.Categoria
          };
        }));
        
        setAllPosts(postsProcessed); // Guardar todos los posts
        setBlogPosts(postsProcessed); // Mostrar todos inicialmente
      } catch (error) {
        console.error('Error al cargar posts del blog:', error);
      } finally {
        setLoadingPosts(false);
      }
    };

    if (user) {
      fetchBlogPosts();
    }
  }, [user]);

  // Función para filtrar posts por categoría
  const handleCategoriaClick = async (categoria) => {
    console.log('Filtrando por categoría:', categoria);
    
    if (selectedCategoria && selectedCategoria.id === categoria.id) {
      // Si ya está seleccionada, mostrar todos los posts
      setSelectedCategoria(null);
      setBlogPosts(allPosts);
    } else {
      // Obtener posts de la categoría desde el backend
      try {
        setLoadingPosts(true);
        setSelectedCategoria(categoria);
        
        console.log(`Obteniendo posts para categoría ${categoria.id}...`);
        const response = await api.get(`/api/posts/categoria/${categoria.id}`);
        
        console.log('Posts de categoría recibidos:', response.data);
        
        // Procesar los posts igual que en la carga inicial
        const postsProcessed = await Promise.all(response.data.posts.map(async (post) => {
          // Procesar imagen de BlogPostMedia
          let imagen = null;
          if (post.BlogPostMedia && post.BlogPostMedia.length > 0) {
            imagen = post.BlogPostMedia[0].ruta;
          }
          
          // Procesar reacciones
          let likes = 0;
          let userLiked = false;
          
          try {
            console.log(`Obteniendo reacciones para post ${post.id}...`);
            const reactionResponse = await api.get(`/api/posts/${post.id}/reactions`);
            const reactionData = reactionResponse.data;
            
            likes = reactionData.resumen.likes || 0;
            userLiked = reactionData.reacciones.some(r => r.userId === user.id && r.tipo === 'like');
            
          } catch (error) {
            console.error(`Error al obtener reacciones para post ${post.id}:`, error);
            
            // Fallback a los datos incluidos
            if (post.BlogPostReaction && Array.isArray(post.BlogPostReaction)) {
              likes = post.BlogPostReaction.filter(r => r.tipo === 'like').length;
              userLiked = post.BlogPostReaction.some(r => r.userId === user.id && r.tipo === 'like');
            }
          }
          
          return {
            ...post,
            likes,
            userLiked,
            imagen,
            categoria: post.Categoria
          };
        }));
        
        setBlogPosts(postsProcessed);
        
      } catch (error) {
        console.error('Error al obtener posts por categoría:', error);
        alert('Error al cargar posts de la categoría. Inténtalo de nuevo.');
        // En caso de error, volver a mostrar todos los posts
        setSelectedCategoria(null);
        setBlogPosts(allPosts);
      } finally {
        setLoadingPosts(false);
      }
    }
  };

  // Función para mostrar todos los posts
  const handleMostrarTodos = () => {
    console.log('Mostrando todos los posts...');
    setSelectedCategoria(null);
    setBlogPosts(allPosts);
  };

  // Función para buscar usuarios
  const handleBuscarUsuarios = async (searchTerm) => {
    if (!searchTerm || searchTerm.trim().length < 2) {
      setUsuariosBusqueda([]);
      return;
    }

    try {
      setLoadingBusqueda(true);
      const response = await api.get(`/api/auth/buscar-usuarios?q=${encodeURIComponent(searchTerm.trim())}`);
      console.log('Usuarios encontrados:', response.data);
      
      setUsuariosBusqueda(response.data.usuarios || []);
    } catch (error) {
      console.error('Error al buscar usuarios:', error);
      setUsuariosBusqueda([]);
    } finally {
      setLoadingBusqueda(false);
    }
  };

  // Función para ir al chat con un usuario
  const handleChatWithUser = (usuario) => {
    // Agregar a conversaciones recientes
    addToRecentChats(usuario.id, usuario.nombre, '', new Date().toISOString());
    router.push(`/chat?userId=${usuario.id}&userName=${encodeURIComponent(usuario.nombre)}`);
  };

  // Función para abrir modal de usuarios
  const handleAbrirModalUsuarios = () => {
    setUsuariosModalOpen(true);
    setSearchUsuarios('');
    setUsuariosBusqueda([]);
  };

  // Función para cerrar modal de usuarios
  const handleCerrarModalUsuarios = () => {
    setUsuariosModalOpen(false);
    setSearchUsuarios('');
    setUsuariosBusqueda([]);
  };

  // Funciones para el modal de chat
  const handleAbrirModalChat = () => {
    setChatModalOpen(true);
  };

  const handleCerrarModalChat = () => {
    setChatModalOpen(false);
  };

  // Función para ir al chat desde conversaciones recientes
  const handleOpenRecentChat = (chat) => {
    setChatModalOpen(false);
    router.push(`/chat?userId=${chat.userId}&userName=${encodeURIComponent(chat.userName)}`);
  };

  // Función para dar like
  const handleLike = async (postId) => {
    try {
      console.log(`Intentando dar like al post ${postId}...`);
      
      // Enviar reacción al backend
      const response = await api.post(`/api/posts/${postId}/reaccion`, {
        tipo: 'like'
      });
      
      console.log('Respuesta del like:', response.data);
      
      // Obtener las reacciones actualizadas usando el nuevo endpoint
      try {
        const reactionResponse = await api.get(`/api/posts/${postId}/reactions`);
        const reactionData = reactionResponse.data;
        
        const newLikes = reactionData.resumen.likes || 0;
        const newUserLiked = reactionData.reacciones.some(r => r.userId === user.id && r.tipo === 'like');
        
        console.log(`Reacciones actualizadas - likes: ${newLikes}, userLiked: ${newUserLiked}`);
        
        // Actualizar el estado local
        setBlogPosts(posts => 
          posts.map(post => {
            if (post.id === postId) {
              return { ...post, likes: newLikes, userLiked: newUserLiked };
            }
            return post;
          })
        );
        
        // También actualizar el post seleccionado si está abierto en el modal
        if (selectedPost && selectedPost.id === postId) {
          setSelectedPost(prev => ({
            ...prev,
            likes: newLikes,
            userLiked: newUserLiked
          }));
        }
        
      } catch (reactionError) {
        console.error('Error al obtener reacciones actualizadas:', reactionError);
        
        // Fallback: actualizar usando lógica toggle
        setBlogPosts(posts => 
          posts.map(post => {
            if (post.id === postId) {
              const newUserLiked = !post.userLiked;
              const newLikes = newUserLiked ? post.likes + 1 : Math.max(0, post.likes - 1);
              return { ...post, likes: newLikes, userLiked: newUserLiked };
            }
            return post;
          })
        );
        
        if (selectedPost && selectedPost.id === postId) {
          setSelectedPost(prev => {
            const newUserLiked = !prev.userLiked;
            const newLikes = newUserLiked ? prev.likes + 1 : Math.max(0, prev.likes - 1);
            return { ...prev, likes: newLikes, userLiked: newUserLiked };
          });
        }
      }
      
    } catch (error) {
      console.error('Error al dar like:', error);
      console.error('Detalles del error:', error.response?.data || error.message);
      alert('Error al procesar la reacción. Inténtalo de nuevo.');
    }
  };

  // Función para compartir
  const handleShare = (post) => {
    const cleanContent = post.contenido ? post.contenido.replace(/<[^>]*>/g, '') : '';
    const shareText = `${post.titulo}\n\n${post.descripcion || cleanContent.substring(0, 100) + '...'}\n\nVisto en ProTalent Blog`;
    
    navigator.clipboard.writeText(shareText).then(() => {
      alert('Contenido copiado al portapapeles');
    }).catch(err => {
      console.error('Error al copiar:', err);
      // Fallback para navegadores que no soportan clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = shareText;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        alert('Contenido copiado al portapapeles');
      } catch (fallbackErr) {
        console.error('Error en fallback:', fallbackErr);
        alert('No se pudo copiar el contenido');
      }
      document.body.removeChild(textArea);
    });
  };

  // Función para abrir modal de lectura
  const openModal = (post) => {
    setSelectedPost(post);
    setModalOpen(true);
  };

  // Función para cerrar modal
  const closeModal = () => {
    setModalOpen(false);
    setSelectedPost(null);
  };

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Cargando...</div>
      </div>
    );
  }

  // Si no hay usuario, no mostrar nada (se está redirigiendo)
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg">
          <div className="p-6">
            {/* Información del usuario */}
            <div className="border-b border-gray-200 pb-4 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">
                Hola, {user.nombre}
              </h2>
              <p className="text-sm text-gray-600">
                {user.email}
              </p>
            </div>

            {/* Sección Menú */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
                Menú
              </h3>
              <div className="space-y-2">
                <button
                  onClick={handleMostrarTodos}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors duration-200 ${
                    !selectedCategoria
                      ? 'bg-blue-100 text-blue-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  Todos los Posts
                </button>
                
                <button
                  onClick={handleAbrirModalChat}
                  className="w-full text-left px-3 py-2 rounded-md text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200 relative"
                >
                  Chat
                  {getTotalUnreadCount() > 0 && (
                    <span className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {getTotalUnreadCount() > 9 ? '9+' : getTotalUnreadCount()}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Sección Categorías */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
                Categorías
              </h3>
              {loadingCategorias ? (
                <div className="text-sm text-gray-500">Cargando...</div>
              ) : categorias.length > 0 ? (
                <div className="space-y-1">
                  {categorias.map((categoria) => (
                    <button
                      key={categoria.id}
                      onClick={() => handleCategoriaClick(categoria)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors duration-200 ${
                        selectedCategoria && selectedCategoria.id === categoria.id
                          ? 'bg-blue-100 text-blue-700 font-medium'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      #{categoria.nombre}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-gray-500">No hay categorías</div>
              )}
            </div>
          </div>
        </div>

        {/* Contenido principal y usuarios */}
        <div className="flex-1 flex flex-row p-8 gap-8">
          <div className="max-w-4xl flex-1">
            {/* Header con botón Mi Espacio */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Blog</h1>
                {selectedCategoria && (
                  <p className="text-sm text-gray-600 mt-1">
                    Mostrando posts de: <span className="font-medium">#{selectedCategoria.nombre}</span>
                  </p>
                )}
              </div>
              
              <button
                onClick={() => router.push('/dashboard')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
              >
                Mi Espacio
              </button>
            </div>
            
            
            {loadingPosts ? (
              <div className="text-center py-8">
                <div className="text-lg text-gray-600">
                  {selectedCategoria 
                    ? `Cargando posts de "${selectedCategoria.nombre}"...` 
                    : 'Cargando posts...'
                  }
                </div>
              </div>
            ) : blogPosts.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-lg text-gray-600 mb-4">
                  {selectedCategoria 
                    ? `No hay posts en la categoría "${selectedCategoria.nombre}"` 
                    : 'No hay posts disponibles'
                  }
                </div>
                {selectedCategoria && (
                  <button
                    onClick={handleMostrarTodos}
                    className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                  >
                    Ver todos los posts
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                {blogPosts.map((post) => (
                  <div key={post.id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                    <div className="flex flex-col md:flex-row">
                      {/* Imagen del post */}
                      {post.imagen && (
                        <div className="md:w-1/3">
                          <img 
                            src={post.imagen} 
                            alt={post.titulo}
                            className="w-full h-48 md:h-full object-cover rounded-t-lg md:rounded-l-lg md:rounded-t-none"
                          />
                        </div>
                      )}
                      
                      <div className={`p-6 ${post.imagen ? 'md:w-2/3' : 'w-full'}`}>
                        {/* Título */}
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">
                          {post.titulo}
                        </h3>
                        
                        {/* Categoría como hashtag */}
                        {post.categoria && (
                          <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full mb-4">
                            #{post.categoria.nombre}
                          </span>
                        )}
                        
                        {/* Descripción breve */}
                        <p className="text-gray-600 mb-6">
                          {post.descripcion || (post.contenido ? post.contenido.replace(/<[^>]*>/g, '').substring(0, 200) + '...' : 'Sin descripción')}
                        </p>
                        
                        {/* Botones de acción */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <button
                              onClick={() => handleLike(post.id)}
                              className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors duration-200 ${
                                post.userLiked 
                                  ? 'bg-red-100 text-red-600' 
                                  : 'bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600'
                              }`}
                            >
                              <FiHeart className={post.userLiked ? 'fill-current' : ''} size={18} />
                              <span>{post.likes || 0}</span>
                            </button>
                            
                            <button
                              onClick={() => handleShare(post)}
                              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-600 rounded-full transition-colors duration-200"
                            >
                              <FiShare2 size={18} />
                              <span>Compartir</span>
                            </button>
                          </div>
                          
                          {/* Botón Leer */}
                          <button
                            onClick={() => openModal(post)}
                            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg font-medium transition-colors duration-200"
                          >
                            Leer
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Modal para leer el post completo */}
            {modalOpen && selectedPost && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-y-auto">
                  {/* Header del modal */}
                  <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {selectedPost.titulo}
                    </h2>
                    <button
                      onClick={closeModal}
                      className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    >
                      <FiX size={24} />
                    </button>
                  </div>
                  
                  {/* Contenido del modal */}
                  <div className="p-6">
                    {/* Categoría */}
                    {selectedPost.categoria && (
                      <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full mb-4">
                        #{selectedPost.categoria.nombre}
                      </span>
                    )}
                    
                    {/* Imagen */}
                    {selectedPost.imagen && (
                      <img 
                        src={selectedPost.imagen} 
                        alt={selectedPost.titulo}
                        className="w-full h-64 object-cover rounded-lg mb-6"
                      />
                    )}
                    
                    {/* Contenido completo */}
                    <div className="prose max-w-none">
                      <div dangerouslySetInnerHTML={{ __html: selectedPost.contenido }} />
                    </div>
                    
                    {/* Botones de acción en el modal */}
                    <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-200">
                      <button
                        onClick={() => handleLike(selectedPost.id)}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors duration-200 ${
                          selectedPost.userLiked 
                            ? 'bg-red-100 text-red-600' 
                            : 'bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600'
                        }`}
                      >
                        <FiHeart className={selectedPost.userLiked ? 'fill-current' : ''} size={18} />
                        <span>{selectedPost.likes || 0} likes</span>
                      </button>
                      
                      <button
                        onClick={() => handleShare(selectedPost)}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-600 hover:bg-blue-200 rounded-full transition-colors duration-200"
                      >
                        <FiShare2 size={18} />
                        <span>Compartir</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          </div>
          {/* Usuarios a la derecha */}
          <div className="w-80 bg-white shadow-lg rounded-lg p-6 h-fit sticky top-8 self-start">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Usuarios</h3>
              <button
                onClick={handleAbrirModalUsuarios}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Chatear
              </button>
            </div>
            {loadingUsuarios ? (
              <div className="text-sm text-gray-500">Cargando usuarios...</div>
            ) : usuarios.length === 0 ? (
              <div className="text-sm text-gray-500">No hay usuarios</div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {usuarios.slice(0, 10).map((u) => (
                  <li key={u.id} className="py-3">
                    <button
                      onClick={() => handleChatWithUser(u)}
                      className="w-full text-left hover:bg-gray-50 rounded-md p-2 transition-colors duration-200"
                    >
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-800 hover:text-blue-600">{u.nombre}</span>
                        <span className="text-xs text-gray-500">{u.email}</span>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-400 capitalize">{u.rol}</span>
                          <span className="text-xs text-blue-500">Click para chatear</span>
                        </div>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
      {/* Modal de usuarios */}
      {usuariosModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-lg">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Selecciona un usuario para chatear</h2>
              <button
                onClick={handleCerrarModalUsuarios}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <FiX size={24} />
              </button>
            </div>
            <div className="p-6">
              <input
                type="text"
                placeholder="Buscar por nombre o email..."
                className="w-full border border-gray-300 rounded-md px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-200"
                value={searchUsuarios}
                onChange={e => {
                  setSearchUsuarios(e.target.value);
                  handleBuscarUsuarios(e.target.value);
                }}
              />
              {loadingBusqueda ? (
                <div className="text-sm text-gray-500">Buscando...</div>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {(searchUsuarios.trim().length >= 2 ? usuariosBusqueda : usuarios).map((u) => (
                    <li key={u.id} className="py-3">
                      <button
                        onClick={() => handleChatWithUser(u)}
                        className="w-full text-left hover:bg-gray-50 rounded-md p-2 transition-colors duration-200"
                      >
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-800 hover:text-blue-600">{u.nombre}</span>
                          <span className="text-xs text-gray-500">{u.email}</span>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-400 capitalize">{u.rol}</span>
                            <span className="text-xs text-blue-500">Click para chatear</span>
                          </div>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal de conversaciones recientes */}
      {chatModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-lg">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Mis Conversaciones</h2>
              <button
                onClick={handleCerrarModalChat}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <FiX size={24} />
              </button>
            </div>
            <div className="p-6">
              {/* Botón para buscar nuevos usuarios */}
              <button
                onClick={() => {
                  setChatModalOpen(false);
                  setUsuariosModalOpen(true);
                }}
                className="w-full mb-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
              >
                + Buscar nuevo usuario para chatear
              </button>

              {/* Lista de conversaciones recientes */}
              {getRecentChats().length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-gray-500 mb-4">No tienes conversaciones recientes</div>
                  <p className="text-sm text-gray-400">
                    Inicia una nueva conversación buscando usuarios en el sidebar
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Conversaciones recientes:</h3>
                  <ul className="divide-y divide-gray-200">
                    {getRecentChats().map((chat) => (
                      <li key={chat.userId} className="py-3">
                        <button
                          onClick={() => handleOpenRecentChat(chat)}
                          className="w-full text-left hover:bg-gray-50 rounded-md p-3 transition-colors duration-200"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span className="font-medium text-gray-800 hover:text-blue-600">
                                  {chat.userName}
                                </span>
                                {chat.timestamp && (
                                  <span className="text-xs text-gray-400">
                                    {new Date(chat.timestamp).toLocaleDateString('es-ES', {
                                      day: 'numeric',
                                      month: 'short',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </span>
                                )}
                              </div>
                              {chat.lastMessage && (
                                <p className="text-sm text-gray-500 truncate mt-1">
                                  {chat.lastMessage}
                                </p>
                              )}
                            </div>
                            <div className="ml-3">
                              <span className="text-xs text-blue-500">Abrir chat</span>
                            </div>
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
