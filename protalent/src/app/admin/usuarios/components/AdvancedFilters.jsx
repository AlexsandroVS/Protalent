'use client';
import { useState, useEffect } from 'react';

export default function AdvancedFilters({ filters, onFilterChange, stats }) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [tempFilters, setTempFilters] = useState({
    dateFrom: '',
    dateTo: '',
    hasGoogle: 'all',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  useEffect(() => {
    // Sincronizar tempFilters con filters
    setTempFilters(prev => ({
      ...prev,
      ...filters
    }));
  }, [filters]);

  const handleApplyFilters = () => {
    Object.keys(tempFilters).forEach(key => {
      if (tempFilters[key] !== filters[key]) {
        onFilterChange(key, tempFilters[key]);
      }
    });
  };

  const handleResetFilters = () => {
    const resetFilters = {
      dateFrom: '',
      dateTo: '',
      hasGoogle: 'all',
      sortBy: 'createdAt',
      sortOrder: 'desc',
      rol: 'all',
      search: ''
    };
    
    setTempFilters(resetFilters);
    Object.keys(resetFilters).forEach(key => {
      onFilterChange(key, resetFilters[key]);
    });
  };

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      padding: '1.5rem',
      marginBottom: '1.5rem'
    }}>
      {/* Filtros básicos */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '1rem'
      }}>
        {/* Búsqueda */}
        <div>
          <label style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: '500',
            color: '#374151',
            marginBottom: '0.5rem'
          }}>
            Buscar usuarios
          </label>
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
            placeholder="Nombre o email..."
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '0.875rem',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Filtro por rol */}
        <div>
          <label style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: '500',
            color: '#374151',
            marginBottom: '0.5rem'
          }}>
            Filtrar por rol
          </label>
          <select
            value={filters.rol}
            onChange={(e) => onFilterChange('rol', e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '0.875rem',
              boxSizing: 'border-box',
              backgroundColor: 'white'
            }}
          >
            <option value="all">Todos los roles</option>
            <option value="estudiante">Estudiantes ({stats?.estudiantes || 0})</option>
            <option value="empresa">Empresas ({stats?.empresas || 0})</option>
            <option value="admin">Administradores ({stats?.admins || 0})</option>
            <option value="egresado">Egresados ({stats?.egresados || 0})</option>
          </select>
        </div>

        {/* Usuarios por página */}
        <div>
          <label style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: '500',
            color: '#374151',
            marginBottom: '0.5rem'
          }}>
            Usuarios por página
          </label>
          <select
            value={filters.limit}
            onChange={(e) => onFilterChange('limit', e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '0.875rem',
              boxSizing: 'border-box',
              backgroundColor: 'white'
            }}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
          </select>
        </div>
      </div>

      {/* Toggle filtros avanzados */}
      <div style={{ marginBottom: showAdvanced ? '1rem' : '0' }}>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          style={{
            backgroundColor: 'transparent',
            color: '#2563eb',
            border: 'none',
            padding: '0.5rem 0',
            cursor: 'pointer',
            fontSize: '0.875rem',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          {showAdvanced ? '▼' : '▶'} Filtros avanzados
        </button>
      </div>

      {/* Filtros avanzados */}
      {showAdvanced && (
        <div style={{
          backgroundColor: '#f9fafb',
          borderRadius: '6px',
          padding: '1rem',
          marginBottom: '1rem'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginBottom: '1rem'
          }}>
            {/* Fecha desde */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Registrado desde
              </label>
              <input
                type="date"
                value={tempFilters.dateFrom}
                onChange={(e) => setTempFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Fecha hasta */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Registrado hasta
              </label>
              <input
                type="date"
                value={tempFilters.dateTo}
                onChange={(e) => setTempFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Filtro Google */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Cuenta Google
              </label>
              <select
                value={tempFilters.hasGoogle}
                onChange={(e) => setTempFilters(prev => ({ ...prev, hasGoogle: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  boxSizing: 'border-box',
                  backgroundColor: 'white'
                }}
              >
                <option value="all">Todos</option>
                <option value="yes">Con Google</option>
                <option value="no">Sin Google</option>
              </select>
            </div>

            {/* Ordenar por */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Ordenar por
              </label>
              <select
                value={tempFilters.sortBy}
                onChange={(e) => setTempFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  boxSizing: 'border-box',
                  backgroundColor: 'white'
                }}
              >
                <option value="createdAt">Fecha de registro</option>
                <option value="nombre">Nombre</option>
                <option value="email">Email</option>
                <option value="rol">Rol</option>
              </select>
            </div>

            {/* Orden */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Orden
              </label>
              <select
                value={tempFilters.sortOrder}
                onChange={(e) => setTempFilters(prev => ({ ...prev, sortOrder: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  boxSizing: 'border-box',
                  backgroundColor: 'white'
                }}
              >
                <option value="desc">Descendente</option>
                <option value="asc">Ascendente</option>
              </select>
            </div>
          </div>

          {/* Botones de acción */}
          <div style={{
            display: 'flex',
            gap: '0.75rem',
            justifyContent: 'flex-end'
          }}>
            <button
              onClick={handleResetFilters}
              style={{
                backgroundColor: 'white',
                color: '#6b7280',
                border: '1px solid #d1d5db',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.875rem'
              }}
            >
              Limpiar filtros
            </button>
            <button
              onClick={handleApplyFilters}
              style={{
                backgroundColor: '#2563eb',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.875rem'
              }}
            >
              Aplicar filtros
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
