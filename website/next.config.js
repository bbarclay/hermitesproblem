// next.config.js
// Remove Sentry and bundle analyzer integration if not installed

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // SVG optimization
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
};

module.exports = nextConfig;