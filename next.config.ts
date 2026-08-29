import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  turbopack: { root: process.cwd() },
  poweredByHeader: false,
  experimental: {
    optimizePackageImports: ["gsap"],
  },
};

export default nextConfig;
