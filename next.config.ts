import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for Docker production builds
  output: 'standalone',
  
  // Configure for Docker networking
  experimental: {
    // Enable server-side runtime config
    serverComponentsExternalPackages: ['@prisma/client'],
  },
  
  // Optimize for container environments
  poweredByHeader: false,
  
  // Enable experimental features for better Docker compatibility
  transpilePackages: [],
};

export default nextConfig;
