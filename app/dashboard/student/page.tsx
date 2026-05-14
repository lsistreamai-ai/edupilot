'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function StudentDashboard() {
  const [profile, setProfile] = useState<any>(null)
  const [activeTab, setActiveTab] = useState('home')
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
    <main className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-purple-50">
      {/* Mobile Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl">✈️</span>
            <span className="font-bold text-gray-800">EduPilot</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-yellow-100 px-3 py-1 rounded-full flex items-center gap-1">
              <span>⭐</span>
              <span className="font-bold text-yellow-700">{profile?.points || 0}</span>
            </div>
            <button onClick={handleLogout} className="text-gray-400 hover:text-gray-600">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {activeTab === 'home' && (
        <div className="max-w-7xl mx-auto px-4 py-6 pb-24">
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-6 text-white mb-6">
            <h1 className="text-2xl font-bold mb-1">Hi, {profile?.name}! 👋</h1>
            <p className="text-blue-100">Ready to learn something amazing today?</p>
            <div className="mt-4 flex gap-4 text-sm">
              <div className="bg-white/20 rounded-xl px-4 py-2">
                <div className="font-bold text-lg">{profile?.level || 'Beginner'}</div>
                <div className="text-blue-100">Level</div>
              </div>
              <div className="bg-white/20 rounded-xl px-4 py-2">
                <div className="font-bold text-lg">7🔥</div>
                <div className="text-blue-100">Day Streak</div>
              </div>
              <div className="bg-white/20 rounded-xl px-4 py-2">
                <div className="font-bold text-lg">#24</div>
                <div className="text-blue-100">Rank</div>
              </div>
            </div>
          </div>

          {/* Current Skills */}
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-800 mb-3">Continue Learning</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { subject: 'Math', skill: 'Fractions', progress: 75, color: 'from-green-500 to-emerald-600', icon: '📐' },
                { subject: 'English', skill: 'Past Tense', progress: 60, color: 'from-blue-500 to-cyan-600', icon: '📖' },
                { subject: 'Chinese', skill: '閱讀理解', progress: 45, color: 'from-red-500 to-rose-600', icon: '📝' },
                { subject: 'Science', skill: 'Plants', progress: 30, color: 'from-purple-500 to-violet-600', icon: '🌱' },
              ].map((item, i) => (
                <button key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition text-left">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-2xl mb-3`}>
                    {item.icon}
                  </div>
                  <p className="text-xs text-gray-400 font-medium">{item.subject}</p>
                  <h3 className="font-bold text-gray-800 mb-2">{item.skill}</h3>
                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div className={`bg-gradient-to-r ${item.color} h-2 rounded-full transition-all`} style={{width: `${item.progress}%`}} />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{item.progress}% complete</p>
                </button>
              ))}
            </div>
          </div>

          {/* Awards */}
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-800 mb-3">Recent Awards</h2>
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
              {['🏆', '⭐', '🎯', '🔥', '💪', '📚'].map((badge, i) => (
                <div key={i} className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center text-3xl shadow-lg">
                  {badge}
                </div>
              ))}
            </div>
          </div>

          {/* Leaderboard */}
          <div>
            <h2 className="text-lg font-bold text-gray-800 mb-3">Leaderboard 🏆</h2>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {[
                { rank: 1, name: 'Emily Wong', points: 2450, avatar: '👧', bg: 'bg-yellow-50' },
                { rank: 2, name: 'Jason Lee', points: 2320, avatar: '👦', bg: 'bg-gray-50' },
                { rank: 3, name: 'Sophie Chan', points: 2180, avatar: '👧', bg: 'bg-orange-50' },
                { rank: 4, name: 'Tommy Tsang', points: 2050, avatar: '👦', bg: '' },
                { rank: 5, name: 'Chloe Lam', points: 1890, avatar: '👧', bg: '' },
              ].map((s, i) => (
                <div key={i} className={`flex items-center gap-3 p-4 border-b border-gray-50 last:border-0 ${s.bg}`}>
                  <div className="w-8 text-center font-bold text-gray-500">
                    {s.rank <= 3 ? ['🥇', '🥈', '🥉'][s.rank - 1] : s.rank}
                  </div>
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-xl">
                    {s.avatar}
                  </div>
                  <div className="flex-1 font-medium text-gray-800">{s.name}</div>
                  <div className="font-bold text-purple-600">{s.points} ⭐</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'skills' && (
        <div className="max-w-7xl mx-auto px-4 py-6 pb-24">
          <h2 className="text-xl font-bold text-gray-800 mb-4">All Skills</h2>
          {['Chinese', 'English', 'Math', 'General Studies'].map(subject => (
            <div key={subject} className="mb-6">
              <h3 className="font-bold text-gray-600 mb-3">{subject}</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {['Skill 1', 'Skill 2', 'Skill 3', 'Skill 4'].map((skill, i) => (
                  <button key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition text-center">
                    <div className="w-16 h-16 mx-auto mb-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-3xl">
                      📚
                    </div>
                    <p className="font-medium text-gray-800 text-sm">{skill}</p>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
        <div className="max-w-7xl mx-auto flex justify-around">
          {[
            { id: 'home', icon: '🏠', label: 'Home' },
            { id: 'skills', icon: '📚', label: 'Skills' },
            { id: 'awards', icon: '🏆', label: 'Awards' },
            { id: 'profile', icon: '👤', label: 'Profile' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center py-2 px-4 rounded-xl transition ${
                activeTab === tab.id ? 'text-blue-600' : 'text-gray-400'
              }`}
            >
              <span className="text-2xl">{tab.icon}</span>
              <span className="text-xs mt-1 font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </main>
  )
}
