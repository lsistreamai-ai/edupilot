// app/wiki/page.tsx — Wiki Brain Homepage
import { getCategories, getWikiPages } from '@/lib/wiki'
import WikiCard from '@/components/WikiCard'
import GlobeBackground from '@/components/GlobeBackground'

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
    <div>
      {/* ── Hero Section ── */}
      {!params.category && (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-950/50 via-slate-900 to-slate-950 mb-10 border border-indigo-500/10">
          {/* Globe */}
          <div className="absolute right-0 top-0 w-[520px] h-[420px] opacity-70">
            <GlobeBackground />
          </div>

          {/* Gradient fade for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent rounded-2xl pointer-events-none" />

          <div className="relative z-10 px-8 py-14 sm:px-10 sm:py-16 max-w-xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium mb-5 tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
              KNOWLEDGE HUB
            </div>

            {/* Title */}
            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-4xl">🧠</span>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
                Wiki Brain
              </h1>
            </div>

            {/* Subtitle */}
            <p className="text-base text-slate-300 leading-relaxed mb-2 max-w-md">
              Your school&apos;s collective intelligence — a searchable, AI-powered knowledge library
              built for teachers, by teachers.
            </p>
            <p className="text-sm text-slate-500 leading-relaxed max-w-md">
              Store exam papers, curriculum guides, worksheets, and study notes in one place.
              Every upload makes the brain smarter. Find anything in seconds with AI-powered search.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3 mt-7">
              <a
                href="/wiki/new"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-500 text-white text-sm font-semibold
                         hover:bg-indigo-400 active:scale-[0.97] transition-all duration-150
                         shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/35"
              >
                + New Resource
              </a>
              <a
                href="/wiki/skills"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-200 text-sm font-medium
                         hover:bg-white/10 hover:border-white/15 active:scale-[0.97] transition-all duration-150"
              >
                🎯 Skills Map
              </a>
              <a
                href="?category=exam-papers"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-sm font-medium
                         hover:bg-white/10 hover:border-white/15 active:scale-[0.97] transition-all duration-150"
              >
                📝 Exam Papers
              </a>
            </div>

            {/* Quick stats */}
            <div className="flex gap-8 mt-10 pt-8 border-t border-slate-800/50">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 text-sm">
                  📄
                </div>
                <div>
                  <div className="text-lg font-bold text-white">{pages.length}</div>
                  <div className="text-[11px] text-slate-500">Resources</div>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 text-sm">
                  📂
                </div>
                <div>
                  <div className="text-lg font-bold text-white">{categories.length}</div>
                  <div className="text-[11px] text-slate-500">Categories</div>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 text-sm">
                  🔍
                </div>
                <div>
                  <div className="text-lg font-bold text-emerald-400">AI</div>
                  <div className="text-[11px] text-slate-500">Smart Search</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Category Filter Header ── */}
      {activeCategoryName && (
        <div className="mb-8">
          <a href="/wiki" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-300 transition-colors mb-2">
            ← Wiki Brain
          </a>
          <h1 className="text-2xl font-bold text-white">{activeCategoryName}</h1>
          <p className="text-sm text-slate-500 mt-1">
            {categories.find((c) => c.name === activeCategoryName)?.description}
          </p>
        </div>
      )}

      {/* ── Category Pills ── */}
      <div className="flex flex-wrap items-center gap-2 mb-8">
        {/* All */}
        <a
          href="/wiki"
          className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[13px] font-medium transition-all duration-150 ${
            !params.category
              ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25'
              : 'bg-slate-800/60 text-slate-400 border border-slate-700/40 hover:text-slate-200 hover:border-slate-600/50'
          }`}
        >
          📚 All Pages
        </a>

        {/* Category pills */}
        {categories.map((cat) => (
          <a
            key={cat.id}
            href={`/wiki?category=${cat.slug}`}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[13px] font-medium transition-all duration-150 ${
              params.category === cat.slug
                ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25'
                : 'bg-slate-800/60 text-slate-400 border border-slate-700/40 hover:text-slate-200 hover:border-slate-600/50'
            }`}
          >
            {cat.icon} {cat.name}
          </a>
        ))}

        {/* Separator */}
        <div className="w-px h-5 bg-slate-700/50 mx-1" />

        {/* Action pills (different style) */}
        <a
          href="/wiki/skills"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[13px] font-medium
                   bg-purple-500/10 text-purple-400 border border-purple-500/20
                   hover:bg-purple-500/20 hover:border-purple-500/30 transition-all duration-150"
        >
          🎯 Skills
        </a>
        <a
          href="/wiki/new"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[13px] font-semibold
                   bg-indigo-500/15 text-indigo-400 border border-indigo-500/25
                   hover:bg-indigo-500/25 hover:text-indigo-300 transition-all duration-150"
        >
          + New
        </a>
      </div>

      {/* ── Search Bar ── */}
      <form className="relative mb-8" action="/wiki" method="get">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm">🔍</span>
        <input
          type="text"
          name="search"
          placeholder="Search the Wiki Brain by title or content…"
          defaultValue={params.search || ''}
          className="w-full bg-slate-800/40 border border-slate-700/40 rounded-xl pl-10 pr-4 py-3.5 text-sm text-slate-200
                   placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/40 focus:bg-slate-800/60
                   transition-all duration-200"
        />
        {params.category && <input type="hidden" name="category" value={params.category} />}
      </form>

      {/* ── Results Header ── */}
      <div className="flex items-center justify-between mb-5">
        <span className="text-sm text-slate-500 font-medium">
          {params.search
            ? `Search results for "${params.search}"`
            : `${pages.length} resource${pages.length !== 1 ? 's' : ''}`}
        </span>
        {!params.search && pages.length > 0 && (
          <span className="text-[11px] text-slate-600">Most recent first</span>
        )}
      </div>

      {/* ── Page Grid ── */}
      {pages.length === 0 ? (
        <div className="text-center py-24">
          <div className="text-6xl mb-5 opacity-30">🧠</div>
          <h3 className="text-lg text-slate-400 font-semibold mb-2">
            {params.search ? 'No results found' : 'The Brain is empty'}
          </h3>
          <p className="text-sm text-slate-600 mb-8 max-w-sm mx-auto leading-relaxed">
            {params.search
              ? `Nothing matched "${params.search}". Try different keywords or browse by category.`
              : 'Start building your school&apos;s knowledge library. Add exam papers, worksheets, or study notes — the Brain gets smarter with every contribution.'}
          </p>
          {!params.search && (
            <a
              href="/wiki/new"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-500 text-white text-sm font-semibold
                       hover:bg-indigo-400 active:scale-[0.97] transition-all duration-150
                       shadow-lg shadow-indigo-500/25"
            >
              + Add Your First Resource
            </a>
          )}

          {/* Quick access: show category links as fallback when empty */}
          {!params.search && (
            <div className="mt-10 pt-8 border-t border-slate-800/50">
              <p className="text-xs text-slate-600 mb-4 uppercase tracking-wide font-semibold">Browse by Category</p>
              <div className="flex flex-wrap justify-center gap-2">
                {categories.map((cat) => (
                  <a
                    key={cat.id}
                    href={`/wiki?category=${cat.slug}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm bg-slate-800/40 border border-slate-700/40 text-slate-400
                             hover:text-slate-200 hover:border-slate-600/50 transition-all duration-150"
                  >
                    {cat.icon} {cat.name}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pages.map((page) => (
            <WikiCard key={page.id} page={page} />
          ))}
        </div>
      )}
    </div>
  )
}