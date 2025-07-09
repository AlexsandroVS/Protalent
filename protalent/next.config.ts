/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  images: {
    domains: ['images.unsplash.com', 'source.unsplash.com'],
  },
  experimental: {
    serverActions: true,
  },
  // Configure allowed development origins to resolve CORS warnings
  allowedDevOrigins: ['172.20.10.3'],
};

module.exports = nextConfig;
