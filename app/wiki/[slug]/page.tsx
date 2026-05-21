// app/wiki/[slug]/page.tsx — Wiki Article View
import Link from 'next/link'
import { getWikiPage } from '@/lib/wiki'
import MarkdownRenderer from '@/components/MarkdownRenderer'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function WikiViewPage({ params }: Props) {
  const { slug } = await params
  const page = await getWikiPage(slug)

  if (!page) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl text-white font-semibold mb-2">Page not found</h2>
        <p className="text-sm text-slate-400 mb-6">This page doesn&apos;t exist or has been removed.</p>
        <Link
          href="/wiki"
          className="px-5 py-2.5 rounded-lg bg-slate-800 text-white font-medium border border-slate-700 hover:border-slate-600 transition-colors text-sm"
        >
          ← Back to Wiki Brain
        </Link>
      </div>
    )
  }

  const timeAgo = getTimeAgo(page.updated_at)

  return (
    <div className="max-w-3xl mx-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 mb-8 flex-wrap">
        <Link href="/wiki" className="hover:text-slate-300 transition-colors">
          Wiki Brain
        </Link>
        {page.category && (
          <>
            <span className="text-slate-700">/</span>
            <Link
              href={`/wiki?category=${page.category.slug}`}
              className="hover:text-slate-300 transition-colors"
            >
              {page.category.name}
            </Link>
          </>
        )}
        <span className="text-slate-700">/</span>
        <span className="text-slate-400 truncate max-w-[200px]">{page.title}</span>
      </nav>

      {/* Header */}
      <header className="mb-10">
        {page.category && (
          <Link
            href={`/wiki?category=${page.category.slug}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-500/10 border border-teal-500/20 text-xs text-teal-300
                     hover:border-teal-500/30 transition-all mb-4"
          >
            {page.category.icon} {page.category.name}
          </Link>
        )}

        <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight mb-4">
          {page.title}
        </h1>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
            <span className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-slate-600" />
              Updated {timeAgo}
            </span>
            <span className="text-slate-700">·</span>
            <span>{page.view_count} views</span>
            {page.tags && page.tags.length > 0 && (
              <>
                <span className="text-slate-700">·</span>
                <div className="flex flex-wrap gap-1.5">
                  {page.tags.map((t: string) => (
                    <span key={t} className="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700/50 text-[11px] text-slate-500">
                      {t}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>

          <Link
            href={`/wiki/${slug}/edit`}
            className="px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-400
                     hover:text-slate-200 hover:border-slate-600 transition-all"
          >
            Edit
          </Link>
        </div>
      </header>

      {/* Article Content */}
      <article className="bg-slate-800/20 border border-slate-800/50 rounded-xl p-6 sm:p-10">
        <MarkdownRenderer content={page.content} />
      </article>

      {/* Footer */}
      <div className="flex items-center justify-between mt-10 pt-6 border-t border-slate-800">
        <Link
          href={page.category ? `/wiki?category=${page.category.slug}` : '/wiki'}
          className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
        >
          ← Back to {page.category ? page.category.name : 'Wiki Brain'}
        </Link>
        <Link href="/wiki/new" className="text-sm text-teal-400 hover:text-teal-300 transition-colors">
          + Add resource
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
  return new Date(dateStr).toLocaleDateString('en-HK', {
    year: 'numeric', month: 'short', day: 'numeric',
  })
}