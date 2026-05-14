'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkUser()
  }, [])

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      router.push('/')
      return
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role === 'teacher') {
      router.push('/dashboard/teacher')
    } else if (profile?.role === 'admin') {
      router.push('/dashboard/admin')
    } else {
      router.push('/dashboard/student')
    }
    
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 flex items-center justify-center">
      <div className="text-center text-white">
        <div className="text-6xl animate-pulse">⏳</div>
        <p className="text-xl mt-4">Loading your dashboard...</p>
      </div>
    </main>
  )
}
