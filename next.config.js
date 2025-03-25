/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'localhost',
      'randomuser.me',
      'images.unsplash.com',
      'player.vimeo.com',
      'ce0rcu23vrrdzqap.public.blob.vercel-storage.com', // Add your Vercel Blob domain here
    ],
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': '.',
    }
    return config
  },
}

module.exports = nextConfig 