'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const [role, setRole] = useState<'student' | 'teacher'>('student')
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [grade, setGrade] = useState('')
  const [subject, setSubject] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    checkSession()
  }, [])

  async function checkSession() {
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      router.push('/dashboard')
    }
  }

  const primaryGrades = ['Primary 1', 'Primary 2', 'Primary 3', 'Primary 4', 'Primary 5', 'Primary 6']
  const secondaryGrades = ['Secondary 1', 'Secondary 2', 'Secondary 3', 'Secondary 4', 'Secondary 5', 'Secondary 6']

  const primarySubjects = [
    { code: 'CHIN-P', name: 'Chinese 中文' },
    { code: 'ENG-P', name: 'English 英文' },
    { code: 'MATH-P', name: 'Math 數學' },
    { code: 'GS-P', name: 'General Studies 常識' },
  ]

  const secondarySubjects = [
    { code: 'CHIN-S', name: 'Chinese 中國語文' },
    { code: 'ENG-S', name: 'English 英國語文' },
    { code: 'MATH-S', name: 'Math 數學' },
    { code: 'PHY-S', name: 'Physics 物理' },
    { code: 'CHEM-S', name: 'Chemistry 化學' },
    { code: 'BIO-S', name: 'Biology 生物' },
    { code: 'ECON-S', name: 'Economics 經濟' },
    { code: 'ICT-S', name: 'ICT 資訊科技' },
  ]

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        router.push('/dashboard')
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name,
              role,
              grade: role === 'student' ? grade : undefined,
              subject: role === 'teacher' ? subject : undefined,
            }
          }
        })
        if (error) throw error
        setMessage('✓ Account created! Check your email to confirm.')
      }
    } catch (error: any) {
      setMessage(error.message)
    }

    setLoading(false)
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-sky-100 via-blue-50 to-purple-100">
      {/* Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-blue-300/60 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-purple-300/60 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}} />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl shadow-xl mb-4">
            <span className="text-5xl">✈️</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">EduPilot</h1>
          <p className="text-gray-500 mt-1">Pilot your education journey</p>
        </div>

        {/* Card */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden">
          {/* Role Toggle */}
          <div className="flex border-b border-gray-100">
            <button onClick={() => setRole('student')} className={`flex-1 py-4 font-medium text-sm transition-all flex items-center justify-center gap-2 ${role === 'student' ? 'text-blue-600 bg-blue-50/50 border-b-2 border-blue-500' : 'text-gray-400'}`}>
              <span className="text-xl">👨‍🎓</span> Student
            </button>
            <button onClick={() => setRole('teacher')} className={`flex-1 py-4 font-medium text-sm transition-all flex items-center justify-center gap-2 ${role === 'teacher' ? 'text-purple-600 bg-purple-50/50 border-b-2 border-purple-500' : 'text-gray-400'}`}>
              <span className="text-xl">👨‍🏫</span> Teacher
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <p className="text-center text-sm text-gray-500">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button type="button" onClick={() => { setIsLogin(!isLogin); setMessage(''); }} className={`font-semibold ${role === 'teacher' ? 'text-purple-600' : 'text-blue-600'}`}>
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none" placeholder="Your name" />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none" placeholder="you@example.com" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none" placeholder="••••••••" />
            </div>

            {!isLogin && role === 'student' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Grade</label>
                <select value={grade} onChange={(e) => setGrade(e.target.value)} required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none bg-white">
                  <option value="">Select your grade</option>
                  <optgroup label="Primary (TSA)">
                    {primaryGrades.map(g => <option key={g} value={g}>{g}</option>)}
                  </optgroup>
                  <optgroup label="Secondary (DSE)">
                    {secondaryGrades.map(g => <option key={g} value={g}>{g}</option>)}
                  </optgroup>
                </select>
              </div>
            )}

            {!isLogin && role === 'teacher' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Main Subject</label>
                <select value={subject} onChange={(e) => setSubject(e.target.value)} required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none bg-white">
                  <option value="">Select your subject</option>
                  <optgroup label="Primary (TSA)">
                    {primarySubjects.map(s => <option key={s.code} value={s.code}>{s.name}</option>)}
                  </optgroup>
                  <optgroup label="Secondary (DSE)">
                    {secondarySubjects.map(s => <option key={s.code} value={s.code}>{s.name}</option>)}
                  </optgroup>
                </select>
              </div>
            )}

            {message && (
              <div className={`p-3 rounded-xl text-sm ${message.includes('✓') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                {message}
              </div>
            )}

            <button type="submit" disabled={loading} className={`w-full py-4 rounded-xl font-bold text-white transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 shadow-lg ${role === 'teacher' ? 'bg-gradient-to-r from-purple-500 to-purple-600 shadow-purple-500/25' : 'bg-gradient-to-r from-blue-500 to-blue-600 shadow-blue-500/25'}`}>
              {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">TSA (Primary) & DSE (Secondary) • Hong Kong</p>
      </div>
    </div>
  )
}
