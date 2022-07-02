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
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: '@svgr/webpack',
    })
    return config
  },
  sassOptions: {
    includePaths: [
      path.join(__dirname, 'styles/pages'),
      path.join(__dirname, 'styles/components'),
    ],
  },
}

module.exports = nextConfig
