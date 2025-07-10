'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/auth/AuthContext';
import { useChatNotifications } from '../context/chat/ChatContext';
import { FiMessageCircle, FiX, FiSend } from 'react-icons/fi';

const ChatNotification = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { socket, addUnreadMessage, markAsRead } = useChatNotifications();
  const [chatNotifications, setChatNotifications] = useState([]);
  const [activeChatModal, setActiveChatModal] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  // Escuchar mensajes entrantes
  useEffect(() => {
    if (!socket || !user) return;

    const handleReceiveMessage = (messageData) => {
      const currentPath = window.location.pathname;
      const currentParams = new URLSearchParams(window.location.search);
      const isInSpecificChat = currentPath === '/chat' && 
                              currentParams.get('userId') === messageData.senderId.toString();
      
      // Solo mostrar notificación si no estás en el chat específico con esa persona
      if (!isInSpecificChat) {
        console.log('Mensaje recibido fuera del chat específico:', messageData);
        
        // Agregar a mensajes no leídos
        addUnreadMessage(messageData.senderId, messageData);
        
        // Agregar/actualizar notificación
        setChatNotifications(prev => {
          const exists = prev.find(n => n.senderId === messageData.senderId);
          if (exists) {
            return prev.map(n => 
              n.senderId === messageData.senderId 
                ? { ...n, lastMessage: messageData.content, timestamp: messageData.timestamp, count: n.count + 1 }
                : n
            );
          }
          return [...prev, {
            senderId: messageData.senderId,
            senderName: messageData.senderName,
            lastMessage: messageData.content,
            timestamp: messageData.timestamp,
            count: 1
          }];
        });

        // Mostrar modal de chat automáticamente solo si no hay otro modal activo
        if (!activeChatModal) {
          setActiveChatModal({
            userId: messageData.senderId,
            userName: messageData.senderName
          });
          setMessages([messageData]);
        }
      }
    };

    const handleChatNotification = (messageData) => {
      const currentPath = window.location.pathname;
      const currentParams = new URLSearchParams(window.location.search);
      const isInSpecificChat = currentPath === '/chat' && 
                              currentParams.get('userId') === messageData.senderId.toString();
      
      // Solo mostrar notificación si no estás en el chat específico con esa persona
      if (!isInSpecificChat) {
        console.log('Notificación de chat recibida:', messageData);
        
        // Agregar a mensajes no leídos
        addUnreadMessage(messageData.senderId, messageData);
        
        // Agregar/actualizar notificación
        setChatNotifications(prev => {
          const exists = prev.find(n => n.senderId === messageData.senderId);
          if (exists) {
            return prev.map(n => 
              n.senderId === messageData.senderId 
                ? { ...n, lastMessage: messageData.content, timestamp: messageData.timestamp, count: n.count + 1 }
                : n
            );
          }
          return [...prev, {
            senderId: messageData.senderId,
            senderName: messageData.senderName,
            lastMessage: messageData.content,
            timestamp: messageData.timestamp,
            count: 1
          }];
        });
      }
    };

    socket.on('receive-message', handleReceiveMessage);
    socket.on('chat-notification', handleChatNotification);

    return () => {
      socket.off('receive-message', handleReceiveMessage);
      socket.off('chat-notification', handleChatNotification);
    };
  }, [socket, user, addUnreadMessage, activeChatModal]);

  // Función para abrir chat completo
  const openFullChat = (userId, userName) => {
    setActiveChatModal(null);
    setMessages([]);
    setChatNotifications(prev => prev.filter(n => n.senderId !== userId));
    markAsRead(userId);
    router.push(`/chat?userId=${userId}&userName=${encodeURIComponent(userName)}`);
  };

  // Función para responder rápido
  const sendQuickReply = (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !socket || !activeChatModal) return;

    const messageData = {
      id: Date.now(),
      content: newMessage.trim(),
      senderId: user.id,
      senderName: user.nombre,
      targetId: activeChatModal.userId,
      timestamp: new Date().toISOString()
    };

    // Enviar mensaje via socket
    socket.emit('send-message', messageData);
    
    // Agregar mensaje a la lista local
    setMessages(prev => [...prev, messageData]);
    
    // Limpiar input
    setNewMessage('');
  };

  // Función para cerrar modal de chat
  const closeChatModal = () => {
    setActiveChatModal(null);
    setMessages([]);
    setNewMessage('');
  };

  // Función para descartar notificación
  const dismissNotification = (senderId) => {
    setChatNotifications(prev => prev.filter(n => n.senderId !== senderId));
    markAsRead(senderId);
  };

  if (!user) return null;

  return (
    <>
      {/* Notificaciones flotantes */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {chatNotifications.map((notification) => (
          <div
            key={notification.senderId}
            className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm cursor-pointer hover:shadow-xl transition-shadow duration-200"
            onClick={() => openFullChat(notification.senderId, notification.senderName)}
          >
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center relative">
                <FiMessageCircle className="text-blue-600" size={20} />
                {notification.count > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {notification.count > 9 ? '9+' : notification.count}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  {notification.senderName}
                </p>
                <p className="text-sm text-gray-600 truncate">
                  {notification.lastMessage}
                </p>
                <p className="text-xs text-gray-400">
                  {new Date(notification.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  dismissNotification(notification.senderId);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiX size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de chat rápido */}
      {activeChatModal && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className="bg-white border border-gray-200 rounded-lg shadow-xl w-80 h-96 flex flex-col">
            {/* Header del modal */}
            <div className="bg-blue-600 text-white p-3 rounded-t-lg flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <FiMessageCircle className="text-blue-600" size={16} />
                </div>
                <span className="font-medium">{activeChatModal.userName}</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => openFullChat(activeChatModal.userId, activeChatModal.userName)}
                  className="text-blue-100 hover:text-white text-sm"
                >
                  Expandir
                </button>
                <button
                  onClick={closeChatModal}
                  className="text-blue-100 hover:text-white"
                >
                  <FiX size={18} />
                </button>
              </div>
            </div>

            {/* Mensajes */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.senderId === user.id ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                      message.senderId === user.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-900'
                    }`}
                  >
                    <p>{message.content}</p>
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
              ))}
            </div>

            {/* Input de respuesta */}
            <div className="border-t border-gray-200 p-3">
              <form onSubmit={sendQuickReply} className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Responder..."
                  className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white p-2 rounded-md transition-colors duration-200"
                >
                  <FiSend size={16} />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatNotification;
