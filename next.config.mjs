/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: "images.pexels.com" },
      { hostname: "fakestoreapi.com" },
    ],
  },
};

export default nextConfig;
