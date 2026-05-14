import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/student',
        destination: '/student-dashboard.html',
      },
      {
        source: '/teacher',
        destination: '/teacher-dashboard.html',
      },
    ];
  },
};

export default nextConfig;
