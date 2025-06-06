/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000'],
    },
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config) => {
    config.externals = [
      ...(config.externals || []),
      { bufferutil: 'bufferutil', 'utf-8-validate': 'utf-8-validate' }
    ];
  
    config.snapshot = {
      ...config.snapshot,
      managedPaths: [],
    };
  
    return config;
  },  
  serverExternalPackages: ['@prisma/client', 'bcrypt'],
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
}

module.exports = nextConfig 