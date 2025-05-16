import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    disableOptimizedLoading: true,
  },
};

export default nextConfig;

