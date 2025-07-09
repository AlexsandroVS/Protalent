# Gestión de Usuarios - Panel de Administración

## Descripción
Sistema completo de gestión de usuarios para el panel de administración de ProTalent. Permite a los administradores visualizar, crear, editar y gestionar todos los usuarios de la plataforma de manera segura y eficiente.

## Funcionalidades Implementadas

### 1. Visualización de Usuarios
- **Lista completa** de todos los usuarios (admin, empresa, estudiante, egresado)
- **Información detallada** incluyendo:
  - Datos básicos (nombre, email, rol)
  - Información adicional según el tipo de usuario
  - Fecha de registro
  - Estado de cuenta Google
- **Paginación** con navegación intuitiva
- **Estadísticas en tiempo real** del total de usuarios por rol

### 2. Filtros Avanzados
- **Búsqueda por texto** (nombre o email)
- **Filtros por rol** (todos, estudiante, empresa, admin, egresado)
- **Filtros por fecha** de registro (desde/hasta)
- **Filtro por tipo de cuenta** (con/sin Google)
- **Ordenamiento** configurable por diferentes campos
- **Usuarios por página** configurable (5, 10, 25, 50)

### 3. Gestión de Usuarios Admin
- **Crear nuevos administradores** con validación completa
- **Editar usuarios existentes** (nombre, email, rol, contraseña)
- **Validaciones en tiempo real** del formulario
- **Feedback visual** para errores y éxito

### 4. Gestión General de Usuarios
- **Visualizar información** de empresas y estudiantes
- **Eliminar usuarios** (con confirmación de seguridad)
- **Protección** contra auto-eliminación de admins
- **Restricciones de roles** según permisos

### 5. Sistema de Notificaciones
- **Toast notifications** para feedback inmediato
- **Diálogos de confirmación** para acciones críticas
- **Manejo de errores** centralizado y user-friendly

### 6. Exportación de Datos
- **Exportar a CSV** (compatible con Excel)
- **Exportar a JSON** para análisis avanzado
- **Selección de campos** a incluir en la exportación
- **Filtros aplicados** a la exportación
- **Nombres de archivo** con fecha automática

## Estructura de Archivos

### Frontend
```
src/app/admin/usuarios/
├── page.jsx                    # Página principal de gestión
├── components/
│   ├── UsuarioRow.jsx         # Componente de fila de usuario
│   ├── AdvancedFilters.jsx    # Filtros avanzados
│   └── ExportButton.jsx       # Botón y modal de exportación
└── ...

src/app/admin/components/
├── Toast.jsx                  # Sistema de notificaciones
└── ConfirmDialog.jsx         # Diálogos de confirmación
```

### Backend
```
Backend/src/
├── controllers/
│   └── adminUsuariosController.js  # Controlador de usuarios
├── routes/
│   └── adminUsuarios.js           # Rutas de gestión de usuarios
└── ...
```

## Endpoints de API

### GET `/api/admin/usuarios`
Lista usuarios con filtros y paginación.

**Parámetros:**
- `page` (número): Página actual
- `limit` (número): Usuarios por página
- `rol` (string): Filtrar por rol
- `search` (string): Búsqueda por texto
- `dateFrom`, `dateTo` (date): Filtros por fecha
- `hasGoogle` (string): Filtro por cuenta Google
- `sortBy`, `sortOrder` (string): Ordenamiento

### GET `/api/admin/usuarios/stats`
Obtiene estadísticas de usuarios por rol.

### POST `/api/admin/usuarios/admin`
Crea un nuevo usuario administrador.

**Body:**
```json
{
  "nombre": "string",
  "email": "string", 
  "password": "string"
}
```

### PUT `/api/admin/usuarios/:id`
Actualiza un usuario existente.

**Body:**
```json
{
  "nombre": "string",
  "email": "string",
  "rol": "string",
  "password": "string" // opcional
}
```

### DELETE `/api/admin/usuarios/:id`
Elimina un usuario (con protecciones de seguridad).

### GET `/api/admin/usuarios/export`
Exporta usuarios en formato CSV o JSON.

**Parámetros:**
- Todos los filtros de listado
- `format` (string): 'csv' o 'json'
- `includeFields` (JSON): Campos a incluir

## Seguridad

### Autenticación
- **Token JWT** requerido en todas las operaciones
- **Verificación de rol admin** en cada endpoint
- **Headers personalizados** para mayor seguridad

### Validaciones
- **Validación de email** con regex
- **Longitud mínima** de contraseñas (6 caracteres)
- **Campos requeridos** validados en frontend y backend
- **Sanitización** de datos de entrada

### Protecciones
- **Anti auto-eliminación** de administradores
- **Verificación de duplicados** de email
- **Escapado de CSV** para prevenir inyección
- **Rate limiting** implícito por autenticación

## Experiencia de Usuario

### Interfaz
- **Diseño responsive** adaptable a diferentes pantallas
- **Iconos intuitivos** para diferentes tipos de usuario
- **Códigos de color** consistentes por rol
- **Feedback visual** inmediato para acciones

### Rendimiento
- **Paginación** para manejar grandes cantidades de datos
- **Filtros optimizados** en el servidor
- **Carga asíncrona** sin bloqueo de UI
- **Caché de estadísticas** para mejor performance

### Accesibilidad
- **Navegación por teclado** en formularios
- **Mensajes descriptivos** de error
- **Confirmaciones claras** para acciones destructivas
- **Estados de carga** visibles

## Tecnologías Utilizadas

### Frontend
- **React 18** con hooks modernos
- **CSS-in-JS** para estilos componetizados
- **Axios** para peticiones HTTP
- **State management** con useState/useEffect

### Backend
- **Node.js** con Express
- **Sequelize ORM** para base de datos
- **bcryptjs** para hash de contraseñas
- **JWT** para autenticación
- **CSV generation** nativo

## Configuración y Uso

### Variables de Entorno
```env
JWT_SECRET=tu_secreto_jwt
DB_HOST=localhost
DB_USER=usuario_db
DB_PASS=password_db
DB_NAME=protalent_db
```

### Instalación
1. Instalar dependencias del backend y frontend
2. Configurar variables de entorno
3. Ejecutar migraciones de base de datos
4. Iniciar ambos servidores

### Primer Uso
1. Crear un admin inicial desde la consola
2. Acceder al panel de administración
3. Configurar roles y permisos según necesidad

## Próximas Mejoras

### Funcionalidades Planificadas
- **Importación masiva** de usuarios desde CSV
- **Gestión de permisos** granular
- **Historial de cambios** (audit log)
- **Notificaciones por email** para nuevos admins
- **API rate limiting** configurable

### Optimizaciones
- **Virtual scrolling** para listas muy grandes
- **Caché de lado cliente** para mejor rendimiento
- **Compresión de respuestas** del servidor
- **Lazy loading** de componentes

## Mantenimiento

### Logs
- Todos los errores se registran en consola
- Endpoints sensibles tienen logging detallado
- Información de auditoría en operaciones críticas

### Monitoreo
- Estadísticas en tiempo real en el dashboard
- Métricas de uso por endpoint
- Alertas para operaciones fallidas

### Backup
- Exportación automática de usuarios
- Respaldo de configuraciones
- Versionado de cambios críticos
