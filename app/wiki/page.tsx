// app/wiki/page.tsx — Wiki Browser
import { Suspense } from 'react'
import { getCategories, getWikiPages } from '@/lib/wiki'
import WikiSidebar from '@/components/WikiSidebar'
import WikiCard from '@/components/WikiCard'

export const dynamic = 'force-dynamic'

interface Props {
  searchParams: Promise<{ category?: string; search?: string }>
}

export default async function WikiPage({ searchParams }: Props) {
  const params = await searchParams
  const categories = await getCategories()
  const { pages } = await getWikiPages({
    category: params.category,
    search: params.search,
  })

  return (
    <div className="flex gap-8">
      <WikiSidebar
        categories={categories}
        activeCategory={params.category}
      />

      <main className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">
              {params.category
                ? categories.find((c) => c.slug === params.category)?.name || 'Wiki'
                : 'Wiki'}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {params.category
                ? categories.find((c) => c.slug === params.category)?.description
                : 'Browse all study materials, exam papers, and resources'}
            </p>
          </div>
          <span className="text-sm text-slate-600">{pages.length} pages</span>
        </div>

        {pages.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-lg text-slate-400 font-medium">No pages yet</h3>
            <p className="text-sm text-slate-600 mt-2">
              Start by creating your first wiki page
            </p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {pages.map((page) => (
              <WikiCard key={page.id} page={page} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}