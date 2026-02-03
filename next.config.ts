import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Next.js built-in lint runner is deprecated; run ESLint via `npm run lint` instead.
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
