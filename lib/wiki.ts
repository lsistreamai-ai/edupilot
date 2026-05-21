// lib/wiki.ts — Wiki database queries
import { createClient } from '@supabase/supabase-js'

const wikiSupabase = createClient(
  'https://eqbbhfegbjchpcpbxycq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxYmJoZmVnYmpjaHBjcGJ4eWNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg0ODI0NDgsImV4cCI6MjA2NDA1ODQ0OH0.srHuw2kPdsLpN70_mYXtFEFmJQSHUUn-YwSeZIV3fAs'
)

export interface WikiCategory {
  id: number
  name: string
  slug: string
  description?: string
  icon?: string
  parent_id?: number
  sort_order: number
}

export interface WikiPage {
  id: number
  title: string
  slug: string
  content: string
  category_id?: number
  tags: string[]
  author_id?: string
  is_published: boolean
  view_count: number
  created_at: string
  updated_at: string
  category?: WikiCategory
}

export interface SearchResult {
  id: number
  title: string
  slug: string
  tags: string[]
  updated_at: string
}

export async function getCategories(): Promise<WikiCategory[]> {
  const { data } = await wikiSupabase
    .from('wiki_categories')
    .select('*')
    .order('sort_order')
  return data || []
}

export async function getWikiPages({
  category,
  search,
  limit = 20,
  offset = 0,
}: {
  category?: string
  search?: string
  limit?: number
  offset?: number
}) {
  let query = wikiSupabase
    .from('wiki_pages')
    .select('*, category:wiki_categories(*)')
    .eq('is_published', true)
    .order('updated_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (category) {
    query = query.eq('wiki_categories.slug', category)
  }
  if (search) {
    query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`)
  }

  const { data, error } = await query
  return { pages: data || [], error }
}

export async function getWikiPage(slug: string) {
  await wikiSupabase.rpc('increment_wiki_view', { page_slug: slug })

  const { data } = await wikiSupabase
    .from('wiki_pages')
    .select('*, category:wiki_categories(*)')
    .eq('slug', slug)
    .single()
  return data
}

export async function createWikiPage(page: {
  title: string
  slug: string
  content: string
  category_id?: number
  tags?: string[]
  is_published?: boolean
}) {
  const { data, error } = await wikiSupabase
    .from('wiki_pages')
    .insert({
      ...page,
      tags: page.tags || [],
      is_published: page.is_published ?? true,
    })
    .select()
    .single()
  return { data, error }
}

export async function updateWikiPage(
  id: number,
  updates: Partial<{
    title: string
    slug: string
    content: string
    category_id: number | null
    tags: string[]
    is_published: boolean
  }>
) {
  const { data, error } = await wikiSupabase
    .from('wiki_pages')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  return { data, error }
}

export async function saveRevision(pageId: number, content: string, summary?: string) {
  await wikiSupabase.from('wiki_revisions').insert({
    page_id: pageId,
    content,
    change_summary: summary || null,
  })
}

export async function searchWikiPages(query: string): Promise<SearchResult[]> {
  const { data } = await wikiSupabase
    .from('wiki_pages')
    .select('id, title, slug, tags, updated_at')
    .eq('is_published', true)
    .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
    .order('updated_at', { ascending: false })
    .limit(20)
  return data || []
}