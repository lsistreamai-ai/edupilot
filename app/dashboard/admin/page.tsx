'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AdminDashboard() {
  const [profile, setProfile] = useState<any>(null)
  const [stats, setStats] = useState({ users: 0, resources: 0, subjects: 0 })
  const router = useRouter()

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/')
      return
    }
    
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    setProfile(data)

    // Load stats
    const { count: users } = await supabase.from('profiles').select('*', { count: 'exact', head: true })
    const { count: resources } = await supabase.from('resources').select('*', { count: 'exact', head: true })
    const { count: subjects } = await supabase.from('subjects').select('*', { count: 'exact', head: true })
    
    setStats({ users: users || 0, resources: resources || 0, subjects: subjects || 0 })
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <main className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-800 to-blue-800 text-white p-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-3xl">✈️</span>
            <div>
              <h1 className="text-xl font-bold">EduPilot Admin</h1>
              <p className="text-sm text-purple-200">Management Portal</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-medium">{profile?.name}</p>
              <p className="text-xs text-purple-300">Administrator</p>
            </div>
            <button onClick={handleLogout} className="bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30">
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          {[
            { icon: '👥', label: 'Total Users', value: stats.users, color: 'blue' },
            { icon: '📚', label: 'Resources', value: stats.resources, color: 'green' },
            { icon: '📖', label: 'Subjects', value: stats.subjects, color: 'purple' },
            { icon: '✅', label: 'Verified', value: 0, color: 'yellow' },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-xl shadow p-6">
              <div className="text-4xl mb-3">{stat.icon}</div>
              <p className="text-4xl font-bold text-gray-800">{stat.value}</p>
              <p className="text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Admin Actions</h2>
          <div className="grid grid-cols-4 gap-4">
            <button className="p-4 border rounded-xl hover:bg-gray-50 text-center">
              <div className="text-3xl mb-2">👥</div>
              <p className="font-medium">Manage Users</p>
            </button>
            <button className="p-4 border rounded-xl hover:bg-gray-50 text-center">
              <div className="text-3xl mb-2">✅</div>
              <p className="font-medium">Verify Resources</p>
            </button>
            <button className="p-4 border rounded-xl hover:bg-gray-50 text-center">
              <div className="text-3xl mb-2">📊</div>
              <p className="font-medium">View Analytics</p>
            </button>
            <button className="p-4 border rounded-xl hover:bg-gray-50 text-center">
              <div className="text-3xl mb-2">⚙️</div>
              <p className="font-medium">Settings</p>
            </button>
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Registrations</h2>
          <p className="text-gray-500">New users will appear here after database is populated.</p>
        </div>
      </div>
    </main>
  )
}
