// components/WikiEditor.tsx
'use client'

import { useState, useEffect, useCallback } from 'react'

interface Props {
  initialTitle?: string
  initialContent?: string
  initialTags?: string[]
  onChange: (data: { title: string; content: string; tags: string[] }) => void
}

export default function WikiEditor({ initialTitle = '', initialContent = '', initialTags = [], onChange }: Props) {
  const [title, setTitle] = useState(initialTitle)
  const [content, setContent] = useState(initialContent)
  const [tags, setTags] = useState(initialTags.join(', '))
  const [preview, setPreview] = useState(false)
  const [renderedPreview, setRenderedPreview] = useState('')

  const notifyChange = useCallback(() => {
    onChange({
      title,
      content,
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
    })
  }, [title, content, tags, onChange])

  useEffect(() => { notifyChange() }, [notifyChange])

  // Simple markdown preview
  useEffect(() => {
    if (!preview) return
    // We use a simple approach - just show the raw text with minimal formatting
    setRenderedPreview(
      content
        .replace(/^### (.+)$/gm, '<h3 class="text-lg font-semibold text-slate-200 mt-4 mb-2">$1</h3>')
        .replace(/^## (.+)$/gm, '<h2 class="text-xl font-semibold text-indigo-300 mt-6 mb-3">$1</h2>')
        .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-semibold text-indigo-300 mt-6 mb-3">$1</h1>')
        .replace(/^- (.+)$/gm, '<li class="text-slate-400 ml-4">• $1</li>')
        .replace(/\*\*(.+?)\*\*/g, '<strong class="text-slate-200">$1</strong>')
        .replace(/\n/g, '<br/>')
    )
  }, [preview, content])

  return (
    <div className="space-y-4">
      {/* Title */}
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Page title..."
        className="w-full bg-transparent text-2xl font-semibold text-slate-100 placeholder:text-slate-600 focus:outline-none"
      />

      {/* Tags */}
      <input
        type="text"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        placeholder="Tags (comma separated) e.g. physics, form 4, mechanics"
        className="w-full bg-slate-800/30 border border-slate-700/30 rounded-lg px-3 py-2 text-sm text-slate-400 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/30"
      />

      {/* Editor toolbar */}
      <div className="flex items-center gap-2 pb-2 border-b border-slate-700/30">
        <button
          onClick={() => setPreview(!preview)}
          className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
            preview ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-800/50 text-slate-400 hover:text-slate-300'
          }`}
        >
          {preview ? 'Edit' : 'Preview'}
        </button>
        <span className="text-xs text-slate-600">Markdown supported</span>
      </div>

      {/* Editor / Preview */}
      {preview ? (
        <div
          className="min-h-[300px] text-slate-300 text-sm leading-relaxed"
          dangerouslySetInnerHTML={{ __html: renderedPreview }}
        />
      ) : (
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your content here... Markdown is supported."
          className="w-full min-h-[400px] bg-transparent text-slate-300 text-sm leading-relaxed placeholder:text-slate-600 focus:outline-none resize-none font-mono"
        />
      )}
    </div>
  )
}