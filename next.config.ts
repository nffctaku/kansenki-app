import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    css: {
      optimizeCss: false, // lightningcss を無効化（Vercel対策）
    },
  },
};

export default nextConfig;
