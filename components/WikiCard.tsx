'use client'

// components/WikiCard.tsx
// Mobile-friendly card with expanded context: longer excerpt, up to 5 tag pills

import Link from 'next/link'
import { Eye, Clock, Tag, ArrowUpRight } from 'lucide-react'
import { WikiPage } from '@/lib/wiki'

interface Props {
  page: WikiPage
  catColor?: string
}

const TAG_COLORS = [
  'bg-teal-500/20 border-teal-500/50 text-teal-300',
  'bg-blue-500/20 border-blue-500/50 text-blue-300',
  'bg-pink-500/20 border-pink-500/50 text-pink-300',
  'bg-emerald-500/20 border-emerald-500/50 text-emerald-300',
  'bg-amber-500/20 border-amber-500/50 text-amber-300',
]

export default function WikiCard({ page, catColor }: Props) {
  const excerpt = page.content
    ?.replace(/[#*>`\[\]()!\-_~|=]/g, '')
    .replace(/\n+/g, ' ')
    .trim()
    .slice(0, 200) || ''

  const timeAgo = getTimeAgo(page.updated_at)
  const displayTags = (page.tags || []).slice(0, 5)

  return (
    <div className="h-full bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-4 sm:p-5 hover:border-teal-500/30 transition-all group flex flex-col">
      {/* ── Top: title + category badge ── */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <h3 className="text-sm sm:text-base font-semibold text-white leading-snug line-clamp-2 min-w-0">
          {page.title}
        </h3>
        {page.category && (
          <span className={`px-2 py-0.5 text-[11px] rounded-full flex-shrink-0 border leading-tight ${catColor || 'bg-slate-700/50 text-slate-400 border-slate-600/30'}`}>
            {page.category.name}
          </span>
        )}
      </div>

      {/* ── Excerpt — expanded for more context ── */}
      {excerpt && (
        <p className="text-xs sm:text-sm text-slate-400 mb-3 leading-relaxed line-clamp-3">
          {excerpt}
        </p>
      )}

      {/* ── Tags — show up to 5, more context ── */}
      {displayTags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4 mt-auto">
          {displayTags.map((tag: string, i: number) => (
            <span
              key={tag}
              className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] sm:text-[11px] rounded-md border leading-tight ${TAG_COLORS[i % TAG_COLORS.length]}`}
            >
              <Tag className="w-2.5 h-2.5 opacity-60" />
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* ── Bottom: view button + meta ── */}
      <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-800">
        <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-slate-600">
          <Clock className="w-3 h-3" />
          <span>{timeAgo}</span>
          {page.view_count > 0 && (
            <>
              <span className="text-slate-700">·</span>
              <span>{page.view_count} views</span>
            </>
          )}
        </div>
        <Link
          href={`/wiki/${page.slug}`}
          className="inline-flex items-center gap-1 text-xs font-medium text-teal-400 hover:text-teal-300 transition-colors"
        >
          View
          <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>
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
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  if (days < 30) return `${Math.floor(days / 7)}w ago`
  return new Date(dateStr).toLocaleDateString('en-HK', { month: 'short', day: 'numeric' })
}