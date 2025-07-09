'use client';

import { useState, useEffect } from 'react';
import { FiImage, FiSmile, FiSend, FiUser, FiHeart, FiMessageSquare, FiShare2 } from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from 'react-hot-toast';
import { getPosts, createPost, likePost, Post } from './services/postService';
import { useAuth } from '@/app/context/auth/AuthContext';

// Importaciones de componentes
import PostComponent from './components/Post';
import StoryComponent from './components/Story';
import BaseCard from './components/BaseCard';

// Importaciones de tipos
import { PostType, StoryType, FriendSuggestionType } from './types';

// Función auxiliar para obtener URL de avatar
const getAvatarUrl = (id: number) => `https://i.pravatar.cc/150?img=${id}`;

// Datos iniciales para historias
const initialStories = [
  { id: 1, user: 'Tu historia', image: getAvatarUrl(10), isAdd: true },
  { id: 2, user: 'Juan Pérez', image: getAvatarUrl(11) },
  { id: 3, user: 'María García', image: getAvatarUrl(12) },
  { id: 4, user: 'Carlos López', image: getAvatarUrl(13) },
];

export default function BlogPage() {
  const { user } = useAuth();
  // Obtener el token del localStorage si no está en el contexto
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [postContent, setPostContent] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);
  const [stories] = useState(initialStories);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);

  // Obtener el token del localStorage al cargar el componente
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    console.log('Token obtenido del localStorage:', token);
    setAuthToken(token);
  }, []);
  
  // Datos de ejemplo para sugerencias de amigos
  const friendSuggestions = [
    { id: 1, name: 'Laura Gómez', mutualFriends: 5, avatar: getAvatarUrl(17) },
    { id: 2, name: 'Miguel Ángel', mutualFriends: 3, avatar: getAvatarUrl(18) },
    { id: 3, name: 'Sofía Ramírez', mutualFriends: 8, avatar: getAvatarUrl(19) },
  ];

  // Cargar publicaciones iniciales
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        console.log('Token actual en fetchPosts:', authToken); // Para depuración
        const postsData = await getPosts();
        setPosts(postsData);
      } catch (err) {
        const error = err as any;
        console.error('Error al cargar publicaciones:', error);
        if (error.response?.status === 401) {
          toast.error('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
          window.location.href = '/login';
        } else {
          toast.error('Error al cargar las publicaciones');
        }
      } finally {
        setLoading(false);
      }
    };

    if (authToken) {
      fetchPosts();
    } else {
      console.log('No hay token disponible para cargar publicaciones');
      setLoading(false);
    }
  }, [authToken]); // Dependencia del token del localStorage

  const handlePostSubmit = async () => {
    if (!postContent.trim()) {
      toast.error('El contenido de la publicación no puede estar vacío');
      return;
    }
    
    if (!authToken) {
      toast.error('Debes iniciar sesión para publicar');
      // Redirigir al login
      window.location.href = '/login';
      return;
    }
    
    try {
      setPosting(true);
      
      console.log('Token al crear post:', authToken); // Para depuración
      const newPost = await createPost(postContent, authToken);
      
      // Actualizar la lista de publicaciones con la nueva
      setPosts(prevPosts => [{
        ...newPost,
        author: {
          id: newPost.autor.id,
          nombre: newPost.autor.nombre,
          avatar: newPost.autor.avatar,
          role: 'Usuario',
          time: 'Ahora mismo'
        },
        content: newPost.contenido,
        image: newPost.imagen || '',
        likes: newPost.likes || 0,
        comments: newPost.comentarios?.length || 0,
        shares: 0,
        createdAt: new Date().toISOString()
      }, ...prevPosts]);
      
      setPostContent('');
      toast.success('¡Publicación creada exitosamente!');
    } catch (error: any) {
      console.error('Error al publicar:', error);
      if (error.response?.status === 401) {
        toast.error('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
        // Redirigir al login
        window.location.href = '/login';
      } else {
        const errorMessage = error.response?.data?.message || 'Error al publicar. Intenta de nuevo.';
        toast.error(errorMessage);
      }
    } finally {
      setPosting(false);
    }
  };

  const handleLike = async (postId: number) => {
    if (!authToken) {
      toast.error('Debes iniciar sesión para dar like');
      window.location.href = '/login';
      return;
    }

    try {
      await likePost(postId, authToken);
      
      // Actualizar el contador de likes localmente
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === postId 
            ? { ...post, likes: (post.likes || 0) + 1 } 
            : post
        )
      );
    } catch (error) {
      console.error('Error al dar like:', error);
      toast.error('No se pudo dar like a la publicación');
    }
  };

  // Formatear la fecha de creación
  const formatPostTime = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { 
      addSuffix: true,
      locale: es 
    });
  };

  return (
    <div className="flex flex-col md:flex-row w-full">
      {/* Contenido principal */}
      <div className="flex-1 max-w-4xl mx-auto py-8 px-4 w-full">
        {/* Sección de creación de publicación */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-gray-100">
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium">
              {user?.nombre ? user.nombre[0].toUpperCase() : 'T'}
            </div>
            <div className="flex-1">
              <textarea 
                placeholder="¿Qué estás pensando?" 
                className="w-full bg-gray-50 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-200 transition-all duration-200 resize-none"
                rows={3}
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                disabled={posting || !authToken}
              />
              
              <div className="flex flex-col sm:flex-row justify-between mt-3 pt-3 border-t border-gray-100 space-y-2 sm:space-y-0">
                <div className="flex space-x-2 overflow-x-auto pb-1">
                  <button 
                    className="flex items-center text-gray-500 hover:bg-gray-100 px-3 py-1.5 rounded-md text-sm whitespace-nowrap transition-colors"
                    disabled={posting || !authToken}
                  >
                    <FiImage className="mr-2 text-green-500" /> Imagen/Video
                  </button>
                  <button 
                    className="flex items-center text-gray-500 hover:bg-gray-100 px-3 py-1.5 rounded-md text-sm whitespace-nowrap transition-colors"
                    disabled={posting || !authToken}
                  >
                    <FiSmile className="mr-2 text-yellow-500" /> Sentimiento
                  </button>
                </div>
                <button 
                  className={`flex items-center justify-center px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                    posting || !postContent.trim() || !authToken
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                  onClick={handlePostSubmit}
                  disabled={posting || !postContent.trim() || !authToken}
                >
                  {posting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Publicando...
                    </>
                  ) : (
                    <>
                      <FiSend className="mr-2" /> Publicar
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {!authToken && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  <span className="font-medium">¡Inicia sesión</span> para poder publicar y dar me gusta a las publicaciones.
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Sección de historias */}
        <div className="mb-6 bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 px-2">Historias</h2>
          <div className="flex space-x-4 pb-2 overflow-x-auto scrollbar-hide">
            {stories.map((story) => (
              <div key={story.id} className="flex-shrink-0 w-20 text-center">
                <div className="relative w-16 h-16 mx-auto rounded-full overflow-hidden border-2 border-blue-500 p-0.5">
                  <img 
                    src={story.image} 
                    alt={story.user}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <p className="text-xs mt-1 text-gray-700 truncate">{story.user}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Publicaciones */}
        <div className="space-y-6">
          {loading && posts.length === 0 ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : posts.length > 0 ? (
            posts.map((post) => (
              <div key={post.id} className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                      {post.autor?.avatar ? (
                        <img 
                          src={post.autor.avatar} 
                          alt={post.autor.nombre} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium">
                          {post.autor?.nombre ? post.autor.nombre[0].toUpperCase() : 'U'}
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{post.autor?.nombre || 'Usuario'}</h4>
                      <p className="text-xs text-gray-500">
                        {post.createdAt ? formatPostTime(post.createdAt) : 'Recién'}
                      </p>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-800 mb-4 whitespace-pre-line">{post.contenido}</p>
                
                {post.imagen && (
                  <div className="rounded-lg overflow-hidden mb-4 bg-gray-100">
                    <img 
                      src={post.imagen} 
                      alt="Publicación" 
                      className="w-full h-auto max-h-96 object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
                
                <div className="flex items-center justify-between text-sm text-gray-500 border-t border-b border-gray-100 py-2 my-3">
                  <span>{post.likes || 0} Me gusta</span>
                  <div className="flex space-x-4">
                    <span>{post.comentarios?.length || 0} Comentarios</span>
                    <span>0 Compartidos</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-1 text-center text-gray-600 text-sm font-medium">
                  <button 
                    className="flex items-center justify-center py-2 hover:bg-gray-50 rounded-md transition-colors"
                    onClick={() => handleLike(post.id)}
                  >
                    <FiHeart className="mr-2" /> Me gusta
                  </button>
                  <button className="flex items-center justify-center py-2 hover:bg-gray-50 rounded-md transition-colors">
                    <FiMessageSquare className="mr-2" /> Comentar
                  </button>
                  <button className="flex items-center justify-center py-2 hover:bg-gray-50 rounded-md transition-colors">
                    <FiShare2 className="mr-2" /> Compartir
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-100">
              <div className="mx-auto h-24 w-24 text-gray-300 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                {loading ? 'Cargando publicaciones...' : 'No hay publicaciones'}
              </h3>
              <p className="text-gray-500">
                {!authToken 
                  ? 'Inicia sesión para ver y crear publicaciones' 
                  : 'Sé el primero en compartir algo con la comunidad'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar derecho */}
      <aside className="hidden lg:flex flex-col w-80 bg-white border-l border-gray-200 p-6 space-y-6 overflow-y-auto h-screen sticky top-0">
        {/* Sugerencias de amigos */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold text-gray-800">Sugerencias para ti</h3>
            <button className="text-blue-500 text-sm hover:underline">Ver todos</button>
          </div>
          <div className="space-y-3">
            {friendSuggestions.map((friend) => (
              <div key={friend.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex items-center space-x-3">
                  <img 
                    src={friend.avatar} 
                    alt={friend.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{friend.name}</p>
                    <p className="text-xs text-gray-500">{friend.mutualFriends} amigos en común</p>
                  </div>
                </div>
                <button 
                  className="text-blue-500 hover:text-blue-600 p-1.5 rounded-full hover:bg-blue-50"
                  title="Agregar amigo"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Grupos */}
        <BaseCard 
          title="Design Enthusiasts" 
          description="A community for passionate designers to share ideas and grow together."
          image="/images/group-design.jpg"
          actions={
            <>
              <button className="flex-1 text-gray-600 hover:text-blue-600 text-sm">
                256 Members
              </button>
              <button className="flex-1 bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600 text-sm">
                Join
              </button>
            </>
          }
        />

        {/* Eventos */}
        <BaseCard 
          title="Design Conference 2024" 
          description="Join us for the most anticipated design event of the year!"
          image="/images/design-conference.jpg"
          actions={
            <>
              <div className="flex-1 text-gray-600 text-sm">
                June 15-16, 2024
              </div>
              <button className="flex-1 bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600 text-sm">
                Attend
              </button>
            </>
          }
        />
      </aside>
    </div>
  );
}
