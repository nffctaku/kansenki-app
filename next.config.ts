import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // 不要な experimental オプションは削除する
  experimental: {
    disableOptimizedLoading: true,
  },
};

export default nextConfig;
