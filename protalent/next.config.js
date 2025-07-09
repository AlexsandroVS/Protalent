/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Permitir imágenes de estos dominios
    domains: [
      'i.pravatar.cc',
      'images.unsplash.com',
      'via.placeholder.com'
    ],
    // Configuración para desarrollo
    ...(process.env.NODE_ENV === 'development' && {
      unoptimized: true
    }),
    // Configuración para producción
    ...(process.env.NODE_ENV === 'production' && {
      formats: ['image/avif', 'image/webp'],
      minimumCacheTTL: 60 * 60 * 24 * 30, // 30 días
    }),
  },
  // Habilitar la compresión GZIP y Brotli
  compress: true,
  // Configuración adicional de webpack si es necesario
  webpack: (config, { isServer }) => {
    return config;
  },
};

module.exports = nextConfig;
