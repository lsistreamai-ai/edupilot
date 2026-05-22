// components/SchoolMapWrapper.tsx — Client wrapper for SchoolMap (needed for SSR-free import)
'use client'

import dynamic from 'next/dynamic'
import { School } from '@/lib/schools'

const SchoolMap = dynamic(() => import('@/components/SchoolMap'), { ssr: false })

interface Props {
  schools: School[]
  filters?: string
}

export default function SchoolMapWrapper({ schools, filters }: Props) {
  return (
    <div className="w-full h-full rounded-xl">
      <SchoolMap schools={schools} filters={filters} />
    </div>
  )
}