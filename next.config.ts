import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for Docker production builds
  output: 'standalone',
  
  // Configure external packages for server components
  serverExternalPackages: ['@prisma/client'],
  
  // Optimize for container environments
  poweredByHeader: false,
  
  // Enable transpilation for better Docker compatibility
  transpilePackages: [],
};

export default nextConfig;
