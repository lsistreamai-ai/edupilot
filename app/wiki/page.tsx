// app/wiki/page.tsx — Wiki Brain
// HTML5 Canvas 3D globe as hero element — not hidden, front and center

import { getCategories, getWikiPages } from '@/lib/wiki'
import { Layers, Search, Plus, MapPin, Sparkles } from 'lucide-react'
import Link from 'next/link'
import WikiCard from '@/components/WikiCard'
import GlobeScene from '@/components/GlobeScene'

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
  const { pages } = await getWikiPages({ category: params.category, search: params.search })

  const activeCategoryName = params.category
    ? categories.find((c) => c.slug === params.category)?.name
    : null

  return (
    <div className="max-w-6xl mx-auto">
      {/* ═══════════ Hero with Globe ═══════════ */}
      {!params.category && (
        <section className="min-h-[60vh] sm:min-h-[70vh] flex items-center px-4 py-12 sm:py-0">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center w-full">
            {/* Left: Text + CTAs */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 mb-4 sm:mb-6">
                <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-teal-400" />
                <span className="text-xs sm:text-sm text-teal-300">Knowledge Base</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-4 sm:mb-6 leading-tight tracking-tight">
                Your School&apos;s{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-400">
                  Second Brain
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-400 mb-6 sm:mb-8 max-w-md mx-auto lg:mx-0 leading-relaxed">
                A living library of exam papers, curriculum guides, worksheets and study notes
                — mapped to skills, searchable in seconds, built by your teachers.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                <Link
                  href="/wiki/new"
                  className="px-6 py-3 bg-teal-500 text-slate-900 font-semibold rounded-xl hover:bg-teal-400 transition-all hover:shadow-lg hover:shadow-teal-500/20 text-sm sm:text-base inline-flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add a Resource
                </Link>
                <Link
                  href="/wiki/skills"
                  className="px-6 py-3 bg-slate-800/80 text-white font-semibold rounded-xl border border-slate-700 hover:border-slate-600 hover:bg-slate-800 transition-all text-sm sm:text-base inline-flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Explore Skills
                </Link>
              </div>
            </div>

            {/* Right: 3D Globe */}
            <div className="h-[350px] sm:h-[450px] lg:h-[500px] relative flex items-center justify-center">
              <GlobeScene />
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
        </div>
      )}

      {/* ═══════════ Category pills ═══════════ */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 justify-center mb-6 sm:mb-8">
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
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
          <input
            type="text"
            name="search"
            placeholder="Search exams, worksheets, study guides…"
            defaultValue={params.search || ''}
            className="w-full bg-slate-800/60 border border-slate-700/40 rounded-xl pl-11 pr-4 py-3 text-sm sm:text-base text-slate-200
                     placeholder:text-slate-600 focus:outline-none focus:border-teal-500/40 focus:bg-slate-800/80
                     transition-all duration-200"
          />
        </div>
        {params.category && <input type="hidden" name="category" value={params.category} />}
      </form>

      {/* ═══════════ Results header ═══════════ */}
      {params.search && (
        <h2 className="text-xl sm:text-2xl font-bold text-white text-center mb-6 sm:mb-8">
          Results for &ldquo;{params.search}&rdquo;
        </h2>
      )}

      {/* ═══════════ Empty state ═══════════ */}
      {pages.length === 0 ? (
        <div className="text-center py-16 sm:py-24">
          <div className="w-16 h-16 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center mx-auto mb-6">
            <MapPin className="w-7 h-7 text-teal-400" />
          </div>
          {params.search ? (
            <>
              <p className="text-slate-400 text-sm sm:text-base mb-6">Nothing found. Try a different search term.</p>
              <Link href="/wiki" className="text-teal-400 hover:text-teal-300 transition-colors text-sm font-medium">
                ← Clear search
              </Link>
            </>
          ) : (
            <>
              <h3 className="text-xl font-semibold text-white mb-3">No resources yet</h3>
              <p className="text-slate-400 text-sm sm:text-base max-w-md mx-auto mb-8 leading-relaxed">
                Start building your school&apos;s knowledge library. Add exam papers, worksheets, study notes — anything your teachers need.
              </p>
              <Link
                href="/wiki/new"
                className="inline-flex items-center gap-2 px-6 py-3 bg-teal-500 text-slate-900 font-semibold rounded-xl hover:bg-teal-400 transition-all hover:shadow-lg hover:shadow-teal-500/20 text-sm sm:text-base"
              >
                <Plus className="w-4 h-4" />
                Add Your First Resource
              </Link>
            </>
          )}
        </div>
      ) : (
        /* ═══════════ Results Grid ═══════════ */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {pages.map((page) => {
            const catColor = CATEGORY_COLORS[page.category?.slug || ''] || undefined
            return <WikiCard key={page.id} page={page} catColor={catColor} />
          })}
        </div>
      )}
    </div>
  )
}