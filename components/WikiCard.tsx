'use client'

// components/WikiCard.tsx
// Matches automation-demos.vercel.app card structure exactly:
// title + category badge → workflow pill row → "View" button

import Link from 'next/link'
import { Eye, Clock, ChevronRight } from 'lucide-react'
import { WikiPage } from '@/lib/wiki'

interface Props {
  page: WikiPage
  catColor?: string
}

// Icon map for common tags
const TAG_ICONS: Record<string, string> = {
  'exam': '📝', 'test': '📋', 'practice': '✏️', 'math': '🔢',
  'english': '📖', 'chinese': '🈯', 'science': '🔬', 'history': '📜',
  'geography': '🌍', 'physics': '⚡', 'chemistry': '🧪', 'biology': '🧬',
  'reading': '👁️', 'writing': '✍️', 'listening': '👂', 'speaking': '🗣️',
  'grammar': '📐', 'vocabulary': '📚', 'comprehension': '💡',
}

export default function WikiCard({ page, catColor }: Props) {
  const excerpt = page.content
    ?.replace(/[#*`>\[\]()!\-_~|=]/g, '')
    .replace(/\n+/g, ' ')
    .trim()
    .slice(0, 120) || ''

  const timeAgo = getTimeAgo(page.updated_at)

  return (
    <div
      className="h-full bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-4 sm:p-6 hover:border-teal-500/30 transition-all"
      style={{ opacity: 0, transform: 'translateY(20px)' }}
    >
      {/* ── Top: title + category badge ── */}
      <div className="flex items-start justify-between gap-2 mb-4">
        <div className="min-w-0">
          <h3 className="text-base sm:text-lg font-semibold text-white truncate">
            {page.title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 line-clamp-2">
            {excerpt || 'No description yet'}
          </p>
        </div>
        {page.category && (
          <span className={`px-2 py-1 text-xs rounded-full capitalize flex-shrink-0 border ${
            catColor || 'bg-slate-700/50 text-slate-400 border-slate-600/30'
          }`}>
            {page.category.name}
          </span>
        )}
      </div>

      {/* ── Middle: workflow pill row ── */}
      <div className="relative py-4 sm:py-6 -mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto scrollbar-hide">
        <div className="flex items-center justify-start sm:justify-center gap-1 sm:gap-2 min-w-max">
          {page.tags && page.tags.length > 0 ? (
            page.tags.slice(0, 3).map((tag: string, i: number) => (
              <div key={tag} className="flex items-center">
                <div className={`relative flex flex-col items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border ${
                  i === 0
                    ? 'bg-teal-500/20 border-teal-500/50'
                    : 'bg-slate-800/50 border-slate-700/50'
                }`}>
                  <span className="text-[10px] sm:text-xs text-slate-300 whitespace-nowrap">
                    {TAG_ICONS[tag.toLowerCase()] || '📌'} {tag}
                  </span>
                </div>
                {i < Math.min(page.tags.length, 3) - 1 && (
                  <div className="w-4 sm:w-8 h-px bg-gradient-to-r from-slate-600 to-slate-500 mx-0.5 sm:mx-1" />
                )}
              </div>
            ))
          ) : (
            <>
              <div className="flex items-center">
                <div className="relative flex flex-col items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border bg-teal-500/20 border-teal-500/50">
                  <span className="text-[10px] sm:text-xs text-slate-300 whitespace-nowrap">
                    {page.category?.icon || '📄'} {page.category?.name || 'Resource'}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Bottom: "View" button ── */}
      <Link
        href={`/wiki/${page.slug}`}
        className="w-full py-2 sm:py-2.5 rounded-lg font-medium text-sm sm:text-base flex items-center justify-center gap-2 transition-all bg-teal-500/20 text-teal-400 hover:bg-teal-500/30"
      >
        <Eye className="w-4 h-4" />
        View Resource
        <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
      </Link>

      {/* ── Meta line ── */}
      <div className="flex items-center justify-between mt-3 text-xs text-slate-600">
        <div className="flex items-center gap-1.5">
          <Clock className="w-3 h-3" />
          <span>{timeAgo}</span>
        </div>
        <span>{page.view_count} views</span>
      </div>
    </div>
  )
}

function getTimeAgo(dateStr: string): string {
  const now = Date.now()
  const then = new Date(dateStr).getTime()
  const diff = now - then
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d`
  return new Date(dateStr).toLocaleDateString('en-HK', { month: 'short', day: 'numeric' })
}