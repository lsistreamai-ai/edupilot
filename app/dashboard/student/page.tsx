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
    <main className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-purple-50 pb-20 md:pb-6">
      {/* Mobile-First Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50 safe-top">
        <div className="px-4 py-3 flex justify-between items-center max-w-lg mx-auto">
          <div className="flex items-center gap-2">
            <span className="text-2xl">✈️</span>
            <span className="font-bold text-gray-800 text-lg">EduPilot</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-yellow-100 px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <span>⭐</span>
              <span className="font-bold text-yellow-700 text-sm">{profile?.points || 0}</span>
            </div>
            <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-gray-600">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {activeTab === 'home' && (
        <div className="px-4 py-5 max-w-lg mx-auto">
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-5 text-white mb-5 shadow-lg">
            <h1 className="text-xl font-bold mb-0.5">Hi, {profile?.name}! 👋</h1>
            <p className="text-blue-100 text-sm mb-4">Ready to learn something amazing today?</p>
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-white/20 rounded-xl px-3 py-2 text-center backdrop-blur-sm">
                <div className="font-bold text-base">{profile?.level || 'Beginner'}</div>
                <div className="text-blue-100 text-xs">Level</div>
              </div>
              <div className="bg-white/20 rounded-xl px-3 py-2 text-center backdrop-blur-sm">
                <div className="font-bold text-base">7🔥</div>
                <div className="text-blue-100 text-xs">Streak</div>
              </div>
              <div className="bg-white/20 rounded-xl px-3 py-2 text-center backdrop-blur-sm">
                <div className="font-bold text-base">#24</div>
                <div className="text-blue-100 text-xs">Rank</div>
              </div>
            </div>
          </div>

          {/* Current Skills - Mobile Stack */}
          <div className="mb-5">
            <h2 className="text-base font-bold text-gray-800 mb-3">Continue Learning</h2>
            <div className="space-y-3">
              {[
                { subject: 'Math', skill: 'Fractions', progress: 75, color: 'from-green-400 to-emerald-500', icon: '📐' },
                { subject: 'English', skill: 'Past Tense', progress: 60, color: 'from-blue-400 to-cyan-500', icon: '📖' },
                { subject: 'Chinese', skill: '閱讀理解', progress: 45, color: 'from-red-400 to-rose-500', icon: '📝' },
                { subject: 'Science', skill: 'Plants', progress: 30, color: 'from-purple-400 to-violet-500', icon: '🌱' },
              ].map((item, i) => (
                <button key={i} className="w-full bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition active:scale-98 text-left flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-2xl flex-shrink-0`}>
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-400 font-medium">{item.subject}</p>
                    <h3 className="font-bold text-gray-800 mb-1.5">{item.skill}</h3>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className={`bg-gradient-to-r ${item.color} h-2 rounded-full`} style={{width: `${item.progress}%`}} />
                    </div>
                  </div>
                  <span className="text-sm text-gray-400 font-medium">{item.progress}%</span>
                </button>
              ))}
            </div>
          </div>

          {/* Awards - Horizontal Scroll */}
          <div className="mb-5">
            <h2 className="text-base font-bold text-gray-800 mb-3">Recent Awards</h2>
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide">
              {['🏆', '⭐', '🎯', '🔥', '💪', '📚', '🎓', '💡'].map((badge, i) => (
                <div key={i} className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center text-3xl shadow-lg snap-center">
                  {badge}
                </div>
              ))}
            </div>
          </div>

          {/* Leaderboard */}
          <div>
            <h2 className="text-base font-bold text-gray-800 mb-3">Leaderboard 🏆</h2>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              {[
                { rank: 1, name: 'Emily Wong', points: 2450, avatar: '👧', bg: 'bg-yellow-50' },
                { rank: 2, name: 'Jason Lee', points: 2320, avatar: '👦', bg: 'bg-gray-50' },
                { rank: 3, name: 'Sophie Chan', points: 2180, avatar: '👧', bg: 'bg-orange-50' },
                { rank: 4, name: 'Tommy Tsang', points: 2050, avatar: '👦', bg: '' },
                { rank: 5, name: 'Chloe Lam', points: 1890, avatar: '👧', bg: '' },
              ].map((s, i) => (
                <div key={i} className={`flex items-center gap-3 p-3.5 border-b border-gray-50 last:border-0 ${s.bg}`}>
                  <div className="w-7 text-center font-bold text-gray-500 text-sm">
                    {s.rank <= 3 ? ['🥇', '🥈', '🥉'][s.rank - 1] : s.rank}
                  </div>
                  <div className="w-9 h-9 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-lg">
                    {s.avatar}
                  </div>
                  <div className="flex-1 font-medium text-gray-800 text-sm">{s.name}</div>
                  <div className="font-bold text-purple-600 text-sm">{s.points} ⭐</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'skills' && (
        <div className="px-4 py-5 max-w-lg mx-auto">
          <h2 className="text-lg font-bold text-gray-800 mb-4">All Skills</h2>
          {['Chinese 中文', 'English 🇬🇧', 'Math 數學', 'General Studies 常識'].map(subject => (
            <div key={subject} className="mb-5">
              <h3 className="font-bold text-gray-600 mb-3 text-sm">{subject}</h3>
              <div className="grid grid-cols-2 gap-2.5">
                {['Topic 1', 'Topic 2', 'Topic 3', 'Topic 4'].map((skill, i) => (
                  <button key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition active:scale-98 text-center">
                    <div className="w-12 h-12 mx-auto mb-2 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center text-2xl">
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

      {/* Bottom Navigation - iOS Safe */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-bottom">
        <div className="flex justify-around max-w-lg mx-auto">
          {[
            { id: 'home', icon: '🏠', label: 'Home' },
            { id: 'skills', icon: '📚', label: 'Skills' },
            { id: 'awards', icon: '🏆', label: 'Awards' },
            { id: 'profile', icon: '👤', label: 'Profile' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center py-2.5 px-5 ${
                activeTab === tab.id ? 'text-blue-600' : 'text-gray-400'
              }`}
            >
              <span className="text-xl mb-0.5">{tab.icon}</span>
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>

      <style jsx global>{`
        .safe-top { padding-top: env(safe-area-inset-top); }
        .safe-bottom { padding-bottom: env(safe-area-inset-bottom); }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .active\\:scale-98:active { transform: scale(0.98); }
      `}</style>
    </main>
  )
}
