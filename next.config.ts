import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Serve HTML files for prototyping
  async rewrites() {
    return [
      {
        source: '/',
        destination: '/index.html',
      },
      {
        source: '/student',
        destination: '/student-dashboard.html',
      },
    ];
  },
};

export default nextConfig;
