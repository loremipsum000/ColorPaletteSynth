/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true  // Required for static export (disables Next.js image optimization)
  }
};

module.exports = nextConfig;
