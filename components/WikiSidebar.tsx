// components/WikiSidebar.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { WikiCategory, searchWikiPages, SearchResult } from '@/lib/wiki'

interface Props {
  categories: WikiCategory[]
  activeCategory?: string
}

export default function WikiSidebar({ categories, activeCategory }: Props) {
  const [search, setSearch] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [searching, setSearching] = useState(false)

  useEffect(() => {
    if (search.length < 2) {
      setResults([])
      return
    }
    const timer = setTimeout(async () => {
      setSearching(true)
      const data = await searchWikiPages(search)
      setResults(data)
      setSearching(false)
    }, 300)
    return () => clearTimeout(timer)
  }, [search])

  return (
    <aside className="w-64 shrink-0">
      <div className="sticky top-6 space-y-6">
        {/* Search */}
        <div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search wiki..."
            className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/50 transition-colors"
          />
          {search.length >= 2 && (
            <div className="mt-2 space-y-1">
              {searching ? (
                <p className="text-xs text-slate-500 px-1">Searching...</p>
              ) : results.length === 0 ? (
                <p className="text-xs text-slate-500 px-1">No results</p>
              ) : (
                results.map((r: SearchResult) => (
                  <Link
                    key={r.id}
                    href={`/wiki/${r.slug}`}
                    className="block px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-800/50 hover:text-white transition-colors truncate"
                  >
                    {r.title}
                  </Link>
                ))
              )}
            </div>
          )}
        </div>

        {/* Categories */}
        <div>
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
            Categories
          </h3>
          <nav className="space-y-1">
            <Link
              href="/wiki"
              className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                !activeCategory
                  ? 'bg-indigo-500/10 text-indigo-400 font-medium'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
              }`}
            >
              All Pages
            </Link>
            {categories.map((cat: WikiCategory) => (
              <Link
                key={cat.id}
                href={`/wiki?category=${cat.slug}`}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                  activeCategory === cat.slug
                    ? 'bg-indigo-500/10 text-indigo-400 font-medium'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* New Page */}
        <Link
          href="/wiki/new"
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium hover:bg-indigo-500/20 transition-colors"
        >
          + New Page
        </Link>
      </div>
    </aside>
  )
}