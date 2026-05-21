// app/wiki/[slug]/page.tsx — Wiki Page View
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getCategories, getWikiPage, getWikiPages } from '@/lib/wiki'
import MarkdownRenderer from '@/components/MarkdownRenderer'
import WikiSidebar from '@/components/WikiSidebar'

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

  return (
    <div className="flex gap-8">
      <WikiSidebar categories={categories} />

      <main className="flex-1 min-w-0">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
          <Link href="/wiki" className="hover:text-slate-300 transition-colors">
            Wiki
          </Link>
          {page.category && (
            <>
              <span>/</span>
              <Link
                href={`/wiki?category=${page.category.slug}`}
                className="hover:text-slate-300 transition-colors"
              >
                {page.category.icon} {page.category.name}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-slate-400">{page.title}</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-white mb-2">{page.title}</h1>

        {/* Meta */}
        <div className="flex items-center gap-4 text-xs text-slate-600 mb-8">
          <span>Updated {new Date(page.updated_at).toLocaleDateString('en-HK')}</span>
          <span>{page.view_count} views</span>
          {page.tags?.length > 0 && (
            <div className="flex gap-1.5">
              {page.tags.map((t: string) => (
                <span key={t} className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-500">
                  {t}
                </span>
              ))}
            </div>
          )}
          <Link
            href={`/wiki/${slug}/edit`}
            className="ml-auto px-3 py-1 rounded-lg bg-slate-800/50 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 transition-colors"
          >
            Edit
          </Link>
        </div>

        {/* Content */}
        <MarkdownRenderer content={page.content} />
      </main>
    </div>
  )
}