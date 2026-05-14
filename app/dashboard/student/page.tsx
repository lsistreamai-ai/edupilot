'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function StudentDashboard() {
  const [profile, setProfile] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    loadProfile()
  }, [])

  async function loadProfile() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/')
      return
    }
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    setProfile(data)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-lg border-b border-white/20 text-white p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-3xl">✈️</span>
            <h1 className="text-xl font-bold">EduPilot</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-white/20 px-4 py-2 rounded-full flex items-center gap-2">
              <span className="text-xl">⭐</span>
              <span className="font-bold">{profile?.points || 0}</span>
            </div>
            <button onClick={handleLogout} className="text-white/80 hover:text-white">Logout</button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6">
        {/* Welcome Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl">
              👤
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Welcome, {profile?.name}!</h2>
              <p className="text-gray-500">{profile?.grade} • Level: {profile?.level || 'Beginner'}</p>
            </div>
          </div>
        </div>

        {/* Points & Level */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="text-4xl mb-2">⭐</div>
            <p className="text-3xl font-bold text-purple-600">{profile?.points || 0}</p>
            <p className="text-gray-500">Total Points</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="text-4xl mb-2">🔥</div>
            <p className="text-3xl font-bold text-orange-500">7</p>
            <p className="text-gray-500">Day Streak</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="text-4xl mb-2">🏆</div>
            <p className="text-3xl font-bold text-yellow-500">#24</p>
            <p className="text-gray-500">Leaderboard</p>
          </div>
        </div>

        {/* Assignments */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
          <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <h3 className="text-lg font-bold">📝 My Assignments</h3>
          </div>
          <div className="p-4 space-y-3">
            {[
              { subject: 'Chinese', title: 'Reading Comprehension P3', progress: 80, color: 'red' },
              { subject: 'English', title: 'Past Tense Exercise', progress: 100, color: 'green' },
              { subject: 'Math', title: 'Fractions Quiz', progress: 0, color: 'blue' },
            ].map((a, i) => (
              <div key={i} className="border rounded-xl p-4 hover:shadow-md transition cursor-pointer">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="text-xs px-2 py-1 bg-gray-100 rounded">{a.subject}</span>
                    <h4 className="font-medium text-gray-800 mt-1">{a.title}</h4>
                  </div>
                  {a.progress === 100 ? (
                    <span className="text-green-500">✅ Done</span>
                  ) : (
                    <span className="text-blue-500">{a.progress}%</span>
                  )}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className={`bg-${a.color}-500 h-2 rounded-full`} style={{width: `${a.progress}%`}} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Leaderboard */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
            <h3 className="text-lg font-bold">🏆 Leaderboard</h3>
          </div>
          <div className="p-4">
            {[
              { rank: 1, name: 'Emily Wong', points: 2450, avatar: '👧' },
              { rank: 2, name: 'Jason Lee', points: 2320, avatar: '👦' },
              { rank: 3, name: 'Sophie Chan', points: 2180, avatar: '👧' },
              { rank: 4, name: 'Tommy Tsang', points: 2050, avatar: '👦' },
              { rank: 5, name: 'Chloe Lam', points: 1890, avatar: '👧' },
            ].map((s, i) => (
              <div key={i} className={`flex items-center gap-4 p-3 ${i < 3 ? 'bg-yellow-50' : ''} rounded-lg mb-2`}>
                <div className="w-8 h-8 flex items-center justify-center font-bold text-gray-600">
                  {s.rank <= 3 ? ['🥇', '🥈', '🥉'][s.rank - 1] : s.rank}
                </div>
                <div className="text-2xl">{s.avatar}</div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{s.name}</p>
                </div>
                <div className="text-purple-600 font-bold">{s.points} ⭐</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
