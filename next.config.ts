import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "image.tmdb.org",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "vsmov.com",
        pathname: "/**",
      },
    ],
  },
  // Cho phép ngrok và các tunnel truy cập dev server
  // Key đúng trong Next.js 15/16 là allowedDevOrigins
  allowedDevOrigins: [
    "*.ngrok-free.app",
    "*.ngrok.io",
    "*.ngrok.app",
    "*.loca.lt",
    "*.tunnel.dev",
  ],
};

export default nextConfig;
