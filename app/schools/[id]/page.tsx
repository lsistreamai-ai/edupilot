// app/schools/[id]/page.tsx — Individual School Profile
import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft, MapPin, Phone, Mail, Globe, School as SchoolIcon,
  GraduationCap, Church, Users, Bus, Calendar, Ruler,
  Clock, BookOpen, Palette, Heart, Shield
} from 'lucide-react'
import { getSchoolById, School } from '@/lib/schools'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ id: string }>
}

export default async function SchoolProfilePage({ params }: Props) {
  const { id } = await params
  let school: School

  try {
    school = await getSchoolById(parseInt(id))
  } catch {
    notFound()
  }

  if (!school) notFound()

  const isPrimary = school.level === 'primary'
  const data = isPrimary ? school.psp_data : school.ssp_data

  // Fee processing for secondary schools
  const hasFees = data?.school_fee_s1 && data?.school_fee_s1 !== '-' && data?.school_fee_s1 !== '0'

  return (
    <div className="max-w-4xl mx-auto pb-16">
      {/* ═══════════ Back ═══════════ */}
      <div className="mb-6">
        <Link href="/schools" className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-slate-500 hover:text-teal-400 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to all schools
        </Link>
      </div>

      {/* ═══════════ Header ═══════════ */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className={`px-2.5 py-0.5 text-[11px] sm:text-xs rounded-full border ${
            school.school_type === 'Aided' ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' :
            school.school_type === 'DSS' ? 'bg-teal-500/20 text-teal-300 border-teal-500/30' :
            school.school_type === "Gov't" ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' :
            'bg-slate-700/50 text-slate-400 border-slate-600/30'
          }`}>
            {school.school_type || 'School'}
          </span>
          <span className="px-2.5 py-0.5 text-[11px] sm:text-xs rounded-full border bg-slate-800/50 text-slate-400 border-slate-700/50">
            {isPrimary ? 'Primary' : 'Secondary'}
          </span>
          <span className="px-2.5 py-0.5 text-[11px] sm:text-xs rounded-full border bg-slate-800/50 text-slate-400 border-slate-700/50">
            {school.student_gender}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight mb-3">
          {school.school_name}
        </h1>

        <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-slate-400">
          {school.district && (
            <span className="inline-flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-600" />
              {school.district}
            </span>
          )}
          {school.religion && school.religion !== 'Not Applicable' && (
            <span className="inline-flex items-center gap-1">
              <Church className="w-3.5 h-3.5 text-slate-600" />
              {school.religion}
            </span>
          )}
          {school.commencement_year && (
            <span className="inline-flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-600" />
              Est. {school.commencement_year}
            </span>
          )}
        </div>
      </div>

      {/* ═══════════ Contact Grid ═══════════ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
        {school.school_address && (
          <div className="bg-slate-800/40 border border-slate-700/30 rounded-xl p-4">
            <div className="text-[11px] text-slate-500 mb-1">Address</div>
            <div className="text-sm text-slate-300">{school.school_address}</div>
          </div>
        )}
        <div className="bg-slate-800/40 border border-slate-700/30 rounded-xl p-4">
          <div className="text-[11px] text-slate-500 mb-2">Contact</div>
          <div className="space-y-1.5">
            {school.school_tel && (
              <a href={`tel:${school.school_tel}`} className="inline-flex items-center gap-1.5 text-sm text-teal-400 hover:text-teal-300 transition-colors">
                <Phone className="w-3.5 h-3.5" /> {school.school_tel}
              </a>
            )}
            {school.school_email && (
              <a href={`mailto:${school.school_email}`} className="flex items-center gap-1.5 text-sm text-teal-400 hover:text-teal-300 transition-colors">
                <Mail className="w-3.5 h-3.5" /> {school.school_email}
              </a>
            )}
            {school.school_website && (
              <a href={school.school_website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-teal-400 hover:text-teal-300 transition-colors">
                <Globe className="w-3.5 h-3.5" /> Website
              </a>
            )}
          </div>
        </div>
      </div>

      {/* ═══════════ Quick Stats ═══════════ */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {school.school_size && (
          <div className="bg-slate-800/40 border border-slate-700/30 rounded-xl p-3">
            <Ruler className="w-4 h-4 text-slate-600 mb-1" />
            <div className="text-lg font-bold text-slate-200">{Math.round(school.school_size).toLocaleString()} m²</div>
            <div className="text-[10px] text-slate-600">Campus size</div>
          </div>
        )}
        {data?.total_teachers && (
          <div className="bg-slate-800/40 border border-slate-700/30 rounded-xl p-3">
            <GraduationCap className="w-4 h-4 text-slate-600 mb-1" />
            <div className="text-lg font-bold text-slate-200">{data.total_teachers}</div>
            <div className="text-[10px] text-slate-600">Teachers</div>
          </div>
        )}
        {data?.class_total && (
          <div className="bg-slate-800/40 border border-slate-700/30 rounded-xl p-3">
            <SchoolIcon className="w-4 h-4 text-slate-600 mb-1" />
            <div className="text-lg font-bold text-slate-200">{data.class_total}</div>
            <div className="text-[10px] text-slate-600">Classes</div>
          </div>
        )}
        {school.sponsoring_body && (
          <div className="bg-slate-800/40 border border-slate-700/30 rounded-xl p-3">
            <Shield className="w-4 h-4 text-slate-600 mb-1" />
            <div className="text-sm font-semibold text-slate-300 line-clamp-2 leading-tight">{school.sponsoring_body}</div>
            <div className="text-[10px] text-slate-600">Sponsoring body</div>
          </div>
        )}
      </div>

      {/* ═══════════ Amenities ═══════════ */}
      <div className="flex flex-wrap gap-2 mb-8">
        {school.has_school_bus && (
          <span className="px-2.5 py-1 rounded-lg text-[11px] bg-slate-800/50 border border-slate-700/50 text-slate-400 inline-flex items-center gap-1">
            <Bus className="w-3 h-3" /> School bus
          </span>
        )}
        {school.has_pta && (
          <span className="px-2.5 py-1 rounded-lg text-[11px] bg-slate-800/50 border border-slate-700/50 text-slate-400 inline-flex items-center gap-1">
            <Users className="w-3 h-3" /> Parent-Teacher Association
          </span>
        )}
        {school.has_alumni && (
          <span className="px-2.5 py-1 rounded-lg text-[11px] bg-slate-800/50 border border-slate-700/50 text-slate-400 inline-flex items-center gap-1">
            <Heart className="w-3 h-3" /> Alumni Association
          </span>
        )}
      </div>

      {/* ═══════════ Mission ═══════════ */}
      {school.school_mission && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-teal-400/70" />
            School Mission
          </h2>
          <div className="bg-slate-800/40 border border-slate-700/30 rounded-xl p-5">
            <p className="text-sm text-slate-400 leading-relaxed whitespace-pre-line">{school.school_mission}</p>
          </div>
        </div>
      )}

      {school.school_motto && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
            <Palette className="w-4 h-4 text-teal-400/70" />
            School Motto
          </h2>
          <div className="bg-slate-800/40 border border-slate-700/30 rounded-xl p-5">
            <p className="text-base text-slate-300 italic">"{school.school_motto}"</p>
          </div>
        </div>
      )}

      {/* ═══════════ Teacher Stats ═══════════ */}
      {data?.teacher_training_pct != null && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-slate-300 mb-3">Teacher Qualifications</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatBlock label="Trained" value={`${data.teacher_training_pct}%`} />
            <StatBlock label="Bachelor's" value={`${data.bachelor_pct}%`} />
            <StatBlock label="Master's/PhD" value={`${data.master_doctorate_pct}%`} />
            <StatBlock label="SEN trained" value={`${data.sen_training_pct}%`} />
          </div>
          {/* Experience breakdown */}
          {(data.exp_0_4_pct != null || data.exp_5_9_pct != null || data.exp_10_plus_pct != null) && (
            <div className="mt-4 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1">
                <Clock className="w-3 h-3" /> Experience:
                {' '}0–4 yrs: {data.exp_0_4_pct}% · 5–9 yrs: {data.exp_5_9_pct}% · 10+ yrs: {data.exp_10_plus_pct}%
              </span>
            </div>
          )}
        </div>
      )}

      {/* ═══════════ Class Structure ═══════════ */}
      {data?.class_p1 != null && isPrimary && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-slate-300 mb-3">Class Structure</h2>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {['P1','P2','P3','P4','P5','P6'].map((label, i) => {
              const key = `class_${label.toLowerCase()}`
              const val = data?.[key]
              return val != null ? (
                <div key={label} className="bg-slate-800/40 border border-slate-700/30 rounded-lg p-2.5 text-center">
                  <div className="text-lg font-bold text-slate-200">{val}</div>
                  <div className="text-[10px] text-slate-600">{label}</div>
                </div>
              ) : null
            })}
          </div>
        </div>
      )}

      {/* ═══════════ SSP Fees ═══════════ */}
      {hasFees && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-slate-300 mb-3">Annual School Fees</h2>
          <div className="overflow-x-auto">
            <div className="inline-flex gap-2">
              {['S1','S2','S3','S4','S5','S6'].map((label) => {
                const key = `school_fee_${label.toLowerCase()}`
                const val = data?.[key]
                if (!val || val === '-' || val === '0') return null
                return (
                  <div key={label} className="bg-slate-800/40 border border-slate-700/30 rounded-lg px-4 py-3 text-center">
                    <div className="text-sm font-semibold text-amber-300">{val}</div>
                    <div className="text-[10px] text-slate-600">{label}</div>
                  </div>
                )
              })}
            </div>
          </div>
          {data?.tong_fai && data?.tong_fai !== '-' && (
            <p className="text-[11px] text-slate-500 mt-2">Tong Fai: {data.tong_fai}</p>
          )}
        </div>
      )}

      {/* ═══════════ Daily Schedule ═══════════ */}
      {data?.school_starts && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-slate-300 mb-3">School Day</h2>
          <div className="bg-slate-800/40 border border-slate-700/30 rounded-xl p-5">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
              {data.school_days_per_week && (
                <div>
                  <div className="text-[10px] text-slate-600 mb-0.5">Days per week</div>
                  <div className="text-slate-300">{data.school_days_per_week}</div>
                </div>
              )}
              {data.periods_per_day && (
                <div>
                  <div className="text-[10px] text-slate-600 mb-0.5">Periods per day</div>
                  <div className="text-slate-300">{data.periods_per_day}</div>
                </div>
              )}
              {data.period_duration_min && (
                <div>
                  <div className="text-[10px] text-slate-600 mb-0.5">Duration</div>
                  <div className="text-slate-300">{data.period_duration_min} min</div>
                </div>
              )}
              {data.school_starts && (
                <div>
                  <div className="text-[10px] text-slate-600 mb-0.5">Starts</div>
                  <div className="text-slate-300">{data.school_starts}</div>
                </div>
              )}
              {data.school_ends && (
                <div>
                  <div className="text-[10px] text-slate-600 mb-0.5">Ends</div>
                  <div className="text-slate-300">{data.school_ends}</div>
                </div>
              )}
              {data.lunch_arrangement && (
                <div>
                  <div className="text-[10px] text-slate-600 mb-0.5">Lunch</div>
                  <div className="text-slate-300">{data.lunch_arrangement}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ═══════════ Teaching & Learning ═══════════ */}
      {data?.learning_teaching_strategies && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-slate-300 mb-3">Teaching &amp; Learning</h2>
          <div className="bg-slate-800/40 border border-slate-700/30 rounded-xl p-5">
            <p className="text-sm text-slate-400 leading-relaxed">{data.learning_teaching_strategies}</p>
          </div>
        </div>
      )}

      {/* ═══════════ Student Support ═══════════ */}
      {data?.learner_diversity && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-slate-300 mb-3">Student Support</h2>
          <div className="bg-slate-800/40 border border-slate-700/30 rounded-xl p-5">
            <p className="text-sm text-slate-400 leading-relaxed">{data.learner_diversity}</p>
          </div>
        </div>
      )}

      {/* ═══════════ Secondary-specific: NSS info ═══════════ */}
      {!isPrimary && data?.nss_info && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-slate-300 mb-3">NSS Curriculum</h2>
          <div className="bg-slate-800/40 border border-slate-700/30 rounded-xl p-5">
            <p className="text-sm text-slate-400 leading-relaxed whitespace-pre-line">{data.nss_info}</p>
          </div>
        </div>
      )}

      {/* ═══════════ Home-School Cooperation ═══════════ */}
      {data?.home_school_cooperation && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-slate-300 mb-3">Home-School Cooperation</h2>
          <div className="bg-slate-800/40 border border-slate-700/30 rounded-xl p-5">
            <p className="text-sm text-slate-400 leading-relaxed">{data.home_school_cooperation}</p>
          </div>
        </div>
      )}
    </div>
  )
}

function StatBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-slate-800/40 border border-slate-700/30 rounded-xl p-3 text-center">
      <div className="text-lg sm:text-xl font-bold text-teal-300">{value}</div>
      <div className="text-[10px] text-slate-600">{label}</div>
    </div>
  )
}