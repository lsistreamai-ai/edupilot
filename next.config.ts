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
      { source: '/subjects-all', destination: '/subjects-all.html' },
      { source: '/practice', destination: '/practice.html' },
      { source: '/practice-full', destination: '/practice-full.html' },
      { source: '/leaderboard', destination: '/leaderboard-full.html' },
      { source: '/progress', destination: '/progress.html' },
      { source: '/class-detail', destination: '/class-detail.html' },
      { source: '/assign-activity', destination: '/assign-activity.html' },
      { source: '/admin', destination: '/admin-mobile.html' },
      { source: '/create-class', destination: '/create-class.html' },
      { source: '/join-class', destination: '/join-class.html' },
      { source: '/edit-profile', destination: '/edit-profile.html' },
    ];
  },
};

export default nextConfig;
