// components/WikiCard.tsx
import Link from 'next/link'
import { WikiPage } from '@/lib/wiki'

interface Props {
  page: WikiPage
  catColors?: string
}

export default function WikiCard({ page, catColors }: Props) {
  const excerpt = page.content
    ?.replace(/[#*`>\[\]()!\-_~|=]/g, '')
    .replace(/\n+/g, ' ')
    .trim()
    .slice(0, 160) || ''

  const timeAgo = getTimeAgo(page.updated_at)

  return (
    <Link
      href={`/wiki/${page.slug}`}
      className="block h-full bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-4 sm:p-6
               hover:border-teal-500/30 hover:bg-slate-800/70 transition-all group cursor-pointer"
    >
      {/* Top row: title + category badge */}
      <div className="flex items-start justify-between gap-2 mb-4">
        <div className="min-w-0">
          <h3 className="text-base sm:text-lg font-semibold text-white truncate group-hover:text-teal-300 transition-colors">
            {page.title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 line-clamp-2">
            {excerpt || 'No description yet'}
          </p>
        </div>
        {page.category && (
          <span className={`px-2 py-1 text-xs rounded-full capitalize flex-shrink-0 ${
            catColors || 'bg-slate-700/50 text-slate-400 border border-slate-600/30'
          } border`}>
            {page.category.icon} {page.category.name}
          </span>
        )}
      </div>

      {/* Content preview — visual separator */}
      <div className="relative py-4 sm:py-6 -mx-4 px-4 sm:mx-0 sm:px-0 border-y border-slate-800/50">
        {/* Tags as visual pills */}
        {page.tags && page.tags.length > 0 ? (
          <div className="flex items-center justify-start sm:justify-center gap-1 sm:gap-2 flex-wrap">
            {page.tags.slice(0, 3).map((t: string, i: number) => (
              <div key={t} className="flex items-center gap-1.5">
                <div className={`relative flex flex-col items-center px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border ${
                  i === 0
                    ? 'bg-teal-500/10 border-teal-500/30'
                    : 'bg-slate-800/50 border-slate-700/50'
                }`}>
                  <span className="text-[10px] sm:text-xs text-slate-300 whitespace-nowrap">
                    {t}
                  </span>
                </div>
                {i < Math.min(page.tags.length, 3) - 1 && (
                  <span className="text-slate-600 text-[10px]">→</span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <div className="relative flex flex-col items-center px-3 py-2 rounded-lg border bg-teal-500/10 border-teal-500/30">
              <span className="text-[10px] sm:text-xs text-slate-300">
                {page.category?.icon || '📄'} {page.category?.name || 'Resource'}
              </span>
            </div>
            <span className="text-slate-600">→</span>
            <div className="relative flex flex-col items-center px-3 py-2 rounded-lg border bg-slate-800/50 border-slate-700/50">
              <span className="text-[10px] sm:text-xs text-slate-400">
                View & Edit
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Bottom: meta + view button */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <span>{timeAgo}</span>
          <span className="text-slate-700">·</span>
          <span>{page.view_count} views</span>
        </div>
        <span className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-400 text-xs font-medium
                       border border-slate-700/50 group-hover:border-teal-500/30 group-hover:text-teal-300
                       transition-all">
          View →
        </span>
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
  return new Date(dateStr).toLocaleDateString('en-HK', { month: 'short', day: 'numeric' })
}