'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function TeacherDashboard() {
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
    <main className="min-h-screen bg-gray-50 pb-20 md:pb-6">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50 safe-top">
        <div className="px-4 py-3 flex justify-between items-center max-w-lg mx-auto">
          <div className="flex items-center gap-2">
            <span className="text-2xl">✈️</span>
            <div>
              <span className="font-bold text-gray-800">EduPilot</span>
              <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full ml-1.5">Teacher</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-400 hover:text-gray-600 relative">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-gray-600">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {activeTab === 'home' && (
        <div className="px-4 py-4 max-w-lg mx-auto">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            {[
              { label: 'Students', value: '156', icon: '👨‍🎓', color: 'from-blue-400 to-cyan-500' },
              { label: 'Resources', value: '24', icon: '📚', color: 'from-purple-400 to-pink-500' },
              { label: 'Completed', value: '89%', icon: '✅', color: 'from-green-400 to-emerald-500' },
              { label: 'Rating', value: '4.8', icon: '⭐', color: 'from-yellow-400 to-orange-500' },
            ].map((stat, i) => (
              <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center text-lg mb-2`}>
                  {stat.icon}
                </div>
                <p className="text-xl font-bold text-gray-800">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="mb-5">
            <h2 className="text-base font-bold text-gray-800 mb-3">Quick Actions</h2>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { icon: '📝', label: 'Worksheet', color: 'from-blue-500 to-blue-600' },
                { icon: '🎯', label: 'Quiz', color: 'from-purple-500 to-purple-600' },
                { icon: '📤', label: 'Upload', color: 'from-green-500 to-green-600' },
              ].map((action, i) => (
                <button key={i} className={`bg-gradient-to-br ${action.color} rounded-xl p-3 text-white text-center shadow-md active:scale-95 transition`}>
                  <div className="text-2xl mb-1">{action.icon}</div>
                  <div className="text-xs font-medium">{action.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mb-5">
            <h2 className="text-base font-bold text-gray-800 mb-3">Recent Activity</h2>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              {[
                { icon: '✅', text: 'Tommy completed "Fractions Quiz"', time: '5m', color: 'bg-green-100', iconColor: 'text-green-600' },
                { icon: '📚', text: 'New resource shared', time: '1h', color: 'bg-blue-100', iconColor: 'text-blue-600' },
                { icon: '🤖', text: 'AI generated worksheet', time: '2h', color: 'bg-purple-100', iconColor: 'text-purple-600' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3.5 border-b border-gray-50 last:border-0">
                  <div className={`w-9 h-9 rounded-full ${item.color} flex items-center justify-center ${item.iconColor}`}>
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-800 text-sm font-medium truncate">{item.text}</p>
                    <p className="text-xs text-gray-400">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Student Progress */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-base font-bold text-gray-800">Student Progress</h2>
              <button className="text-blue-600 text-xs font-medium">View All →</button>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              {[
                { name: 'Emily Wong', progress: 95, avatar: '👧' },
                { name: 'Jason Lee', progress: 78, avatar: '👦' },
                { name: 'Sophie Chan', progress: 65, avatar: '👧' },
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-3 p-3.5 border-b border-gray-50 last:border-0">
                  <div className="w-9 h-9 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-base">
                    {s.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 text-sm mb-1">{s.name}</p>
                    <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className={`h-1.5 rounded-full ${s.progress >= 80 ? 'bg-green-500' : s.progress >= 50 ? 'bg-blue-500' : 'bg-orange-500'}`}
                        style={{width: `${s.progress}%`}}
                      />
                    </div>
                  </div>
                  <span className="text-xs font-medium text-gray-500">{s.progress}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'resources' && (
        <div className="px-4 py-4 max-w-lg mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">Resources</h2>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md">
              + Share
            </button>
          </div>

          {/* Tags */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            {['All', 'Chinese', 'English', 'Math', 'GS'].map(tag => (
              <button key={tag} className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-sm font-medium ${
                tag === 'All' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-200'
              }`}>
                {tag}
              </button>
            ))}
          </div>

          {/* Resources */}
          <div className="space-y-2.5">
            {[
              { title: 'Reading Comprehension P3', subject: 'Chinese', type: 'Worksheet', downloads: 45, verified: true },
              { title: 'Past Tense Exercise', subject: 'English', type: 'Worksheet', downloads: 32, verified: true },
              { title: 'Fractions Quiz', subject: 'Math', type: 'Quiz', downloads: 28, verified: false },
            ].map((r, i) => (
              <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-800 text-sm truncate">{r.title}</h3>
                    <div className="flex gap-1.5 mt-1.5">
                      <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full text-gray-600">{r.subject}</span>
                      <span className="text-xs px-2 py-0.5 bg-blue-100 rounded-full text-blue-600">{r.type}</span>
                    </div>
                  </div>
                  {r.verified && <span className="text-green-500 text-lg">✓</span>}
                </div>
                <div className="flex justify-between items-center mt-3 pt-2.5 border-t border-gray-100">
                  <span className="text-xs text-gray-400">📥 {r.downloads}</span>
                  <button className="text-blue-600 text-xs font-medium">Download →</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'tools' && (
        <div className="px-4 py-4 max-w-lg mx-auto">
          <h2 className="text-lg font-bold text-gray-800 mb-4">AI Tools</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: '📝', title: 'Worksheet Generator', desc: 'Create worksheets', color: 'from-blue-500 to-blue-600' },
              { icon: '🎯', title: 'Quiz Creator', desc: 'TSA assessments', color: 'from-purple-500 to-purple-600' },
              { icon: '📖', title: 'Reading Comp', desc: 'Question generator', color: 'from-green-500 to-green-600' },
              { icon: '💡', title: 'Lesson Planner', desc: 'AI-assisted plans', color: 'from-orange-500 to-orange-600' },
              { icon: '📊', title: 'Progress Analyzer', desc: 'Identify gaps', color: 'from-pink-500 to-pink-600' },
              { icon: '🎨', title: 'Visual Content', desc: 'Diagrams & charts', color: 'from-cyan-500 to-cyan-600' },
            ].map((tool, i) => (
              <button key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 active:scale-98 transition text-left">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${tool.color} flex items-center justify-center text-xl mb-2`}>
                  {tool.icon}
                </div>
                <h3 className="font-bold text-gray-800 text-sm mb-0.5">{tool.title}</h3>
                <p className="text-xs text-gray-500">{tool.desc}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="px-4 py-4 max-w-lg mx-auto">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Settings</h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {[
              { icon: '👤', label: 'Profile Settings' },
              { icon: '🔔', label: 'Notifications' },
              { icon: '🔒', label: 'Privacy' },
              { icon: '❓', label: 'Help & Support' },
            ].map((item, i) => (
              <button key={i} className="w-full flex items-center gap-3 p-4 border-b border-gray-50 last:border-0 active:bg-gray-50 transition text-left">
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium text-gray-800 text-sm">{item.label}</span>
                <span className="ml-auto text-gray-400 text-sm">→</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-bottom">
        <div className="flex justify-around max-w-lg mx-auto">
          {[
            { id: 'home', icon: '🏠', label: 'Home' },
            { id: 'resources', icon: '📚', label: 'Resources' },
            { id: 'tools', icon: '🤖', label: 'AI Tools' },
            { id: 'settings', icon: '⚙️', label: 'Settings' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center py-2.5 px-5 ${
                activeTab === tab.id ? 'text-purple-600' : 'text-gray-400'
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
        .active\\:scale-95:active { transform: scale(0.95); }
        .active\\:scale-98:active { transform: scale(0.98); }
      `}</style>
    </main>
  )
}
