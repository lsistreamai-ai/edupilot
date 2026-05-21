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
      {/* Hero Section — only on main page (no category filter) */}
      {!params.category && (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-950/60 via-slate-900/80 to-slate-950 mb-8 border border-indigo-500/10">
          {/* Globe */}
          <div className="absolute right-0 top-0 w-[500px] h-[400px] opacity-60">
            <GlobeBackground />
          </div>

          <div className="relative z-10 px-8 py-12 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium mb-4">
              <span>🧠</span>
              AI-Powered Knowledge Hub
            </div>

            <h1 className="text-3xl font-bold text-white mb-3">
              Wiki Brain
            </h1>
            <p className="text-lg text-slate-300 mb-2 leading-relaxed">
              Your school's central knowledge repository — like a second brain for your teaching team.
            </p>
            <p className="text-sm text-slate-500 leading-relaxed max-w-lg">
              Store, organize, and instantly find exam papers, curriculum guides, worksheets, and study notes. 
              The Wiki Brain grows smarter with every document your teachers add. Search across all subjects, 
              collaborate on materials, and never lose a resource again.
            </p>

            <div className="flex gap-3 mt-6">
              <a
                href="/wiki/new"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-500 text-white text-sm font-medium hover:bg-indigo-600 transition-colors shadow-lg shadow-indigo-500/20"
              >
                + Add Knowledge
              </a>
              <a
                href="?category=exam-papers"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/30 text-slate-300 text-sm font-medium hover:bg-slate-800 hover:border-slate-600/30 transition-colors"
              >
                📝 Browse Exams
              </a>
            </div>

            {/* Quick stats */}
            <div className="flex gap-6 mt-8">
              <div>
                <div className="text-xl font-semibold text-white">{pages.length}</div>
                <div className="text-xs text-slate-500">Resources</div>
              </div>
              <div>
                <div className="text-xl font-semibold text-white">{categories.length}</div>
                <div className="text-xs text-slate-500">Categories</div>
              </div>
              <div>
                <div className="text-xl font-semibold text-green-400">∞</div>
                <div className="text-xs text-slate-500">AI Search</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Category filter header */}
      {activeCategoryName && (
        <div className="mb-6">
          <a href="/wiki" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">
            ← Wiki Brain
          </a>
          <h1 className="text-2xl font-bold text-white mt-1">{activeCategoryName}</h1>
          <p className="text-sm text-slate-500 mt-1">
            {categories.find((c) => c.name === activeCategoryName)?.description}
          </p>
        </div>
      )}

      {/* Category pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        <a
          href="/wiki"
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            !params.category
              ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
              : 'bg-slate-800/50 text-slate-400 border border-slate-700/30 hover:border-slate-600/30 hover:text-slate-300'
          }`}
        >
          All
        </a>
        {categories.map((cat) => (
          <a
            key={cat.id}
            href={`/wiki?category=${cat.slug}`}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              params.category === cat.slug
                ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                : 'bg-slate-800/50 text-slate-400 border border-slate-700/30 hover:border-slate-600/30 hover:text-slate-300'
            }`}
          >
            {cat.icon} {cat.name}
          </a>
        ))}
        <a
          href="/wiki/new"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/20 transition-colors"
        >
          + New
        </a>
      </div>

      {/* Search bar */}
      <form className="mb-6" action="/wiki" method="get">
        <input
          type="text"
          name="search"
          placeholder="Search the Wiki Brain by title or content..."
          defaultValue={params.search || ''}
          className="w-full bg-slate-800/30 border border-slate-700/30 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/40 transition-colors"
        />
        {params.category && <input type="hidden" name="category" value={params.category} />}
      </form>

      {/* Results header */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-slate-500">
          {params.search ? `Search results for "${params.search}"` : `${pages.length} resources`}
        </span>
      </div>

      {/* Page Grid */}
      {pages.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">🧠</div>
          <h3 className="text-lg text-slate-400 font-medium">
            {params.search ? 'No results found' : 'The Wiki Brain is empty'}
          </h3>
          <p className="text-sm text-slate-600 mt-2 max-w-sm mx-auto">
            {params.search
              ? `Nothing matched "${params.search}". Try different keywords.`
              : 'Start feeding the brain — add exam papers, worksheets, or study notes and build your knowledge base.'}
          </p>
          {!params.search && (
            <a
              href="/wiki/new"
              className="inline-flex items-center gap-2 mt-4 px-4 py-2.5 rounded-xl bg-indigo-500 text-white text-sm font-medium hover:bg-indigo-600 transition-colors"
            >
              + Add Your First Resource
            </a>
          )}
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {pages.map((page) => (
            <WikiCard key={page.id} page={page} />
          ))}
        </div>
      )}
    </div>
  )
}