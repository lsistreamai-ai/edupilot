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
    <main className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl">✈️</span>
            <span className="font-bold text-gray-800">EduPilot</span>
            <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full ml-1">Teacher</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="text-gray-400 hover:text-gray-600">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
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
          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {[
              { label: 'Students', value: '156', icon: '👨‍🎓', color: 'from-blue-500 to-cyan-500' },
              { label: 'Resources', value: '24', icon: '📚', color: 'from-purple-500 to-pink-500' },
              { label: 'Completed', value: '89%', icon: '✅', color: 'from-green-500 to-emerald-500' },
              { label: 'Rating', value: '4.8', icon: '⭐', color: 'from-yellow-500 to-orange-500' },
            ].map((stat, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-xl mb-2`}>
                  {stat.icon}
                </div>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-800 mb-3">Quick Actions</h2>
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: '📝', label: 'Worksheet', desc: 'Create', color: 'from-blue-500 to-blue-600' },
                { icon: '🎯', label: 'Quiz', desc: 'Generate', color: 'from-purple-500 to-purple-600' },
                { icon: '📤', label: 'Upload', desc: 'Resource', color: 'from-green-500 to-green-600' },
              ].map((action, i) => (
                <button key={i} className={`bg-gradient-to-br ${action.color} rounded-2xl p-4 text-white text-center shadow-lg hover:shadow-xl transition transform hover:scale-105`}>
                  <div className="text-3xl mb-1">{action.icon}</div>
                  <div className="font-bold">{action.label}</div>
                  <div className="text-xs text-white/80">{action.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-800 mb-3">Recent Activity</h2>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {[
                { icon: '✅', text: 'Tommy completed "Fractions Quiz"', time: '5 min ago', color: 'bg-green-100' },
                { icon: '📚', text: 'New resource: "Reading P3"', time: '1 hour ago', color: 'bg-blue-100' },
                { icon: '🤖', text: 'AI generated "Past Tense WS"', time: '2 hours ago', color: 'bg-purple-100' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-4 border-b border-gray-50 last:border-0">
                  <div className={`w-10 h-10 rounded-full ${item.color} flex items-center justify-center text-lg`}>
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-800 font-medium truncate">{item.text}</p>
                    <p className="text-xs text-gray-400">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Student Progress */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-bold text-gray-800">Student Progress</h2>
              <button className="text-blue-600 text-sm font-medium">View All →</button>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {[
                { name: 'Emily Wong', progress: 95, subject: 'Math', avatar: '👧' },
                { name: 'Jason Lee', progress: 78, subject: 'English', avatar: '👦' },
                { name: 'Sophie Chan', progress: 65, subject: 'Chinese', avatar: '👧' },
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-3 p-4 border-b border-gray-50 last:border-0">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-lg">
                    {s.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <p className="font-medium text-gray-800">{s.name}</p>
                      <span className="text-xs text-gray-400">{s.subject}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                      <div 
                        className={`h-2 rounded-full ${s.progress >= 80 ? 'bg-green-500' : s.progress >= 50 ? 'bg-blue-500' : 'bg-orange-500'}`}
                        style={{width: `${s.progress}%`}}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'resources' && (
        <div className="max-w-7xl mx-auto px-4 py-6 pb-24">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Resources</h2>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium shadow-lg">
              + Share Resource
            </button>
          </div>

          {/* Subject Tabs */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2 -mx-4 px-4">
            {['All', 'Chinese', 'English', 'Math', 'GS'].map(tag => (
              <button key={tag} className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium ${
                tag === 'All' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-200'
              }`}>
                {tag}
              </button>
            ))}
          </div>

          {/* Resources Grid */}
          <div className="space-y-3">
            {[
              { title: 'Reading Comprehension P3', subject: 'Chinese', type: 'Worksheet', downloads: 45, verified: true },
              { title: 'Past Tense Exercise', subject: 'English', type: 'Worksheet', downloads: 32, verified: true },
              { title: 'Fractions Quiz', subject: 'Math', type: 'Quiz', downloads: 28, verified: false },
              { title: 'HK History Timeline', subject: 'GS', type: 'Presentation', downloads: 19, verified: true },
            ].map((r, i) => (
              <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800">{r.title}</h3>
                    <div className="flex gap-2 mt-1">
                      <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">{r.subject}</span>
                      <span className="text-xs px-2 py-1 bg-blue-100 rounded-full text-blue-600">{r.type}</span>
                    </div>
                  </div>
                  {r.verified && <span className="text-green-500 text-lg">✓</span>}
                </div>
                <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
                  <span className="text-xs text-gray-400">📥 {r.downloads} downloads</span>
                  <button className="text-blue-600 text-sm font-medium">Download →</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'tools' && (
        <div className="max-w-7xl mx-auto px-4 py-6 pb-24">
          <h2 className="text-xl font-bold text-gray-800 mb-4">AI Tools</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: '📝', title: 'Worksheet Generator', desc: 'Create worksheets from any topic', color: 'from-blue-500 to-blue-600' },
              { icon: '🎯', title: 'Quiz Creator', desc: 'Generate TSA-style assessments', color: 'from-purple-500 to-purple-600' },
              { icon: '📖', title: 'Reading Comp', desc: 'Create questions for passages', color: 'from-green-500 to-green-600' },
              { icon: '💡', title: 'Lesson Planner', desc: 'AI-assisted lesson planning', color: 'from-orange-500 to-orange-600' },
              { icon: '📊', title: 'Progress Analyzer', desc: 'Identify learning gaps', color: 'from-pink-500 to-pink-600' },
              { icon: '🎨', title: 'Visual Content', desc: 'Generate diagrams & charts', color: 'from-cyan-500 to-cyan-600' },
            ].map((tool, i) => (
              <button key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition text-left">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center text-2xl mb-3`}>
                  {tool.icon}
                </div>
                <h3 className="font-bold text-gray-800 mb-1">{tool.title}</h3>
                <p className="text-xs text-gray-500">{tool.desc}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="max-w-7xl mx-auto px-4 py-6 pb-24">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Settings</h2>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {[
              { icon: '👤', label: 'Profile Settings' },
              { icon: '🔔', label: 'Notifications' },
              { icon: '🔒', label: 'Privacy' },
              { icon: '❓', label: 'Help & Support' },
            ].map((item, i) => (
              <button key={i} className="w-full flex items-center gap-3 p-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition text-left">
                <span className="text-2xl">{item.icon}</span>
                <span className="font-medium text-gray-800">{item.label}</span>
                <span className="ml-auto text-gray-400">→</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
        <div className="max-w-7xl mx-auto flex justify-around">
          {[
            { id: 'home', icon: '🏠', label: 'Home' },
            { id: 'resources', icon: '📚', label: 'Resources' },
            { id: 'tools', icon: '🤖', label: 'AI Tools' },
            { id: 'settings', icon: '⚙️', label: 'Settings' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center py-2 px-4 rounded-xl transition ${
                activeTab === tab.id ? 'text-purple-600' : 'text-gray-400'
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
