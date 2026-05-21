// components/WikiCard.tsx
import Link from 'next/link'
import { WikiPage } from '@/lib/wiki'

interface Props {
  page: WikiPage
}

export default function WikiCard({ page }: Props) {
  const excerpt = page.content
    .replace(/[#*`>\[\]()!]/g, '')
    .slice(0, 120)
    .trim()

  return (
    <Link
      href={`/wiki/${page.slug}`}
      className="block p-5 bg-slate-800/40 border border-slate-700/50 rounded-xl hover:border-indigo-500/30 hover:bg-slate-800/60 transition-all group"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base font-medium text-slate-200 group-hover:text-white transition-colors line-clamp-2">
          {page.title}
        </h3>
        {page.category && (
          <span className="shrink-0 text-xs px-2 py-0.5 rounded-full bg-slate-700/50 text-slate-400">
            {page.category.icon} {page.category.name}
          </span>
        )}
      </div>
      <p className="mt-2 text-sm text-slate-500 line-clamp-2">{excerpt}</p>
      <div className="mt-3 flex items-center gap-3 text-xs text-slate-600">
        <span>{new Date(page.updated_at).toLocaleDateString('en-HK')}</span>
        <span>{page.view_count} views</span>
        {page.tags?.length > 0 && (
          <span className="flex gap-1.5">
            {page.tags.slice(0, 3).map((t) => (
              <span key={t} className="px-1.5 py-0.5 rounded bg-slate-700/30 text-slate-500">
                {t}
              </span>
            ))}
          </span>
        )}
      </div>
    </Link>
  )
}