/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'picsum.photos' },
    ],
  },
  outputFileTracingIncludes: {
    '/api/**/*': ['./prisma/dev.db'],
    '/swipe': ['./prisma/dev.db'],
    '/matches': ['./prisma/dev.db'],
    '/chat/**/*': ['./prisma/dev.db'],
    '/profile': ['./prisma/dev.db'],
    '/properties/**/*': ['./prisma/dev.db'],
  },
}

module.exports = nextConfig
