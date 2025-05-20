/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@lib'],
  experimental: {
    externalDir: true,
  },
  // Configuração do proxy reverso para a API
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3001/api/:path*', // A API do NestJS está rodando na porta 3001
      },
    ];
  },
};

module.exports = nextConfig;
