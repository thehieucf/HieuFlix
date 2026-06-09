import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Bỏ qua lỗi ESLint lúc deploy
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Bỏ qua lỗi TypeScript (như kiểu dữ liệu 'any') lúc deploy
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;