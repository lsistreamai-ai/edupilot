'use client'

import { Layers, BookOpen, Search, Plus, Zap } from 'lucide-react'

// Background gradient orbs + dot pattern
export function HeroParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-teal-500/[0.03] rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-500/[0.03] rounded-full blur-[100px]" />
      <div
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(20, 184, 166, 0.15) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />
    </div>
  )
}