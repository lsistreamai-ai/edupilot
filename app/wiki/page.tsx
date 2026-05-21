// app/wiki/page.tsx — Wiki Brain Homepage
// Design system: automation-demos.vercel.app
// Teal accent, border-driven depth, generous spacing, clean hierarchy

import { getCategories, getWikiPages } from '@/lib/wiki'
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

  const activeCategoryName = params.category
    ? categories.find((c) => c.slug === params.category)?.name
    : null

  return (
    <div className="max-w-6xl mx-auto">
      {/* ── Hero Section ── */}
      {!params.category && (
        <section className="min-h-[40vh] sm:min-h-[50vh] flex items-center justify-center text-center mb-12 sm:mb-20">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 mb-4 sm:mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-400">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
              <span className="text-xs sm:text-sm text-teal-300">Knowledge Base</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6 leading-tight">
              Your School&apos;s{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-400">
                Collective Intelligence
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-400 mb-6 sm:mb-8 max-w-xl mx-auto">
              A searchable library of exam papers, curriculum guides, worksheets and study notes
              — organised by subject, mapped to skills, and built by your teachers.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <a
                href="/wiki/new"
                className="px-5 sm:px-6 py-2.5 sm:py-3 bg-teal-500 text-slate-900 font-medium rounded-lg hover:bg-teal-400 transition-colors text-sm sm:text-base"
              >
                Add a Resource
              </a>
              <a
                href="/wiki/skills"
                className="px-5 sm:px-6 py-2.5 sm:py-3 bg-slate-800 text-white font-medium rounded-lg border border-slate-700 hover:border-slate-600 transition-colors text-sm sm:text-base"
              >
                Skills Map
              </a>
            </div>
          </div>
        </section>
      )}

      {/* ── Category Filter Header ── */}
      {activeCategoryName && (
        <div className="mb-8 sm:mb-10">
          <a href="/wiki" className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-slate-200 transition-colors mb-3">
            ← Wiki Brain
          </a>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">{activeCategoryName}</h1>
          <p className="text-sm text-slate-500 mt-1">
            {categories.find((c) => c.name === activeCategoryName)?.description}
          </p>
        </div>
      )}

      {/* ── Category Pills ── */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 justify-center mb-8 sm:mb-10">
          <a
            href="/wiki"
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              !params.category
                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                : 'bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:border-slate-600'
            }`}
          >
            All
          </a>
          {categories.map((cat) => (
            <a
              key={cat.id}
              href={`/wiki?category=${cat.slug}`}
              className={`inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                params.category === cat.slug
                  ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                  : 'bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:border-slate-600'
              }`}
            >
              {cat.icon} {cat.name}
            </a>
          ))}
          <a
            href="/wiki/skills"
            className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium
                     bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:border-slate-600 transition-all"
          >
            Skills
          </a>
        </div>
      )}

      {/* ── Search ── */}
      <form className="mb-8 sm:mb-10 max-w-xl mx-auto" action="/wiki" method="get">
        <input
          type="text"
          name="search"
          placeholder="Search by title, subject, or keyword…"
          defaultValue={params.search || ''}
          className="w-full bg-slate-800/40 border border-slate-700/40 rounded-lg px-4 py-3 text-sm sm:text-base text-slate-200
                   placeholder:text-slate-600 focus:outline-none focus:border-teal-500/30 focus:bg-slate-800/50
                   transition-all duration-200"
        />
        {params.category && <input type="hidden" name="category" value={params.category} />}
      </form>

      {/* ── Results header ── */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-white">
          {params.search
            ? `Results for "${params.search}"`
            : pages.length > 0
              ? `${pages.length} resource${pages.length !== 1 ? 's' : ''}`
              : 'Resources'}
        </h2>
        {!params.search && pages.length > 0 && (
          <span className="text-xs text-slate-600">Most recent</span>
        )}
      </div>

      {/* ── Empty state ── */}
      {pages.length === 0 ? (
        <div className="text-center py-16 sm:py-20">
          {!params.search ? (
            <>
              <p className="text-slate-400 text-sm sm:text-base max-w-md mx-auto leading-relaxed mb-8">
                This is where your school&apos;s knowledge lives. Start by adding an exam paper,
                a worksheet, or a curriculum guide.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-10">
                <a
                  href="/wiki/new"
                  className="px-5 sm:px-6 py-2.5 sm:py-3 bg-teal-500 text-slate-900 font-medium rounded-lg hover:bg-teal-400 transition-colors text-sm sm:text-base"
                >
                  Add Your First Resource
                </a>
                <a
                  href="/wiki/skills"
                  className="px-5 sm:px-6 py-2.5 sm:py-3 bg-slate-800 text-white font-medium rounded-lg border border-slate-700 hover:border-slate-600 transition-colors text-sm sm:text-base"
                >
                  Browse Skills
                </a>
              </div>
              <div className="border-t border-slate-800 pt-10">
                <p className="text-xs text-slate-600 uppercase tracking-wider font-medium mb-4">Browse by subject</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {categories.map((cat) => (
                    <a
                      key={cat.id}
                      href={`/wiki?category=${cat.slug}`}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/50 text-slate-400 border border-slate-700/50
                               hover:border-slate-600 hover:text-slate-200 text-sm transition-all"
                    >
                      <span>{cat.icon}</span>
                      <span>{cat.name}</span>
                    </a>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              <p className="text-slate-400 text-sm max-w-md mx-auto leading-relaxed mb-6">
                Nothing matched &ldquo;{params.search}&rdquo;. Try a different keyword or browse by category.
              </p>
              <a href="/wiki" className="text-sm text-teal-400 hover:text-teal-300 transition-colors">
                ← Back to all resources
              </a>
            </>
          )}
        </div>
      ) : (
        /* ── Results Grid ── */
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pages.map((page) => (
            <WikiCard key={page.id} page={page} />
          ))}
        </div>
      )}
    </div>
  )
}