// lib/schools.ts — Supabase queries for HK schools
import { supabase } from './supabase'

export interface School {
  id: number
  level: 'primary' | 'secondary'
  school_name: string
  district: string
  school_address: string | null
  school_tel: string | null
  school_email: string | null
  school_website: string | null
  school_type: string | null
  student_gender: string | null
  religion: string | null
  sponsoring_body: string | null
  school_mission: string | null
  school_motto: string | null
  school_size: number | null
  commencement_year: number | null
  has_school_bus: boolean
  has_pta: boolean
  has_alumni: boolean
  lat: number | null
  lng: number | null
  psp_data: Record<string, any> | null
  ssp_data: Record<string, any> | null
}

interface GetSchoolsParams {
  level?: 'primary' | 'secondary'
  district?: string
  school_type?: string
  student_gender?: string
  religion?: string
  search?: string
  page?: number
  limit?: number
}

export async function getSchools(params: GetSchoolsParams = {}) {
  const {
    level,
    district,
    school_type,
    student_gender,
    religion,
    search,
    page = 1,
    limit = 30,
  } = params

  let query = supabase
    .from('schools')
    .select('*', { count: 'exact' })

  if (level) query = query.eq('level', level)
  if (district) query = query.eq('district', district)
  if (school_type) query = query.eq('school_type', school_type)
  if (student_gender) query = query.eq('student_gender', student_gender)
  if (religion) query = query.eq('religion', religion)
  if (search) {
    query = query.or(
      `school_name.ilike.%${search}%,school_mission.ilike.%${search}%`
    )
  }

  const from = (page - 1) * limit
  query = query.order('school_name', { ascending: true }).range(from, from + limit - 1)

  const { data, error, count } = await query
  if (error) throw error

  return {
    schools: (data || []) as School[],
    total: count || 0,
    page,
    limit,
    totalPages: Math.ceil((count || 0) / limit),
  }
}

export async function getSchoolById(id: number) {
  const { data, error } = await supabase
    .from('schools')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data as School
}

export async function getDistricts() {
  const { data, error } = await supabase
    .from('schools')
    .select('district')
    .order('district')

  if (error) return []
  // Deduplicate
  const seen = new Set<string>()
  return (data || []).filter((d: any) => {
    if (seen.has(d.district)) return false
    seen.add(d.district)
    return true
  }).map((d: any) => d.district)
}

// All HK districts (used before data loads)
export const HK_DISTRICTS = [
  'Central & Western', 'Eastern', 'Islands', 'Kowloon City',
  'Kwai Tsing', 'Kwun Tong', 'North', 'Sai Kung',
  'Sha Tin', 'Sham Shui Po', 'Southern', 'Tai Po',
  'Tsuen Wan', 'Tuen Mun', 'Wan Chai', 'Wong Tai Sin',
  'Yau Tsim Mong', 'Yuen Long',
]

export const SCHOOL_TYPES = ['Aided', 'DSS', "Gov't", 'Private', 'CAPUT']

export const GENDERS = ['Co-ed', 'Boys', 'Girls']

export const RELIGIONS = [
  'Protestantism / Christianity',
  'Catholicism',
  'Buddhism',
  'Taoism',
  'Islam',
  'Confucianism',
  'Not Applicable',
]