/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { appDir: true },
  srcDir: 'src',
  images: {
  domains: ['chatsecretbackend.onrender.com'],
}

};

export default nextConfig;
