import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'static.vecteezy.com',
      },
      {
        protocol: 'https',
        hostname: 'tse1.mm.bing.net',
      },
      {
        protocol: 'https',
        hostname: 'd31xsmoz1lk3y3.cloudfront.net',
      },
      {
        protocol: 'https',
        hostname: 'static1.topspeedimages.com',
      },
      // Add your Supabase storage domain if you use Supabase Storage
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
  },
}

export default nextConfig
