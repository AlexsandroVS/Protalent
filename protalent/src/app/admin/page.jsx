export default function AdminPage() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: '#f3f4f6',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        textAlign: 'center',
        padding: '2rem',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontWeight: 'bold', 
          color: '#1f2937',
          marginBottom: '1rem'
        }}>
          🎉 ¡Bienvenido al Panel de Admin!
        </h1>
        <p style={{ 
          fontSize: '1.2rem', 
          color: '#6b7280',
          marginBottom: '2rem'
        }}>
          Has accedido exitosamente al área de administración
        </p>
        <div style={{
          padding: '1rem',
          backgroundColor: '#dcfce7',
          border: '1px solid #16a34a',
          borderRadius: '6px',
          color: '#15803d'
        }}>
          ✅ Sistema funcionando correctamente
        </div>
      </div>
    </div>
  );
} 