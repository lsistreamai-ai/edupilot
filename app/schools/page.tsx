// app/schools/page.tsx — HK Schools Directory
import { Map as MapIcon, School as SchoolIcon, Search } from 'lucide-react'
import Link from 'next/link'
import { getSchools, getDistricts, SCHOOL_TYPES, GENDERS, RELIGIONS, HK_DISTRICTS, School } from '@/lib/schools'
import SchoolCard from '@/components/SchoolCard'
import SchoolMapWrapper from '@/components/SchoolMapWrapper'

export const dynamic = 'force-dynamic'

interface Props {
  searchParams: Promise<{
    level?: string
    district?: string
    type?: string
    gender?: string
    religion?: string
    search?: string
    page?: string
    view?: string
  }>
}

export default async function SchoolsPage({ searchParams }: Props) {
  const params = await searchParams
  const page = parseInt(params.page || '1')
  const activeView = params.view || 'list' // 'list' | 'map'

  let schools: School[] = []
  let total = 0
  let totalPages = 0
  let error: string | null = null
  let districts: string[] = HK_DISTRICTS

  try {
    const result = await getSchools({
      level: (params.level as 'primary' | 'secondary') || undefined,
      district: params.district,
      school_type: params.type,
      student_gender: params.gender,
      religion: params.religion,
      search: params.search,
      page,
      limit: 24,
    })
    schools = result.schools
    total = result.total
    totalPages = result.totalPages
  } catch (e: any) {
    error = e.message || 'Failed to load schools'
  }

  try {
    const dbDistricts = await getDistricts()
    if (dbDistricts.length > 0) districts = dbDistricts
  } catch (_) {
    // Use hardcoded list
  }

  const hasFilters = params.level || params.district || params.type || params.gender || params.religion || params.search

  // Build query string helpers
  const qs = (overrides: Record<string, string | undefined>) => {
    const p = new URLSearchParams()
    for (const [k, v] of Object.entries({ level: params.level, district: params.district, type: params.type, gender: params.gender, religion: params.religion, search: params.search, view: params.view, ...overrides })) {
      if (v) p.set(k, v)
    }
    return p.toString()
  }

  const qsPage = (p: number) => qs({ page: String(p), view: params.view })

  const filterLink = (key: string, value: string) => {
    const overrides: Record<string, string> = {}
    for (const [k, v] of Object.entries({ level: params.level, district: params.district, type: params.type, gender: params.gender, religion: params.religion, search: params.search, view: params.view })) {
      if (v) overrides[k] = v
    }
    if (overrides[key] === value) {
      delete overrides[key]  // toggle off
    } else {
      overrides[key] = value
    }
    overrides.page = '1'
    return qs(overrides)
  }

  const isActive = (key: string, value: string) => {
    const current = params[key as keyof typeof params]
    return current === value
  }

  const clearFilters = () => {
    const p = new URLSearchParams()
    if (params.view) p.set('view', params.view)
    return p.toString()
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* ═══════════ Hero ═══════════ */}
      <section className="text-center pt-2 pb-6 sm:pb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 mb-4">
          <SchoolIcon className="w-3.5 h-3.5 text-teal-400" />
          <span className="text-xs sm:text-sm text-teal-300">School Explorer</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-3 leading-[1.1] tracking-tight">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-400">
            {total.toLocaleString()}
          </span>{' '}
          Hong Kong Schools
        </h1>
        <p className="text-sm sm:text-base text-slate-400 max-w-lg mx-auto">
          Explore every primary and secondary school in Hong Kong. Filter by district, type, gender, and religion.
        </p>

        {/* View toggle */}
        <div className="flex items-center gap-1 justify-center mt-4">
          <Link
            href={`/schools?${qs({ view: 'list' })}`}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all inline-flex items-center gap-1.5 ${
              activeView === 'list' ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30' : 'bg-slate-800/50 text-slate-400 border border-slate-700/50'
            }`}
          >
            <SchoolIcon className="w-3 h-3" /> List
          </Link>
          <Link
            href={`/schools?${qs({ view: 'map' })}`}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all inline-flex items-center gap-1.5 ${
              activeView === 'map' ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30' : 'bg-slate-800/50 text-slate-400 border border-slate-700/50'
            }`}
          >
            <MapIcon className="w-3 h-3" /> Map
          </Link>
        </div>
      </section>

      {/* ═══════════ Filters ═══════════ */}
      <div className="mb-6 space-y-3 mx-2 sm:mx-0">
        {/* Search */}
        <form action="/schools" method="get" className="max-w-xl mx-auto sm:mx-0">
          <div className="relative">
            <Search className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            <input
              type="text"
              name="search"
              placeholder="Search by school name…"
              defaultValue={params.search || ''}
              className="w-full bg-slate-800/60 border border-slate-700/40 rounded-xl pl-10 sm:pl-11 pr-4 py-2.5 text-sm text-slate-200
                       placeholder:text-slate-600 focus:outline-none focus:border-teal-500/40 transition-all"
            />
          </div>
          {/* Preserve other filters */}
          {params.level && <input type="hidden" name="level" value={params.level} />}
          {params.district && <input type="hidden" name="district" value={params.district} />}
          {params.type && <input type="hidden" name="type" value={params.type} />}
          {params.gender && <input type="hidden" name="gender" value={params.gender} />}
          {params.religion && <input type="hidden" name="religion" value={params.religion} />}
        </form>

        {/* Level toggle */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <Link href={`/schools?${filterLink('level', 'primary')}`}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex-shrink-0 inline-flex items-center gap-1 ${
              isActive('level', 'primary') ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 'bg-slate-800/50 text-slate-400 border border-slate-700/50'
            }`}>
            🏫 Primary
          </Link>
          <Link href={`/schools?${filterLink('level', 'secondary')}`}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex-shrink-0 inline-flex items-center gap-1 ${
              isActive('level', 'secondary') ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800/50 text-slate-400 border border-slate-700/50'
            }`}>
            🎓 Secondary
          </Link>
          <span className="w-px bg-slate-700 mx-1" />
          {/* Type */}
          {SCHOOL_TYPES.map(t => (
            <Link key={t} href={`/schools?${filterLink('type', t)}`}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex-shrink-0 ${
                isActive('type', t) ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30' : 'bg-slate-800/50 text-slate-400 border border-slate-700/50'
              }`}>
              {t}
            </Link>
          ))}
          <span className="w-px bg-slate-700 mx-1" />
          {/* Gender */}
          {GENDERS.map(g => (
            <Link key={g} href={`/schools?${filterLink('gender', g)}`}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex-shrink-0 ${
                isActive('gender', g) ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30' : 'bg-slate-800/50 text-slate-400 border border-slate-700/50'
              }`}>
              {g}
            </Link>
          ))}
        </div>
      </div>

      {/* ═══════════ Results ═══════════ */}
      {hasFilters && (
        <div className="flex items-center justify-between mb-4 mx-2 sm:mx-0">
          <p className="text-sm text-slate-400">
            <span className="text-white font-semibold">{total}</span> school{total !== 1 ? 's' : ''} found
            {hasFilters && (
              <Link href={`/schools?${clearFilters()}`} className="ml-3 text-teal-400 hover:text-teal-300 text-xs">
                Clear filters
              </Link>
            )}
          </p>
        </div>
      )}

      {error ? (
        <div className="text-center py-16 sm:py-20 mx-2">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-4">
            <SchoolIcon className="w-6 h-6 text-amber-400" />
          </div>
          <p className="text-slate-400 text-sm mb-3">Couldn&apos;t load school data</p>
          <p className="text-[11px] text-slate-600 mb-6">{error}</p>
          <p className="text-xs text-slate-500">
            Run the SQL migration in Supabase, then the import script. Both are on your Desktop.
          </p>
        </div>
      ) : activeView === 'map' ? (
        /* ═══════════ Map View ═══════════ */
        <div className="mb-8 mx-2 sm:mx-0">
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden h-[400px] sm:h-[500px] relative">
            <SchoolMapWrapper schools={schools} filters={qs({ view: 'list' })} />
          </div>
          {/* Show cards below map */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5 mt-6">
            {schools.map(s => <SchoolCard key={s.id} school={s} />)}
          </div>
        </div>
      ) : (
        /* ═══════════ List View ═══════════ */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5 mx-2 sm:mx-0 mb-8">
          {schools.map(s => <SchoolCard key={s.id} school={s} />)}
        </div>
      )}

      {/* ═══════════ Pagination ═══════════ */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mx-2 sm:mx-0 mb-12">
          {page > 1 && (
            <Link href={`/schools?${qsPage(page - 1)}`}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:border-slate-600 transition-all">
              ← Prev
            </Link>
          )}
          <span className="text-xs text-slate-500 px-2">
            {page} / {totalPages}
          </span>
          {page < totalPages && (
            <Link href={`/schools?${qsPage(page + 1)}`}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:border-slate-600 transition-all">
              Next →
            </Link>
          )}
        </div>
      )}

      {/* ═══════════ Empty state (no results) ═══════════ */}
      {!error && schools.length === 0 && hasFilters && (
        <div className="text-center py-12 sm:py-16 mx-2">
          <p className="text-slate-400 text-sm">No schools match your filters.</p>
          <Link href={`/schools?${clearFilters()}`} className="text-teal-400 hover:text-teal-300 text-sm mt-3 inline-block">
            Clear all filters
          </Link>
        </div>
      )}
    </div>
  )
}