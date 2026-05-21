// app/wiki/layout.tsx — Wiki Brain layout
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function WikiLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${inter.className} min-h-screen bg-slate-950 text-slate-200 antialiased`}>
      <div className="max-w-6xl mx-auto px-4 py-12 sm:py-20">
        {children}
      </div>
    </div>
  )
}