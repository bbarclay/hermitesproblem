/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static JSON imports
  webpack(config) {
    return config;
  },
  // Explicitly disable Turbopack
  experimental: {
    turbo: false,
    serverActions: true
  }
};

module.exports = nextConfig; 