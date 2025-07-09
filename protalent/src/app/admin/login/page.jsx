'use client';
import { useState } from 'react';
import { useAdmin } from '../AdminContext';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAdmin();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const result = await login(email, password);

    if (result.success) {
      // Redirigir al dashboard admin
      router.push('/admin');
    } else {
      setError(result.error);
    }

    setIsLoading(false);
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#1f2937', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: '1rem' 
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        padding: '2rem',
        width: '100%',
        maxWidth: '400px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ 
            fontSize: '1.875rem', 
            fontWeight: 'bold', 
            color: '#1f2937', 
            marginBottom: '0.5rem' 
          }}>
            🔐 Admin Login
          </h1>
          <p style={{ color: '#6b7280' }}>Acceso exclusivo para administradores</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '0.875rem', 
              fontWeight: '500', 
              color: '#374151', 
              marginBottom: '0.5rem' 
            }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '0.75rem', 
                border: '1px solid #d1d5db', 
                borderRadius: '6px',
                fontSize: '1rem',
                outline: 'none',
                boxSizing: 'border-box'
              }}
              placeholder="admin@protalent.com"
              required
            />
          </div>

          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '0.875rem', 
              fontWeight: '500', 
              color: '#374151', 
              marginBottom: '0.5rem' 
            }}>
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '0.75rem', 
                border: '1px solid #d1d5db', 
                borderRadius: '6px',
                fontSize: '1rem',
                outline: 'none',
                boxSizing: 'border-box'
              }}
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div style={{ 
              backgroundColor: '#fef2f2', 
              border: '1px solid #fca5a5', 
              color: '#dc2626', 
              padding: '0.75rem', 
              borderRadius: '6px',
              fontSize: '0.875rem'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            style={{ 
              width: '100%', 
              backgroundColor: isLoading ? '#9ca3af' : '#2563eb', 
              color: 'white', 
              fontWeight: '600', 
              padding: '0.75rem', 
              borderRadius: '6px',
              border: 'none',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              fontSize: '1rem'
            }}
          >
            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
            ¿No eres administrador?{' '}
            <a href="/auth/login" style={{ color: '#2563eb', textDecoration: 'none' }}>
              Ir a tu espacio
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
