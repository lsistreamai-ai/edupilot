'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function TeacherDashboard() {
  const [profile, setProfile] = useState<any>(null)
  const [subjects, setSubjects] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState('home')
  const router = useRouter()

  useEffect(() => {
    loadProfile()
    loadSubjects()
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

  async function loadSubjects() {
    const { data } = await supabase.from('subjects').select('*').order('level').order('name')
    setSubjects(data || [])
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-3xl">✈️</span>
            <div>
              <h1 className="text-xl font-bold">EduPilot</h1>
              <p className="text-sm text-purple-100">Teacher Portal</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-medium">{profile?.name}</p>
              <p className="text-xs text-purple-200">{profile?.email}</p>
            </div>
            <button onClick={handleLogout} className="bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30">
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        <div className="flex gap-6">
          {/* Sidebar */}
          <aside className="w-64 bg-white rounded-xl shadow p-4 h-fit sticky top-6">
            <nav className="space-y-2">
              {[
                { id: 'home', icon: '🏠', label: 'Home' },
                { id: 'resources', icon: '📚', label: 'Resources' },
                { id: 'content', icon: '📝', label: 'My Content' },
                { id: 'students', icon: '👨‍🎓', label: 'Students' },
                { id: 'tools', icon: '🤖', label: 'AI Tools' },
                { id: 'settings', icon: '⚙️', label: 'Settings' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition ${
                    activeTab === tab.id 
                      ? 'bg-purple-100 text-purple-700 font-medium' 
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <span className="text-xl">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {activeTab === 'home' && (
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-4 gap-4">
                  {[
                    { icon: '📚', label: 'Resources', value: '24', color: 'blue' },
                    { icon: '👨‍🎓', label: 'Students', value: '156', color: 'green' },
                    { icon: '✅', label: 'Completed', value: '89%', color: 'purple' },
                    { icon: '⭐', label: 'Rating', value: '4.8', color: 'yellow' },
                  ].map(stat => (
                    <div key={stat.label} className="bg-white rounded-xl shadow p-6">
                      <div className="text-3xl mb-2">{stat.icon}</div>
                      <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                      <p className="text-gray-500 text-sm">{stat.label}</p>
                    </div>
                  ))}
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-xl shadow p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
                  <div className="grid grid-cols-3 gap-4">
                    <button className="p-4 border-2 border-dashed border-purple-300 rounded-xl hover:bg-purple-50 text-center">
                      <div className="text-3xl mb-2">📝</div>
                      <p className="font-medium">Create Worksheet</p>
                    </button>
                    <button className="p-4 border-2 border-dashed border-blue-300 rounded-xl hover:bg-blue-50 text-center">
                      <div className="text-3xl mb-2">🎯</div>
                      <p className="font-medium">Create Quiz</p>
                    </button>
                    <button className="p-4 border-2 border-dashed border-green-300 rounded-xl hover:bg-green-50 text-center">
                      <div className="text-3xl mb-2">📤</div>
                      <p className="font-medium">Upload Resource</p>
                    </button>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-xl shadow p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
                  <div className="space-y-3">
                    {[
                      { text: 'Student Tommy completed "Fractions Quiz"', time: '5 min ago', icon: '✅' },
                      { text: 'New resource shared: "Reading Comprehension P3"', time: '1 hour ago', icon: '📚' },
                      { text: 'AI generated worksheet for "Past Tense"', time: '2 hours ago', icon: '🤖' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <span className="text-2xl">{item.icon}</span>
                        <div className="flex-1">
                          <p className="text-gray-800">{item.text}</p>
                          <p className="text-xs text-gray-500">{item.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'resources' && (
              <div className="bg-white rounded-xl shadow p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-800">Resource Library</h2>
                  <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
                    + Share Resource
                  </button>
                </div>
                
                {/* Subject Filter */}
                <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                  <button className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">All</button>
                  <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-full text-sm">Chinese</button>
                  <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-full text-sm">English</button>
                  <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-full text-sm">Math</button>
                  <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-full text-sm">General Studies</button>
                </div>

                {/* Resources Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { title: 'Reading Comprehension P3', subject: 'Chinese', type: 'worksheet', downloads: 45 },
                    { title: 'Past Tense Exercise', subject: 'English', type: 'worksheet', downloads: 32 },
                    { title: 'Fractions Quiz', subject: 'Math', type: 'quiz', downloads: 28 },
                    { title: 'HK History Timeline', subject: 'GS', type: 'presentation', downloads: 19 },
                  ].map((r, i) => (
                    <div key={i} className="border rounded-xl p-4 hover:shadow-md transition cursor-pointer">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-gray-800">{r.title}</h3>
                        <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">Verified</span>
                      </div>
                      <div className="flex gap-2 text-xs text-gray-500">
                        <span className="px-2 py-1 bg-gray-100 rounded">{r.subject}</span>
                        <span className="px-2 py-1 bg-gray-100 rounded">{r.type}</span>
                        <span className="ml-auto">📥 {r.downloads}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'tools' && (
              <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6">AI Tools</h2>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: '📝', title: 'Worksheet Generator', desc: 'Create worksheets from any topic', color: 'blue' },
                    { icon: '🎯', title: 'Quiz Creator', desc: 'Generate TSA-style assessments', color: 'purple' },
                    { icon: '📖', title: 'Reading Comprehension', desc: 'Create questions for passages', color: 'green' },
                    { icon: '💡', title: 'Lesson Planner', desc: 'AI-assisted lesson planning', color: 'yellow' },
                    { icon: '📊', title: 'Progress Analyzer', desc: 'Identify learning gaps', color: 'red' },
                    { icon: '🎨', title: 'Visual Content', desc: 'Generate diagrams & charts', color: 'pink' },
                  ].map((tool, i) => (
                    <button key={i} className="p-6 border-2 rounded-xl hover:shadow-lg transition text-left">
                      <div className="text-4xl mb-3">{tool.icon}</div>
                      <h3 className="font-bold text-gray-800 mb-1">{tool.title}</h3>
                      <p className="text-sm text-gray-500">{tool.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'content' && (
              <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">My Content</h2>
                <p className="text-gray-500">Your created worksheets, quizzes, and resources will appear here.</p>
              </div>
            )}

            {activeTab === 'students' && (
              <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Student Progress</h2>
                <p className="text-gray-500">Track student performance and view detailed progress reports.</p>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Settings</h2>
                <p className="text-gray-500">Manage your account and preferences.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </main>
  )
}
