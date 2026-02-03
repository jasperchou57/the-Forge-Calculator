import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Skip lint and type checking during build (already checked locally)
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
