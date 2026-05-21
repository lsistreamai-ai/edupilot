// app/wiki/new/page.tsx — Create New Wiki Page
'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createWikiPage, getCategories, WikiCategory } from '@/lib/wiki'
import WikiEditor from '@/components/WikiEditor'
import { useEffect } from 'react'

export default function NewWikiPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<WikiCategory[]>([])
  const [form, setForm] = useState({ title: '', content: '', tags: [] as string[] })
  const [slug, setSlug] = useState('')
  const [categoryId, setCategoryId] = useState<number | undefined>()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    getCategories().then(setCategories)
  }, [])

  // Auto-generate slug from title
  const handleTitleChange = (title: string) => {
    const s = title
      .toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fff]+/g, '-')
      .replace(/^-|-$/g, '')
    setSlug(s)
  }

  const handleEditorChange = useCallback((data: { title: string; content: string; tags: string[] }) => {
    setForm(data)
    if (data.title) handleTitleChange(data.title)
  }, [])

  const handleSave = async () => {
    if (!form.title || !form.content) {
      setError('Title and content are required')
      return
    }
    setSaving(true)
    setError('')

    const { data, error } = await createWikiPage({
      title: form.title,
      slug,
      content: form.content,
      category_id: categoryId,
      tags: form.tags,
    })

    if (error) {
      setError(error.message || 'Failed to create page')
      setSaving(false)
    } else {
      router.push(`/wiki/${slug}`)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link href="/wiki" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">
            ← Back to Wiki
          </Link>
          <h1 className="text-2xl font-bold text-white mt-1">New Wiki Page</h1>
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
            {saving ? 'Saving...' : 'Publish'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Slug preview */}
      {slug && (
        <div className="mb-4 text-xs text-slate-600">
          Slug: <code className="text-slate-500">/wiki/{slug}</code>
        </div>
      )}

      {/* Editor */}
      <div className="bg-slate-800/30 border border-slate-700/30 rounded-xl p-6">
        <WikiEditor onChange={handleEditorChange} />
      </div>
    </div>
  )
}