/** @type {import('next').NextConfig} */
const path = require('path')
const nextConfig = {
  swcMinify: true,
  images: {
    domains: [
      'source.unsplash.com',
      'lh3.googleusercontent.com',
      'platform-lookaside.fbsbx.com',
      'th.bing.com',
      'picsum.photos',
      'images.pexels.com',
    ],
  },
  reactStrictMode: true,
  sassOptions: {
    includePaths: [
      path.join(__dirname, 'styles/pages'),
      path.join(__dirname, 'styles/components'),
    ],
  },
}

module.exports = nextConfig
