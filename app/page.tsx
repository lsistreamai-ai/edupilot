'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function HomePage() {
  const [role, setRole] = useState<'teacher' | 'student'>('student')
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [grade, setGrade] = useState('')
  const [subject, setSubject] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  useEffect(() => {
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
  const allGrades = [...primaryGrades, ...secondaryGrades]

  const primarySubjects = [
    { code: 'CHIN-P', name: 'Chinese Language' },
    { code: 'ENG-P', name: 'English Language' },
    { code: 'MATH-P', name: 'Mathematics' },
    { code: 'GS-P', name: 'General Studies' },
  ]

  const secondarySubjects = [
    { code: 'CHIN-S', name: 'Chinese Language' },
    { code: 'ENG-S', name: 'English Language' },
    { code: 'MATH-S', name: 'Mathematics' },
    { code: 'CSD-S', name: 'Citizenship and Social Development' },
    { code: 'PHY-S', name: 'Physics' },
    { code: 'CHEM-S', name: 'Chemistry' },
    { code: 'BIO-S', name: 'Biology' },
    { code: 'ECON-S', name: 'Economics' },
    { code: 'HIST-S', name: 'History' },
    { code: 'CHIST-S', name: 'Chinese History' },
    { code: 'GEOG-S', name: 'Geography' },
    { code: 'ICT-S', name: 'Information and Communication Technology' },
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
        setMessage('Registration successful! Please check your email to confirm your account.')
      }
    } catch (error: any) {
      setMessage(error.message)
    }

    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 text-white p-6 text-center">
          <div className="text-4xl mb-2">✈️</div>
          <h1 className="text-3xl font-bold">EduPilot</h1>
          <p className="text-blue-100 mt-1">Pilot your education journey</p>
          <p className="text-xs text-blue-200 mt-1">TSA (Primary) & DSE (Secondary)</p>
        </div>

        {/* Role Selection */}
        <div className="flex border-b">
          <button onClick={() => setRole('student')}
            className={`flex-1 py-4 font-medium transition ${role === 'student' ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}>
            👨‍🎓 Student
          </button>
          <button onClick={() => setRole('teacher')}
            className={`flex-1 py-4 font-medium transition ${role === 'teacher' ? 'bg-purple-50 text-purple-600 border-b-2 border-purple-600' : 'text-gray-500'}`}>
            👨‍🏫 Teacher
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="text-center text-sm">
            <span className="text-gray-600">{isLogin ? "Don't have an account? " : "Already have an account? "}</span>
            <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-blue-600 font-medium hover:underline">
              {isLogin ? 'Register' : 'Login'}
            </button>
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Your name" />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="you@example.com" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="••••••••" />
          </div>

          {!isLogin && role === 'student' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Grade</label>
              <select value={grade} onChange={(e) => setGrade(e.target.value)} required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Main Subject</label>
              <select value={subject} onChange={(e) => setSubject(e.target.value)} required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
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
            <div className={`p-3 rounded-lg text-sm ${message.includes('successful') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {message}
            </div>
          )}

          <button type="submit" disabled={loading}
            className={`w-full py-3 rounded-lg font-bold text-white transition ${role === 'teacher' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-blue-600 hover:bg-blue-700'} disabled:opacity-50`}>
            {loading ? 'Please wait...' : isLogin ? 'Login' : 'Create Account'}
          </button>
        </form>
      </div>
    </main>
  )
}
