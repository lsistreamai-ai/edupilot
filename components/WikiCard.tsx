// components/WikiCard.tsx
import Link from 'next/link'
import { WikiPage } from '@/lib/wiki'

interface Props {
  page: WikiPage
}

export default function WikiCard({ page }: Props) {
  const excerpt = page.content
    ?.replace(/[#*`>\[\]()!\-_~|=]/g, '')
    .replace(/\n+/g, ' ')
    .trim()
    .slice(0, 140) || ''

  const timeAgo = getTimeAgo(page.updated_at)

  return (
    <Link
      href={`/wiki/${page.slug}`}
      className="group flex flex-col p-5 bg-slate-800/30 border border-slate-800/50 rounded-xl
               hover:border-teal-500/20 hover:bg-slate-800/50
               active:scale-[0.98] transition-all duration-200 cursor-pointer"
    >
      {/* Icon + Title */}
      <div className="flex items-start gap-3 mb-3">
        <span className="text-lg shrink-0 mt-0.5">
          {page.category?.icon || '📄'}
        </span>
        <h3 className="text-sm font-medium text-slate-200 group-hover:text-white leading-snug transition-colors line-clamp-2">
          {page.title}
        </h3>
      </div>

      {/* Excerpt */}
      {excerpt && (
        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-auto">
          {excerpt}
        </p>
      )}

      {/* Bottom meta */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-800/50">
        <div className="flex items-center gap-2.5">
          <span className="flex items-center gap-1 text-[11px] text-slate-600">
            <span className="inline-block w-1 h-1 rounded-full bg-slate-600" />
            {timeAgo}
          </span>
          <span className="text-[11px] text-slate-700">·</span>
          <span className="text-[11px] text-slate-600">{page.view_count} views</span>
        </div>

        {page.tags && page.tags.length > 0 && (
          <div className="flex gap-1">
            {page.tags.slice(0, 2).map((t: string) => (
              <span
                key={t}
                className="px-2 py-0.5 rounded-md bg-slate-700/30 text-[10px] text-slate-500
                         group-hover:bg-slate-700/50 group-hover:text-slate-400 transition-colors"
              >
                {t}
              </span>
            ))}
            {page.tags.length > 2 && (
              <span className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] text-slate-600">
                +{page.tags.length - 2}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
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
  const weeks = Math.floor(days / 7)
  if (weeks < 4) return `${weeks}w`
  return new Date(dateStr).toLocaleDateString('en-HK', { month: 'short', day: 'numeric' })
}