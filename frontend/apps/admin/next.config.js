/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@lib'],
  experimental: {
    externalDir: true,
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@lib': require('path').resolve(__dirname, '../../lib'),
    };
    return config;
  },
  // Configuração do proxy reverso para a API
  async rewrites() {
    return [
      // Prioritize the local API routes for admin-specific endpoints
      {
        source: '/api/about/:path*',
        destination: '/api/about/:path*', // Use the API route in this Next.js app
      },
      // Also prioritize other admin-specific API endpoints
      {
        source: '/api/auth/:path*',
        destination: '/api/auth/:path*',
      },
      {
        source: '/api/projects/:path*',
        destination: '/api/projects/:path*',
      },
      {
        source: '/api/profile/:path*',
        destination: '/api/profile/:path*',
      },
      // Forward all other API requests to the NestJS backend
      {
        source: '/api/:path*',
        destination: 'http://localhost:3001/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
