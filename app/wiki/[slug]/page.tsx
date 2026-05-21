// app/wiki/[slug]/page.tsx — Wiki Article View
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getCategories, getWikiPage } from '@/lib/wiki'
import MarkdownRenderer from '@/components/MarkdownRenderer'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function WikiViewPage({ params }: Props) {
  const { slug } = await params
  const [categories, page] = await Promise.all([
    getCategories(),
    getWikiPage(slug),
  ])

  if (!page) notFound()

  const timeAgo = getTimeAgo(page.updated_at)

  return (
    <div className="max-w-3xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
        <Link href="/wiki" className="hover:text-slate-300 transition-colors">
          🧠 Wiki Brain
        </Link>
        {page.category && (
          <>
            <span className="text-slate-700">/</span>
            <Link
              href={`/wiki?category=${page.category.slug}`}
              className="hover:text-slate-300 transition-colors"
            >
              {page.category.icon} {page.category.name}
            </Link>
          </>
        )}
        <span className="text-slate-700">/</span>
        <span className="text-slate-400 truncate">{page.title}</span>
      </div>

      {/* Header */}
      <header className="mb-8">
        {page.category && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800/50 border border-slate-700/30 text-xs text-slate-400 mb-3">
            {page.category.icon} {page.category.name}
          </span>
        )}
        <h1 className="text-3xl font-bold text-white mb-3 leading-tight">
          {page.title}
        </h1>

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
          <span>Updated {timeAgo}</span>
          <span className="text-slate-700">·</span>
          <span>{page.view_count} views</span>
          {page.tags && page.tags.length > 0 && (
            <>
              <span className="text-slate-700">·</span>
              <div className="flex flex-wrap gap-1.5">
                {page.tags.map((t: string) => (
                  <span key={t} className="px-2 py-0.5 rounded-md bg-slate-800/50 text-slate-500">
                    {t}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-4 pt-4 border-t border-slate-700/30">
          <Link
            href={`/wiki/${slug}/edit`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700/30 text-xs text-slate-400 hover:text-indigo-400 hover:border-indigo-500/20 transition-colors"
          >
            ✏️ Edit
          </Link>
          <Link
            href="/wiki"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-slate-500 hover:text-slate-300 transition-colors"
          >
            ← Back to Brain
          </Link>
        </div>
      </header>

      {/* Content */}
      <article className="bg-slate-800/20 border border-slate-700/20 rounded-2xl p-8">
        <MarkdownRenderer content={page.content} />
      </article>

      {/* Footer nav */}
      <div className="mt-8 flex items-center justify-between text-xs text-slate-600">
        <Link href="/wiki" className="hover:text-slate-400 transition-colors">
          ← Wiki Brain
        </Link>
        <Link href="/wiki/new" className="text-indigo-400 hover:text-indigo-300 transition-colors">
          + Add more knowledge
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
  return new Date(dateStr).toLocaleDateString('en-HK')
}