/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@lib'],
  experimental: {
    externalDir: true,
  },
  // Configuração do proxy reverso para a API
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
    return [
      {
        source: '/api/:path*',
        destination: `${apiUrl}/:path*`, // Use environment variable
      },
    ];
  },
};

module.exports = nextConfig;
