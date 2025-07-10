'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../context/auth/AuthContext';
import { useChatNotifications } from '../context/chat/ChatContext';
import { FiSend, FiArrowLeft, FiUser } from 'react-icons/fi';
import api from '../lib/axios';
import io from 'socket.io-client';

export default function ChatPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading } = useAuth();
  const { markAsRead, addToRecentChats } = useChatNotifications();
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [targetUser, setTargetUser] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const targetUserId = searchParams.get('userId');
  const targetUserName = searchParams.get('userName');

  useEffect(() => {
    // Si no está cargando y no hay usuario, redirigir al login
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  // Scroll automático a los últimos mensajes
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  // Configurar Socket.IO
  useEffect(() => {
    if (!user || !targetUserId) return;

    const newSocket = io('http://localhost:5000', {
      auth: {
        token: localStorage.getItem('token')
      }
    });

    newSocket.on('connect', () => {
      console.log('Conectado al chat');
      setIsConnected(true);
      
      // Unirse a la sala de chat
      const roomId = [user.id, targetUserId].sort().join('-');
      newSocket.emit('join-chat', { roomId, userId: user.id, targetUserId });
    });

    newSocket.on('disconnect', () => {
      console.log('Desconectado del chat');
      setIsConnected(false);
    });

    newSocket.on('receive-message', (messageData) => {
      console.log('Mensaje recibido:', messageData);
      
      // Solo agregar el mensaje si no es nuestro (para evitar duplicados)
      // Los mensajes propios ya se agregan localmente al enviarlos
      if (messageData.senderId !== user.id) {
        setMessages(prev => {
          // Verificar si el mensaje ya existe para evitar duplicados
          const messageExists = prev.some(msg => 
            msg.id === messageData.id || 
            (msg.content === messageData.content && 
             msg.senderId === messageData.senderId && 
             Math.abs(new Date(msg.timestamp) - new Date(messageData.timestamp)) < 1000)
          );
          
          if (messageExists) {
            console.log('Mensaje duplicado detectado, no se agregará');
            return prev;
          }
          
          return [...prev, messageData];
        });
        
        // Actualizar conversaciones recientes con el mensaje recibido
        addToRecentChats(messageData.senderId, messageData.senderName, messageData.content, messageData.timestamp);
      }
    });

    newSocket.on('user-typing', (data) => {
      if (data.userId !== user.id) {
        setIsTyping(true);
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
          setIsTyping(false);
        }, 3000);
      }
    });

    newSocket.on('user-stopped-typing', (data) => {
      if (data.userId !== user.id) {
        setIsTyping(false);
      }
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user, targetUserId]);

  // Cargar información del usuario objetivo
  useEffect(() => {
    if (targetUserId && targetUserName) {
      setTargetUser({
        id: targetUserId,
        nombre: targetUserName
      });

      // Agregar a conversaciones recientes cuando se abre el chat
      addToRecentChats(targetUserId, targetUserName, '', new Date().toISOString());
      
      // Marcar mensajes como leídos cuando entras al chat
      markAsRead(targetUserId);
    }
  }, [targetUserId, targetUserName]); // Solo depende de targetUserId y targetUserName

  // Función para enviar mensaje
  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !socket || !targetUser) return;

    // Generar un ID único más robusto
    const messageId = `${user.id}-${targetUser.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const messageData = {
      id: messageId,
      content: newMessage.trim(),
      senderId: user.id,
      senderName: user.nombre,
      targetId: targetUser.id,
      timestamp: new Date().toISOString()
    };

    // Enviar mensaje via socket
    socket.emit('send-message', messageData);
    
    // Agregar mensaje a la lista local inmediatamente
    setMessages(prev => [...prev, messageData]);

    // Actualizar conversaciones recientes con el mensaje enviado
    addToRecentChats(targetUser.id, targetUser.nombre, newMessage.trim(), messageData.timestamp);
    
    // Limpiar input
    setNewMessage('');
    
    // Detener indicador de escritura
    socket.emit('stop-typing', { 
      roomId: [user.id, targetUser.id].sort().join('-'),
      userId: user.id 
    });
  };

  // Función para manejar escritura
  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    
    if (!socket || !targetUser) return;
    
    const roomId = [user.id, targetUser.id].sort().join('-');
    
    if (e.target.value.trim()) {
      socket.emit('typing', { roomId, userId: user.id });
    } else {
      socket.emit('stop-typing', { roomId, userId: user.id });
    }
  };

  // Función para volver al blog
  const handleGoBack = () => {
    router.push('/blog');
  };

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Cargando...</div>
      </div>
    );
  }

  // Si no hay usuario, no mostrar nada
  if (!user) {
    return null;
  }

  // Si no hay usuario objetivo
  if (!targetUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600 mb-4">No se ha seleccionado ningún usuario para chatear</p>
          <button
            onClick={handleGoBack}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Volver al Blog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto">
        {/* Header del chat */}
        <div className="bg-white shadow-sm border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleGoBack}
                className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                <FiArrowLeft size={24} />
              </button>
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <FiUser className="text-blue-600" size={20} />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-gray-900">
                    {targetUser.nombre}
                  </h1>
                  <p className="text-sm text-gray-500">
                    {isConnected ? 'En línea' : 'Desconectado'}
                  </p>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => router.push('/dashboard')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
            >
              Mi Espacio
            </button>
          </div>
        </div>

        {/* Área de mensajes */}
        <div className="bg-white" style={{ height: 'calc(100vh - 200px)' }}>
          <div className="flex flex-col h-full">
            {/* Lista de mensajes */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <p>No hay mensajes aún. ¡Inicia la conversación!</p>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.senderId === user.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.senderId === user.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-900'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p
                        className={`text-xs mt-1 ${
                          message.senderId === user.id ? 'text-blue-100' : 'text-gray-500'
                        }`}
                      >
                        {new Date(message.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                ))
              )}
              
              {/* Indicador de escritura */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-200 text-gray-900 px-4 py-2 rounded-lg">
                    <p className="text-sm italic">{targetUser.nombre} está escribiendo...</p>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Formulario de envío */}
            <div className="border-t border-gray-200 p-4">
              <form onSubmit={handleSendMessage} className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={handleTyping}
                  placeholder="Escribe un mensaje..."
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={!isConnected}
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim() || !isConnected}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white p-2 rounded-lg transition-colors duration-200"
                >
                  <FiSend size={20} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
