import axios from 'axios';

const API_URL = '/api/blog';

export interface Post {
  id: number;
  titulo: string;
  contenido: string;
  imagen?: string;
  likes: number;
  comentarios: any[];
  autor: {
    id: number;
    nombre: string;
    avatar?: string;
  };
  createdAt: string;
}

export const getPosts = async (): Promise<Post[]> => {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
    
    const response = await axios.get(API_URL, { headers });
    return response.data;
  } catch (error) {
    console.error('Error al obtener publicaciones:', error);
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        // Si el token es inválido o ha expirado, limpiar el token
        localStorage.removeItem('token');
      }
      throw error;
    }
    throw new Error('Error al cargar las publicaciones');
  }
};

export const createPost = async (content: string, token: string): Promise<Post> => {
  try {
    const response = await axios.post(
      API_URL,
      { contenido: content },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error al crear publicación:', error);
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        // Si el token es inválido o ha expirado, limpiar el token
        localStorage.removeItem('token');
      }
      throw error;
    }
    throw new Error('Error al crear la publicación');
  }
};

export const likePost = async (postId: number, token: string): Promise<void> => {
  try {
    await axios.post(
      `${API_URL}/${postId}/like`,
      {},
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
  } catch (error) {
    console.error('Error al dar like:', error);
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        // Si el token es inválido o ha expirado, limpiar el token
        localStorage.removeItem('token');
      }
      throw error;
    }
    throw new Error('Error al dar like a la publicación');
  }
};
