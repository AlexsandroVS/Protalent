export interface User {
  id: number;
  nombre: string;
  email: string;
  avatar?: string;
  role?: string;
}

export interface Author {
  id: number;
  nombre: string;
  avatar?: string;
  role?: string;
  time?: string;
}

export interface Post {
  id: number;
  titulo?: string;
  contenido: string;
  imagen?: string;
  likes: number;
  comentarios: Comment[];
  autor: Author;
  createdAt: string;
  updatedAt?: string;
}

export interface Comment {
  id: number;
  contenido: string;
  autor: Author;
  createdAt: string;
}

export interface PostType extends Omit<Post, 'comentarios' | 'contenido'> {
  author: Author;
  content: string;
  image: string;
  comments: number;
  shares: number;
}

export interface StoryType {
  id: number;
  user: string;
  image: string;
  isAdd?: boolean;
}

export interface FriendSuggestionType {
  id: number;
  name: string;
  mutualFriends: number;
  avatar: string;
}

export interface CreatePostData {
  contenido: string;
  imagen?: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}
