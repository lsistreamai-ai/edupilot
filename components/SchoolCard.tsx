// components/SchoolCard.tsx
import Link from 'next/link'
import { Phone, Mail, Globe, MapPin, GraduationCap, School as SchoolIcon, ArrowUpRight } from 'lucide-react'
import { School } from '@/lib/schools'

interface Props {
  school: School
}

const TYPE_COLORS: Record<string, string> = {
  'Aided': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  'DSS': 'bg-teal-500/20 text-teal-300 border-teal-500/30',
  "Gov't": 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  'Private': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  'CAPUT': 'bg-amber-500/20 text-amber-300 border-amber-500/30',
}

const GENDER_EMOJI: Record<string, string> = {
  'Co-ed': '👫',
  'Boys': '👦',
  'Girls': '👧',
}

export default function SchoolCard({ school }: Props) {
  const typeColor = TYPE_COLORS[school.school_type || ''] || 'bg-slate-700/50 text-slate-400 border-slate-600/30'

  // Extract key data from PSP or SSP
  const teacherTotal = school.psp_data?.total_teachers || school.ssp_data?.total_teachers
  const classTotal = school.psp_data?.class_total || school.ssp_data?.class_total

  // SSP fees
  const s1Fee = school.ssp_data?.school_fee_s1
  const isPaid = s1Fee && s1Fee !== '-' && s1Fee !== '0'

  return (
    <div className="h-full bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-4 sm:p-5 hover:border-teal-500/30 transition-all group flex flex-col">
      {/* Top: school type badge + name */}
      <div className="flex items-start gap-2 mb-2">
        <span className={`px-2 py-0.5 text-[10px] sm:text-[11px] rounded-full border flex-shrink-0 leading-tight ${typeColor}`}>
          {school.school_type || 'School'}
        </span>
        <span className="text-[11px] text-slate-500 mt-0.5">{GENDER_EMOJI[school.student_gender || '']}</span>
      </div>

      <h3 className="text-sm sm:text-base font-semibold text-white leading-snug mb-2 line-clamp-2">
        {school.school_name}
      </h3>

      {/* District */}
      <div className="flex items-center gap-1 text-[11px] sm:text-xs text-slate-500 mb-3">
        <MapPin className="w-3 h-3" />
        <span>{school.district}</span>
      </div>

      {/* Stats row */}
      <div className="flex gap-3 mb-3 text-[11px] sm:text-xs text-slate-500">
        <span className="inline-flex items-center gap-1">
          <SchoolIcon className="w-3 h-3" />
          {school.level === 'primary' ? 'Primary' : 'Secondary'}
        </span>
        {teacherTotal && (
          <span className="inline-flex items-center gap-1">
            <GraduationCap className="w-3 h-3" />
            {teacherTotal} teachers
          </span>
        )}
        {classTotal && (
          <span>{classTotal} classes</span>
        )}
      </div>

      {/* Contact */}
      <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] sm:text-xs text-slate-600 mb-4">
        {school.school_tel && (
          <span className="inline-flex items-center gap-1">
            <Phone className="w-2.5 h-2.5" />
            {school.school_tel}
          </span>
        )}
        {school.school_email && (
          <span className="inline-flex items-center gap-1 truncate max-w-[160px]">
            <Mail className="w-2.5 h-2.5" />
            {school.school_email}
          </span>
        )}
      </div>

      {/* Bottom row */}
      <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-800">
        <div className="flex items-center gap-2">
          {isPaid && (
            <span className="text-[10px] text-amber-400/70 font-medium">
              S1: {s1Fee}
            </span>
          )}
          {school.religion && school.religion !== 'Not Applicable' && (
            <span className="text-[10px] text-slate-600 truncate max-w-[100px]">{school.religion}</span>
          )}
        </div>
        <Link
          href={`/schools/${school.id}`}
          className="inline-flex items-center gap-1 text-xs font-medium text-teal-400 hover:text-teal-300 transition-colors"
        >
          Profile
          <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  )
}