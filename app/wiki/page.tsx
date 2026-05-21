// app/wiki/page.tsx — Wiki Brain Homepage
// Design direction: warm editorial library.
// Golden/amber tones, intentional whitespace, typography-first.
// Knowledge repositories should feel calm, not busy.

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
      {/* ── Hero — editorial, restrained ── */}
      {!params.category && (
        <section className="relative mb-16 pb-0">
          {/* Subtle globe — background texture, not the main event */}
          <div className="absolute -top-16 -right-12 w-[460px] h-[460px] opacity-[0.12] pointer-events-none overflow-hidden">
            <GlobeBackground />
          </div>

          <div className="relative max-w-2xl pt-8">
            {/* Eyebrow — warm amber, not sci-fi indigo */}
            <p className="text-xs tracking-[0.2em] uppercase text-amber-500/70 font-medium mb-6">
              Knowledge Base
            </p>

            {/* Title — typography as the hero. No emoji, no badge. */}
            <h1 className="text-4xl sm:text-5xl font-serif font-bold text-white tracking-[-0.02em] leading-[1.05] mb-5">
              The school&apos;s<br />
              <span className="text-amber-400">collective intelligence.</span>
            </h1>

            {/* One clear sentence. No paragraph of selling points. */}
            <p className="text-base text-stone-400 leading-relaxed max-w-lg">
              A searchable library of exam papers, curriculum guides, worksheets and study notes
              — organised by subject, mapped to skills, and built by your teachers.
            </p>

            {/* Primary action only. Secondary actions moved below. */}
            <div className="mt-8">
              <a
                href="/wiki/new"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 text-amber-950 text-sm font-semibold
                         hover:bg-amber-400 active:scale-[0.97] transition-all duration-150
                         shadow-sm"
              >
                Add your first resource
                <span className="text-amber-700">→</span>
              </a>
            </div>
          </div>
        </section>
      )}

      {/* ── Category Filter Header ── */}
      {activeCategoryName && (
        <div className="mb-10">
          <a href="/wiki" className="inline-flex items-center gap-1 text-sm text-stone-500 hover:text-stone-300 transition-colors mb-3">
            ← Wiki Brain
          </a>
          <h1 className="text-2xl font-semibold text-white">{activeCategoryName}</h1>
          <p className="text-sm text-stone-500 mt-1">
            {categories.find((c) => c.name === activeCategoryName)?.description}
          </p>
        </div>
      )}

      {/* ── Navigation — category pills + secondary actions ── */}
      <div className="flex flex-wrap items-center gap-2 mb-10">
        {/* All */}
        <a
          href="/wiki"
          className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[13px] font-medium transition-all duration-150 ${
            !params.category
              ? 'bg-amber-500 text-amber-950'
              : 'bg-stone-800/40 text-stone-400 border border-stone-700/30 hover:text-stone-200 hover:border-stone-600/40'
          }`}
        >
          All
        </a>

        {/* Category pills */}
        {categories.map((cat) => (
          <a
            key={cat.id}
            href={`/wiki?category=${cat.slug}`}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[13px] font-medium transition-all duration-150 ${
              params.category === cat.slug
                ? 'bg-amber-500 text-amber-950'
                : 'bg-stone-800/40 text-stone-400 border border-stone-700/30 hover:text-stone-200 hover:border-stone-600/40'
            }`}
          >
            {cat.icon} {cat.name}
          </a>
        ))}

        {/* Separator */}
        <span className="w-px h-5 bg-stone-700/40 mx-1.5" aria-hidden="true" />

        {/* Skills link */}
        <a
          href="/wiki/skills"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[13px] font-medium
                   text-stone-400 border border-stone-700/30 hover:text-stone-200 hover:border-stone-600/40
                   transition-all duration-150"
        >
          Skills map
        </a>
      </div>

      {/* ── Search — calm, inviting ── */}
      <form className="mb-10" action="/wiki" method="get">
        <div className="relative">
          <input
            type="text"
            name="search"
            placeholder="Search by title, subject, or keyword…"
            defaultValue={params.search || ''}
            className="w-full bg-stone-800/30 border border-stone-700/30 rounded-xl px-4 py-3.5 text-sm text-stone-200
                     placeholder:text-stone-600 focus:outline-none focus:border-amber-500/30 focus:bg-stone-800/40
                     transition-all duration-200"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-600 text-xs pointer-events-none">
            Press enter
          </span>
        </div>
        {params.category && <input type="hidden" name="category" value={params.category} />}
      </form>

      {/* ── Results header — restrained, no filler stats ── */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-sm text-stone-500">
          {params.search
            ? `Results for &ldquo;${params.search}&rdquo;`
            : pages.length > 0
              ? `${pages.length} resource${pages.length !== 1 ? 's' : ''}`
              : 'No resources yet'}
        </span>
        {!params.search && pages.length > 0 && (
          <span className="text-xs text-stone-700">Most recent</span>
        )}
      </div>

      {/* ── Empty state — editorial, warm ── */}
      {pages.length === 0 ? (
        <div className="text-center py-20">
          {!params.search && (
            <>
              <p className="text-sm text-stone-500 leading-relaxed max-w-md mx-auto">
                This is where your school&apos;s knowledge lives. Start by adding an exam paper,
                a worksheet, or a curriculum guide — anything your teachers want to find again.
              </p>

              {/* Category shortcuts — the real entry points */}
              <div className="mt-10 pt-8 border-t border-stone-800/30">
                <p className="text-xs text-stone-600 mb-5 uppercase tracking-widest font-medium">Browse by subject</p>
                <div className="flex flex-wrap justify-center gap-2.5">
                  {categories.map((cat) => (
                    <a
                      key={cat.id}
                      href={`/wiki?category=${cat.slug}`}
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-stone-800/20 border border-stone-800/40 text-stone-400 text-sm
                               hover:text-stone-200 hover:border-stone-700/40 hover:bg-stone-800/30
                               transition-all duration-200"
                    >
                      <span className="text-base">{cat.icon}</span>
                      <span>{cat.name}</span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Quick links row */}
              <div className="mt-10 flex items-center justify-center gap-6 text-xs text-stone-600">
                <a href="/wiki/skills" className="hover:text-stone-400 transition-colors">
                  Skills map →
                </a>
                <span className="text-stone-800">·</span>
                <a href="/wiki/new" className="hover:text-stone-400 transition-colors">
                  Add resource →
                </a>
              </div>
            </>
          )}

          {/* Search-specific empty state */}
          {params.search && (
            <>
              <p className="text-stone-500 text-sm max-w-md mx-auto leading-relaxed">
                Nothing matched &ldquo;{params.search}&rdquo;. Try a different keyword or browse by category.
              </p>
              <div className="mt-6">
                <a href="/wiki" className="text-sm text-amber-500 hover:text-amber-400 transition-colors">
                  ← Back to all resources
                </a>
              </div>
            </>
          )}
        </div>
      ) : (
        /* ── Results grid ── */
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pages.map((page) => (
            <WikiCard key={page.id} page={page} />
          ))}
        </div>
      )}

      {/* ── Footer — quiet, secondary actions ── */}
      {!params.category && !params.search && (
        <div className="mt-20 pt-10 border-t border-stone-800/20 flex items-center gap-8 text-sm text-stone-600">
          <a href="/wiki/skills" className="hover:text-stone-400 transition-colors">
            🎯 Skills map
          </a>
          <a href="/wiki/new" className="hover:text-stone-400 transition-colors">
            + New resource
          </a>
        </div>
      )}
    </div>
  )
}