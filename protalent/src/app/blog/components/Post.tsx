import Image from 'next/image';

// Función para obtener avatares de placeholder
const getAvatarUrl = (id: number) => `https://i.pravatar.cc/150?img=${id}`;

interface Author {
  name: string;
  avatar?: string;
  role: string;
  time: string;
}

interface PostProps {
  post: {
    id: number;
    author: Author;
    content: string;
    image?: string;
    likes: number;
    comments: number;
    shares: number;
  };
}

export default function Post({ post }: PostProps) {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 max-w-md mx-auto">
      {/* Encabezado de la publicación */}
      <div className="p-5">
        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 rounded-full overflow-hidden ring-2 ring-blue-100">
            <Image 
              src={post.author.avatar || getAvatarUrl(post.id)} 
              alt={post.author.name}
              width={48}
              height={48}
              className="object-cover h-full w-full"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = getAvatarUrl(post.id);
              }}
            />
          </div>
          <div>
            <h4 className="font-semibold text-gray-800">{post.author.name}</h4>
            <p className="text-xs text-gray-500">{post.author.role} • {post.author.time}</p>
          </div>
        </div>
        
        <p className="mt-4 text-gray-700 leading-relaxed">{post.content}</p>
      </div>
      
      {/* Imagen de la publicación */}
      {post.image && (
        <div className="w-full h-72 bg-gray-100 relative overflow-hidden">
          <Image 
            src={post.image.startsWith('http') ? post.image : `/images/${post.image}`} 
            alt="Post content"
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://via.placeholder.com/600x300?text=Imagen+no+disponible';
            }}
          />
        </div>
      )}
      
      {/* Acciones de la publicación */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex justify-between text-sm text-gray-600 mb-3">
          <span className="flex items-center">
            <svg className="w-4 h-4 mr-1 text-red-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            {post.likes}
          </span>
          <div className="flex space-x-3">
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              {post.comments}
            </span>
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              {post.shares}
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-2">
          <button className="flex items-center justify-center py-2 text-gray-600 hover:bg-blue-50 rounded-md transition-colors">
            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
            </svg>
            Me gusta
          </button>
          <button className="flex items-center justify-center py-2 text-gray-600 hover:bg-blue-50 rounded-md transition-colors">
            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            Comentar
          </button>
          <button className="flex items-center justify-center py-2 text-gray-600 hover:bg-blue-50 rounded-md transition-colors">
            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Compartir
          </button>
        </div>
      </div>
    </div>
  );
}
