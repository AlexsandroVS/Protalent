'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAuth } from '../auth/AuthContext';
import io from 'socket.io-client';

const ChatContext = createContext();

export const useChatNotifications = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatNotifications must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [unreadMessages, setUnreadMessages] = useState(new Map());
  const [recentChats, setRecentChats] = useState(new Map()); // Conversaciones recientes
  const [isConnected, setIsConnected] = useState(false);

  // Configurar Socket.IO
  useEffect(() => {
    if (!user) return;

    const newSocket = io('http://localhost:5000', {
      auth: {
        token: localStorage.getItem('token')
      }
    });

    newSocket.on('connect', () => {
      console.log('Socket conectado para notificaciones');
      setIsConnected(true);
      // En el cliente, no necesitamos llamar join explícitamente
      // El servidor ya maneja esto automáticamente
    });

    newSocket.on('disconnect', () => {
      console.log('Socket desconectado');
      setIsConnected(false);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  // Marcar mensajes como leídos
  const markAsRead = useCallback((userId) => {
    setUnreadMessages(prev => {
      const newMap = new Map(prev);
      newMap.delete(userId.toString());
      return newMap;
    });
  }, []);

  // Agregar conversación a chats recientes
  const addToRecentChats = useCallback((userId, userName, lastMessage, timestamp) => {
    setRecentChats(prev => {
      const newMap = new Map(prev);
      const key = userId.toString();
      
      newMap.set(key, {
        userId: userId,
        userName: userName,
        lastMessage: lastMessage,
        timestamp: timestamp
      });
      
      return newMap;
    });
  }, []);

  // Agregar mensaje no leído
  const addUnreadMessage = useCallback((senderId, message) => {
    setUnreadMessages(prev => {
      const newMap = new Map(prev);
      const key = senderId.toString();
      const existing = newMap.get(key) || { count: 0, lastMessage: '', senderName: '' };
      
      newMap.set(key, {
        count: existing.count + 1,
        lastMessage: message.content,
        senderName: message.senderName,
        timestamp: message.timestamp
      });
      
      return newMap;
    });

    // También agregar/actualizar en conversaciones recientes
    addToRecentChats(senderId, message.senderName, message.content, message.timestamp);
  }, [addToRecentChats]);

  // Obtener lista de conversaciones recientes ordenadas por timestamp
  const getRecentChats = useCallback(() => {
    const chatsArray = Array.from(recentChats.values());
    return chatsArray.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }, [recentChats]);

  // Obtener total de mensajes no leídos
  const getTotalUnreadCount = useCallback(() => {
    let total = 0;
    unreadMessages.forEach(value => {
      total += value.count;
    });
    return total;
  }, [unreadMessages]);

  const value = {
    socket,
    isConnected,
    unreadMessages,
    recentChats,
    markAsRead,
    addUnreadMessage,
    addToRecentChats,
    getRecentChats,
    getTotalUnreadCount
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContext;
