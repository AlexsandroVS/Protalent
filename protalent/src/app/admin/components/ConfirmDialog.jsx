'use client';
import { useState } from 'react';

export function useConfirmDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState({});

  const confirm = ({ title, message, confirmText = 'Confirmar', cancelText = 'Cancelar', type = 'warning' }) => {
    return new Promise((resolve) => {
      setConfig({
        title,
        message,
        confirmText,
        cancelText,
        type,
        onConfirm: () => {
          setIsOpen(false);
          resolve(true);
        },
        onCancel: () => {
          setIsOpen(false);
          resolve(false);
        }
      });
      setIsOpen(true);
    });
  };

  const ConfirmDialog = () => {
    if (!isOpen) return null;

    return <ConfirmDialogComponent {...config} />;
  };

  return { confirm, ConfirmDialog };
}

function ConfirmDialogComponent({ 
  title, 
  message, 
  confirmText, 
  cancelText, 
  type, 
  onConfirm, 
  onCancel 
}) {
  const getTypeStyles = (type) => {
    const styles = {
      danger: {
        color: '#dc2626',
        backgroundColor: '#fef2f2',
        confirmBg: '#dc2626',
        icon: '⚠️'
      },
      warning: {
        color: '#d97706',
        backgroundColor: '#fffbeb',
        confirmBg: '#d97706',
        icon: '⚠️'
      },
      info: {
        color: '#2563eb',
        backgroundColor: '#eff6ff',
        confirmBg: '#2563eb',
        icon: 'ℹ️'
      }
    };
    return styles[type] || styles.warning;
  };

  const typeStyles = getTypeStyles(type);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      animation: 'fadeIn 0.2s ease-out'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '2rem',
        width: '100%',
        maxWidth: '400px',
        margin: '1rem',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        transform: 'scale(1)',
        animation: 'slideIn 0.2s ease-out'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '1rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{
            backgroundColor: typeStyles.backgroundColor,
            borderRadius: '50%',
            width: '3rem',
            height: '3rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.25rem',
            flexShrink: 0
          }}>
            {typeStyles.icon}
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{
              margin: 0,
              fontSize: '1.125rem',
              fontWeight: '600',
              color: '#111827',
              marginBottom: '0.5rem'
            }}>
              {title}
            </h3>
            <p style={{
              margin: 0,
              fontSize: '0.875rem',
              color: '#6b7280',
              lineHeight: '1.5'
            }}>
              {message}
            </p>
          </div>
        </div>

        <div style={{
          display: 'flex',
          gap: '0.75rem',
          justifyContent: 'flex-end'
        }}>
          <button
            onClick={onCancel}
            style={{
              backgroundColor: 'white',
              color: '#374151',
              border: '1px solid #d1d5db',
              padding: '0.625rem 1.25rem',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#f9fafb';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'white';
            }}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            style={{
              backgroundColor: typeStyles.confirmBg,
              color: 'white',
              border: 'none',
              padding: '0.625rem 1.25rem',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.opacity = '0.9';
            }}
            onMouseLeave={(e) => {
              e.target.style.opacity = '1';
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideIn {
          from { 
            opacity: 0;
            transform: scale(0.95) translateY(-10px);
          }
          to { 
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
