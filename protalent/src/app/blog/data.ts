import { PostType, StoryType, FriendSuggestionType } from './types';

// Función para obtener avatares de placeholder
const getAvatarUrl = (id: number) => `https://i.pravatar.cc/150?img=${id}`;

// URLs de imágenes de ejemplo de Unsplash
const POST_IMAGE_URLS = [
  'https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
  'https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80'
];

export const stories: StoryType[] = [
  { 
    id: 1, 
    user: 'Tu historia', 
    image: getAvatarUrl(10), 
    isAdd: true 
  },
  { 
    id: 2, 
    user: 'Juan Pérez', 
    image: getAvatarUrl(11) 
  },
  { 
    id: 3, 
    user: 'María García', 
    image: getAvatarUrl(12) 
  },
  { 
    id: 4, 
    user: 'Carlos López', 
    image: getAvatarUrl(13) 
  },
];

export const posts: PostType[] = [
  {
    id: 1,
    author: {
      name: 'Ana Martínez',
      avatar: getAvatarUrl(14),
      role: 'Desarrolladora Frontend',
      time: 'Hace 2 horas'
    },
    content: '¡Acabo de publicar un nuevo artículo sobre React 18 y sus nuevas características! ¿Alguien ya ha probado los nuevos concurrent features?',
    image: POST_IMAGE_URLS[0],
    likes: 124,
    comments: 28,
    shares: 14
  },
  {
    id: 2,
    author: {
      name: 'Pedro Sánchez',
      avatar: getAvatarUrl(15),
      role: 'Arquitecto de Software',
      time: 'Ayer a las 18:30'
    },
    content: 'Compartiendo algunas reflexiones sobre arquitectura de microservicios y cómo estamos escalando nuestra plataforma.',
    image: POST_IMAGE_URLS[1],
    likes: 89,
    comments: 15,
    shares: 7
  },
  {
    id: 3,
    author: {
      name: 'Laura Gómez',
      avatar: getAvatarUrl(16),
      role: 'Diseñadora UX/UI',
      time: 'Hace 3 días'
    },
    content: 'Nuevo diseño de interfaz para nuestra aplicación móvil. ¡Me encantaría saber su opinión!',
    image: POST_IMAGE_URLS[2],
    likes: 210,
    comments: 42,
    shares: 18
  }
];

export const friendSuggestions: FriendSuggestionType[] = [
  { 
    id: 1, 
    name: 'Laura Gómez', 
    mutualFriends: 5, 
    avatar: getAvatarUrl(17) 
  },
  { 
    id: 2, 
    name: 'Miguel Ángel', 
    mutualFriends: 3, 
    avatar: getAvatarUrl(18) 
  },
  { 
    id: 3, 
    name: 'Sofía Ramírez', 
    mutualFriends: 8, 
    avatar: getAvatarUrl(19) 
  },
];
