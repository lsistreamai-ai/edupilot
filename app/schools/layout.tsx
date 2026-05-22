// app/schools/layout.tsx — Schools layout
import { Inter } from 'next/font/google'
import Link from 'next/link'
import { School as SchoolIcon, Brain, Globe } from 'lucide-react'

const inter = Inter({ subsets: ['latin'] })

export default function SchoolsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${inter.className} min-h-screen bg-slate-950 text-slate-200 antialiased`}>
      {/* Top navbar */}
      <nav className="border-b border-slate-800/50 bg-slate-950/80 backdrop-blur supports-[backdrop-filter]:bg-slate-950/60 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-12 sm:h-14 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-white font-semibold text-sm sm:text-base">
            <SchoolIcon className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-teal-400" />
            EduPilot
          </Link>
          <div className="flex items-center gap-3 sm:gap-5 text-xs sm:text-sm text-slate-400">
            <Link href="/schools" className="hover:text-teal-300 transition-colors inline-flex items-center gap-1">
              <SchoolIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Schools</span>
            </Link>
            <Link href="/wiki" className="hover:text-teal-300 transition-colors inline-flex items-center gap-1">
              <Brain className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Wiki Brain</span>
            </Link>
          </div>
        </div>
      </nav>

      <div className="px-4 sm:px-6 py-6 sm:py-8">
        {children}
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800/50 py-6 sm:py-8 text-center text-[11px] sm:text-xs text-slate-600">
        <p>Data sourced from the Hong Kong Education Bureau — School Profiles 2025</p>
      </footer>
    </div>
  )
}