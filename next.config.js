/** @type {import('next').NextConfig} */
const path = require('path')
const nextConfig = {
  async headers() {
    return [
      {
        // matching all API routes
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value:
              'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
          },
        ],
      },
    ]
  },
  swcMinify: false,
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
