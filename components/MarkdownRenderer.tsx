// components/MarkdownRenderer.tsx
'use client'

import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface Props {
  content: string
}

export default function MarkdownRenderer({ content }: Props) {
  return (
    <div className="prose prose-invert prose-slate max-w-none
      prose-headings:text-indigo-300 prose-headings:font-semibold
      prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg
      prose-p:text-slate-300 prose-p:leading-relaxed
      prose-a:text-indigo-400 prose-a:no-underline hover:prose-a:underline
      prose-strong:text-slate-200
      prose-code:text-pink-300 prose-code:bg-slate-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
      prose-pre:bg-slate-800 prose-pre:border prose-pre:border-slate-700/50 prose-pre:rounded-xl
      prose-blockquote:border-l-indigo-500 prose-blockquote:text-slate-400
      prose-li:text-slate-300
      prose-th:text-slate-300 prose-td:text-slate-400
      prose-img:rounded-xl">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </div>
  )
}