// components/WikiCard.tsx
import Link from 'next/link'
import { WikiPage } from '@/lib/wiki'

interface Props {
  page: WikiPage
}

export default function WikiCard({ page }: Props) {
  const excerpt = page.content
    .replace(/[#*`>\[\]()!\-]/g, '')
    .replace(/\n+/g, ' ')
    .slice(0, 100)
    .trim()

  const timeAgo = getTimeAgo(page.updated_at)

  return (
    <Link
      href={`/wiki/${page.slug}`}
      className="block p-5 bg-slate-800/30 border border-slate-700/30 rounded-xl hover:border-indigo-500/20 hover:bg-slate-800/50 transition-all duration-200 group"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          {page.category && (
            <span className="text-lg">{page.category.icon}</span>
          )}
          <h3 className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors line-clamp-1">
            {page.title}
          </h3>
        </div>
      </div>

      {excerpt && (
        <p className="text-xs text-slate-500 line-clamp-2 mb-3 leading-relaxed">
          {excerpt}
        </p>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-[11px] text-slate-600">
          <span>{timeAgo}</span>
          <span>·</span>
          <span>{page.view_count} views</span>
        </div>
        {page.tags && page.tags.length > 0 && (
          <div className="flex gap-1">
            {page.tags.slice(0, 2).map((t: string) => (
              <span key={t} className="px-1.5 py-0.5 rounded-md bg-slate-700/30 text-[10px] text-slate-500">
                {t}
              </span>
            ))}
            {page.tags.length > 2 && (
              <span className="px-1.5 py-0.5 rounded-md bg-slate-700/30 text-[10px] text-slate-600">
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
  if (mins < 60) return `${mins}m ago`

  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`

  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`

  const weeks = Math.floor(days / 7)
  if (weeks < 4) return `${weeks}w ago`

  return new Date(dateStr).toLocaleDateString('en-HK')
}