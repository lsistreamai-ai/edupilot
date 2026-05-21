// app/wiki/page.tsx — Wiki Brain Homepage
// Design system: automation-demos.vercel.app (faithful recreation)
// Key elements: backdrop-blur cards, colored badges, entrance animation, workflow visuals

import { getCategories, getWikiPages } from '@/lib/wiki'
import WikiCard from '@/components/WikiCard'
import { HeroParticles } from '@/components/HeroParticles'

export const dynamic = 'force-dynamic'

interface Props {
  searchParams: Promise<{ category?: string; search?: string }>
}

const CATEGORY_COLORS: Record<string, string> = {
  'exam-papers': 'from-pink-500/20 to-pink-600/20 text-pink-300 border-pink-500/30',
  'curriculum': 'from-blue-500/20 to-blue-600/20 text-blue-300 border-blue-500/30',
  'worksheets': 'from-emerald-500/20 to-emerald-600/20 text-emerald-300 border-emerald-500/30',
  'study-notes': 'from-purple-500/20 to-purple-600/20 text-purple-300 border-purple-500/30',
  'answer-keys': 'from-amber-500/20 to-amber-600/20 text-amber-300 border-amber-500/30',
}

const CATEGORY_BG: Record<string, string> = {
  'exam-papers': 'bg-pink-500/10 border-pink-500/20 text-pink-300',
  'curriculum': 'bg-blue-500/10 border-blue-500/20 text-blue-300',
  'worksheets': 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300',
  'study-notes': 'bg-purple-500/10 border-purple-500/20 text-purple-300',
  'answer-keys': 'bg-amber-500/10 border-amber-500/20 text-amber-300',
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
        <section className="min-h-[50vh] sm:min-h-[60vh] flex items-center justify-center text-center px-4 py-12 sm:py-0 relative overflow-hidden">
          {/* Background particles */}
          <HeroParticles />

          <div className="max-w-3xl relative z-10">
            {/* Badge */}
            <div className="animate-fade-in">
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 mb-4 sm:mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-teal-400">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
                <span className="text-xs sm:text-sm text-teal-300">Knowledge Base</span>
              </div>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight animate-fade-in-delay-1">
              Resources That Teach{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-400">
                While You Sleep
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg md:text-xl text-slate-400 mb-6 sm:mb-8 px-2 animate-fade-in-delay-2">
              A searchable library of exam papers, curriculum guides, worksheets and study notes
              — organised by subject and mapped to skills.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center animate-fade-in-delay-3">
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
        <div className="flex flex-wrap gap-2 justify-center mb-6 sm:mb-8 px-2">
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
          {categories.map((cat) => {
            const active = params.category === cat.slug
            const colors = CATEGORY_BG[cat.slug] || ''
            return (
              <a
                key={cat.id}
                href={`/wiki?category=${cat.slug}`}
                className={`inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                  active
                    ? `${colors}`
                    : 'bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:border-slate-600'
                }`}
              >
                {cat.icon} {cat.name}
              </a>
            )
          })}
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
          className="w-full bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-lg px-4 py-3 text-sm sm:text-base text-slate-200
                   placeholder:text-slate-600 focus:outline-none focus:border-teal-500/30 focus:bg-slate-800/60
                   transition-all duration-200"
        />
        {params.category && <input type="hidden" name="category" value={params.category} />}
      </form>

      {/* ── Results header ── */}
      <div className="flex items-center justify-between mb-6 px-2">
        <h2 className="text-2xl sm:text-3xl font-bold text-white">
          {params.search
            ? `Results for "${params.search}"`
            : pages.length > 0
              ? 'Resources'
              : 'Resources'}
        </h2>
      </div>

      {/* ── Empty state ── */}
      {pages.length === 0 ? (
        <div className="text-center py-12 sm:py-16">
          {!params.search ? (
            <>
              <p className="text-slate-400 text-sm sm:text-base max-w-md mx-auto mb-8">
                Click &quot;Add a Resource&quot; to start building your school&apos;s knowledge library.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-10">
                <a
                  href="/wiki/new"
                  className="px-5 sm:px-6 py-2.5 sm:py-3 bg-teal-500 text-slate-900 font-medium rounded-lg hover:bg-teal-400 transition-colors text-sm sm:text-base"
                >
                  Add Your First Resource
                </a>
              </div>
            </>
          ) : (
            <>
              <p className="text-slate-400 text-sm max-w-md mx-auto mb-6">
                Nothing matched &ldquo;{params.search}&rdquo;. Try a different keyword.
              </p>
              <a href="/wiki" className="text-sm text-teal-400 hover:text-teal-300 transition-colors">
                ← Back to all resources
              </a>
            </>
          )}
        </div>
      ) : (
        /* ── Results Grid ── */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {pages.map((page, i) => (
            <div key={page.id} className="animate-fade-in-card" style={{ animationDelay: `${i * 100}ms` }}>
              <WikiCard page={page} catColors={CATEGORY_COLORS[page.category?.slug || ''] || undefined} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}