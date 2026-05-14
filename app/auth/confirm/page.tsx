'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function ConfirmPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('Confirming your email...')
  const router = useRouter()

  useEffect(() => {
    confirmEmail()
  }, [])

  async function confirmEmail() {
    try {
      const { error } = await supabase.auth.getSession()
      
      if (error) {
        setStatus('error')
        setMessage(error.message)
      } else {
        setStatus('success')
        setMessage('Your email has been confirmed!')
        setTimeout(() => router.push('/'), 3000)
      }
    } catch (e: any) {
      setStatus('error')
      setMessage(e.message)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 text-center">
        <div className="mb-6">
          <div className="text-6xl mb-4">
            {status === 'loading' && '⏳'}
            {status === 'success' && '✅'}
            {status === 'error' && '❌'}
          </div>
          <h1 className="text-2xl font-bold text-gray-800">
            {status === 'loading' && 'Confirming...'}
            {status === 'success' && 'Welcome Aboard!'}
            {status === 'error' && 'Oops!'}
          </h1>
        </div>

        <p className="text-gray-600 mb-6">{message}</p>

        {status === 'success' && (
          <p className="text-sm text-gray-500">Redirecting to login...</p>
        )}

        {(status === 'success' || status === 'error') && (
          <button
            onClick={() => router.push('/')}
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition"
          >
            Go to Login
          </button>
        )}
      </div>
    </main>
  )
}
