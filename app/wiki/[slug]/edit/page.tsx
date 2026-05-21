// app/wiki/[slug]/edit/page.tsx — Edit Wiki Page
'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { getWikiPage, updateWikiPage, saveRevision, getCategories, WikiCategory } from '@/lib/wiki'
import WikiEditor from '@/components/WikiEditor'

export default function EditWikiPage() {
  const router = useRouter()
  const params = useParams()
  const slug = params.slug as string
  const [categories, setCategories] = useState<WikiCategory[]>([])
  const [page, setPage] = useState<any>(null)
  const [form, setForm] = useState({ title: '', content: '', tags: [] as string[] })
  const [categoryId, setCategoryId] = useState<number | undefined>()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getWikiPage(slug), getCategories()]).then(([p, cats]) => {
      if (!p) {
        setError('Page not found')
        setLoading(false)
        return
      }
      setPage(p)
      setCategories(cats)
      setForm({ title: p.title, content: p.content, tags: p.tags || [] })
      setCategoryId(p.category_id || undefined)
      setLoading(false)
    })
  }, [slug])

  const handleEditorChange = useCallback((data: { title: string; content: string; tags: string[] }) => {
    setForm(data)
  }, [])

  const handleSave = async () => {
    if (!form.title || !form.content) {
      setError('Title and content are required')
      return
    }
    setSaving(true)
    setError('')

    // Save revision before updating
    if (page) {
      await saveRevision(page.id, page.content, 'Updated content')
    }

    const { error } = await updateWikiPage(page.id, {
      title: form.title,
      content: form.content,
      category_id: categoryId ?? null,
      tags: form.tags,
    })

    if (error) {
      setError(error.message || 'Failed to update')
      setSaving(false)
    } else {
      router.push(`/wiki/${slug}`)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (error && !page) {
    return (
      <div className="text-center py-20">
        <p className="text-red-400">{error}</p>
        <Link href="/wiki" className="text-sm text-indigo-400 mt-4 inline-block hover:underline">
          ← Back to Wiki
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link href={`/wiki/${slug}`} className="text-sm text-slate-500 hover:text-slate-300 transition-colors">
            ← Back to page
          </Link>
          <h1 className="text-2xl font-bold text-white mt-1">Edit: {page.title}</h1>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={categoryId ?? ''}
            onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : undefined)}
            className="bg-slate-800/50 border border-slate-700/30 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-indigo-500/30"
          >
            <option value="">No category</option>
            {categories.map((c: WikiCategory) => (
              <option key={c.id} value={c.id}>
                {c.icon} {c.name}
              </option>
            ))}
          </select>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 rounded-xl bg-indigo-500 text-white text-sm font-medium hover:bg-indigo-600 disabled:opacity-50 transition-colors"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Editor */}
      <div className="bg-slate-800/30 border border-slate-700/30 rounded-xl p-6">
        <WikiEditor
          initialTitle={page.title}
          initialContent={page.content}
          initialTags={page.tags || []}
          onChange={handleEditorChange}
        />
      </div>
    </div>
  )
}