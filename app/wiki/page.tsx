// app/wiki/page.tsx — Wiki Brain Homepage
// Design: matches automation-demos.vercel.app
// Inter font, Lucide icons, connected pill cards, entrance animations

import { getCategories, getWikiPages } from '@/lib/wiki'
import { Layers, Search, Plus, BookOpen, Sparkles } from 'lucide-react'
import Link from 'next/link'
import WikiCard from '@/components/WikiCard'
import { HeroParticles } from '@/components/HeroParticles'

export const dynamic = 'force-dynamic'

const CATEGORY_COLORS: Record<string, string> = {
  'exam-papers': 'bg-pink-500/20 text-pink-300 border-pink-500/30',
  'curriculum': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  'worksheets': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  'study-notes': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  'answer-keys': 'bg-amber-500/20 text-amber-300 border-amber-500/30',
}

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
      {/* ═══════════ Hero ═══════════ */}
      {!params.category && (
        <section className="min-h-[50vh] sm:min-h-[60vh] flex items-center justify-center text-center px-4 py-12 sm:py-0 relative overflow-hidden">
          <HeroParticles />

          <div className="max-w-3xl relative z-10">
            {/* Badge */}
            <div style={{ opacity: 0, transform: 'translateY(20px)' }}>
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 mb-4 sm:mb-6">
                <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-teal-400" />
                <span className="text-xs sm:text-sm text-teal-300">Knowledge Base</span>
              </div>
            </div>

            {/* Headline */}
            <h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight"
              style={{ opacity: 0, transform: 'translateY(20px)' }}
            >
              Resources That Teach{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-400">
                While You Sleep
              </span>
            </h1>

            {/* Subtitle */}
            <p
              className="text-base sm:text-lg md:text-xl text-slate-400 mb-6 sm:mb-8 px-2"
              style={{ opacity: 0, transform: 'translateY(20px)' }}
            >
              A searchable library of exam papers, curriculum guides, worksheets and study notes
              — organised by subject and mapped to skills.
            </p>

            {/* CTAs */}
            <div
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center"
              style={{ opacity: 0, transform: 'translateY(20px)' }}
            >
              <Link
                href="/wiki/new"
                className="px-5 sm:px-6 py-2.5 sm:py-3 bg-teal-500 text-slate-900 font-medium rounded-lg hover:bg-teal-400 transition-colors text-sm sm:text-base inline-flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add a Resource
              </Link>
              <Link
                href="/wiki/skills"
                className="px-5 sm:px-6 py-2.5 sm:py-3 bg-slate-800 text-white font-medium rounded-lg border border-slate-700 hover:border-slate-600 transition-colors text-sm sm:text-base inline-flex items-center justify-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                Skills Map
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════ Category header (when filtered) ═══════════ */}
      {activeCategoryName && (
        <div className="mb-8 sm:mb-10">
          <Link href="/wiki" className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-slate-200 transition-colors mb-3">
            ← Wiki Brain
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">{activeCategoryName}</h1>
          <p className="text-sm text-slate-500 mt-1">
            {categories.find((c) => c.name === activeCategoryName)?.description}
          </p>
        </div>
      )}

      {/* ═══════════ Category pills ═══════════ */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 justify-center mb-6 sm:mb-8 px-2">
          <Link
            href="/wiki"
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              !params.category
                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                : 'bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:border-slate-600'
            }`}
          >
            All
          </Link>
          {categories.map((cat) => {
            const active = params.category === cat.slug
            const colors = CATEGORY_COLORS[cat.slug] || ''
            return (
              <Link
                key={cat.id}
                href={`/wiki?category=${cat.slug}`}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                  active ? colors : 'bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:border-slate-600'
                }`}
              >
                {cat.name}
              </Link>
            )
          })}
          <Link
            href="/wiki/skills"
            className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium
                     bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:border-slate-600 transition-all"
          >
            Skills
          </Link>
        </div>
      )}

      {/* ═══════════ Search ═══════════ */}
      <form className="mb-8 sm:mb-10 max-w-xl mx-auto" action="/wiki" method="get">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 pointer-events-none" />
          <input
            type="text"
            name="search"
            placeholder="Search by title, subject, or keyword…"
            defaultValue={params.search || ''}
            className="w-full bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-lg pl-11 pr-4 py-3 text-sm sm:text-base text-slate-200
                     placeholder:text-slate-600 focus:outline-none focus:border-teal-500/30 focus:bg-slate-800/60
                     transition-all duration-200"
          />
        </div>
        {params.category && <input type="hidden" name="category" value={params.category} />}
      </form>

      {/* ═══════════ Results header ═══════════ */}
      <div className="flex items-center justify-between mb-6 px-2">
        <h2 className="text-2xl sm:text-3xl font-bold text-white">
          {params.search ? `Results for "${params.search}"` : 'Resources'}
        </h2>
      </div>

      {/* ═══════════ Empty state ═══════════ */}
      {pages.length === 0 ? (
        <div className="text-center py-12 sm:py-20">
          <p className="text-slate-400 text-center mb-6 sm:mb-8 text-sm sm:text-base px-2">
            {params.search
              ? `Nothing matched "${params.search}". Try a different keyword.`
              : 'Click "Add a Resource" to start building your school\'s knowledge library.'}
          </p>
          {!params.search && (
            <Link
              href="/wiki/new"
              className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-teal-500 text-slate-900 font-medium rounded-lg hover:bg-teal-400 transition-colors text-sm sm:text-base"
            >
              <Plus className="w-4 h-4" />
              Add Your First Resource
            </Link>
          )}
          {params.search && (
            <Link href="/wiki" className="text-sm text-teal-400 hover:text-teal-300 transition-colors">
              ← Back to all resources
            </Link>
          )}
        </div>
      ) : (
        /* ═══════════ Results Grid ═══════════ */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {pages.map((page) => {
            const catColor = CATEGORY_COLORS[page.category?.slug || ''] || undefined
            return (
              <WikiCard key={page.id} page={page} catColor={catColor} />
            )
          })}
        </div>
      )}
    </div>
  )
}