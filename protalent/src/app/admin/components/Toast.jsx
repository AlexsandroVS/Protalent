'use client';
import { useState, useEffect } from 'react';

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info', duration = 5000) => {
    const id = Date.now() + Math.random();
    const toast = { id, message, type, duration };
    
    setToasts(prev => [...prev, toast]);
    
    setTimeout(() => {
      removeToast(id);
    }, duration);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const success = (message, duration) => addToast(message, 'success', duration);
  const error = (message, duration) => addToast(message, 'error', duration);
  const warning = (message, duration) => addToast(message, 'warning', duration);
  const info = (message, duration) => addToast(message, 'info', duration);

  return {
    toasts,
    success,
    error,
    warning,
    info,
    removeToast
  };
}

export function ToastContainer({ toasts, removeToast }) {
  if (!toasts.length) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '1rem',
      right: '1rem',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem'
    }}>
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          toast={toast}
          onRemove={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
}

function Toast({ toast, onRemove }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    return () => setIsVisible(false);
  }, []);

  const getTypeStyles = (type) => {
    const styles = {
      success: {
        backgroundColor: '#10b981',
        borderColor: '#059669',
        icon: '✓'
      },
      error: {
        backgroundColor: '#ef4444',
        borderColor: '#dc2626',
        icon: '✕'
      },
      warning: {
        backgroundColor: '#f59e0b',
        borderColor: '#d97706',
        icon: '⚠'
      },
      info: {
        backgroundColor: '#3b82f6',
        borderColor: '#2563eb',
        icon: 'ℹ'
      }
    };
    return styles[type] || styles.info;
  };

  const typeStyles = getTypeStyles(toast.type);

  return (
    <div style={{
      backgroundColor: typeStyles.backgroundColor,
      color: 'white',
      padding: '0.75rem 1rem',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      minWidth: '300px',
      maxWidth: '400px',
      border: `1px solid ${typeStyles.borderColor}`,
      transform: isVisible ? 'translateX(0)' : 'translateX(100%)',
      transition: 'all 0.3s ease-in-out',
      opacity: isVisible ? 1 : 0
    }}>
      <span style={{ fontSize: '1rem', fontWeight: 'bold' }}>
        {typeStyles.icon}
      </span>
      <span style={{ flex: 1, fontSize: '0.875rem' }}>
        {toast.message}
      </span>
      <button
        onClick={onRemove}
        style={{
          background: 'none',
          border: 'none',
          color: 'white',
          cursor: 'pointer',
          padding: '0.25rem',
          borderRadius: '4px',
          fontSize: '1rem',
          opacity: 0.8
        }}
        onMouseEnter={(e) => e.target.style.opacity = 1}
        onMouseLeave={(e) => e.target.style.opacity = 0.8}
      >
        ×
      </button>
    </div>
  );
}
