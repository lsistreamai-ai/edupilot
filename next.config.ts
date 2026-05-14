import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: '/', destination: '/index.html' },
      { source: '/student', destination: '/student-dashboard.html' },
      { source: '/student-full', destination: '/student-dashboard-full.html' },
      { source: '/teacher', destination: '/teacher-dashboard.html' },
      { source: '/teacher-full', destination: '/teacher-dashboard-full.html' },
      { source: '/subjects', destination: '/subjects.html' },
      { source: '/practice', destination: '/practice.html' },
      { source: '/leaderboard', destination: '/leaderboard.html' },
      { source: '/progress', destination: '/progress.html' },
      { source: '/class-detail', destination: '/class-detail.html' },
      { source: '/assign-activity', destination: '/assign-activity.html' },
    ];
  },
};

export default nextConfig;
