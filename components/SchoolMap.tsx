// components/SchoolMap.tsx — Interactive map for HK Schools
'use client'

import { useEffect, useRef, useMemo } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { School } from '@/lib/schools'

// Fix Leaflet default icon for Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

// District center coordinates for HK (approximate)
const DISTRICT_COORDS: Record<string, [number, number]> = {
  'Central & Western': [22.2800, 114.1500],
  'Eastern': [22.2800, 114.2300],
  'Islands': [22.2600, 113.9500],
  'Kowloon City': [22.3300, 114.1900],
  'Kwai Tsing': [22.3600, 114.1300],
  'Kwun Tong': [22.3100, 114.2300],
  'North': [22.5000, 114.1300],
  'Sai Kung': [22.3800, 114.2700],
  'Sha Tin': [22.3800, 114.1900],
  'Sham Shui Po': [22.3300, 114.1600],
  'Southern': [22.2500, 114.1700],
  'Tai Po': [22.4500, 114.1700],
  'Tsuen Wan': [22.3700, 114.1100],
  'Tuen Mun': [22.3900, 113.9700],
  'Wan Chai': [22.2800, 114.1800],
  'Wong Tai Sin': [22.3400, 114.2000],
  'Yau Tsim Mong': [22.3100, 114.1700],
  'Yuen Long': [22.4400, 114.0300],
}

interface Props {
  schools: School[]
  filters?: string // URL query string for linking
}

export default function SchoolMap({ schools, filters }: Props) {
  const mapRef = useRef<L.Map | null>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const markersRef = useRef<L.CircleMarker[]>([])
  const initializedRef = useRef(false)

  // Group schools by district
  const districtGroups = useMemo(() => {
    const groups: Record<string, { schools: School[]; coords: [number, number] | null }> = {}
    for (const school of schools) {
      const district = school.district || 'Unknown'
      if (!groups[district]) {
        groups[district] = { schools: [], coords: DISTRICT_COORDS[district] || null }
      }
      groups[district].schools.push(school)
    }
    return groups
  }, [schools])

  // Map layer URLs
  const tileDark = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
  const tileLight = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'

  useEffect(() => {
    if (typeof window === 'undefined' || !mapContainerRef.current || initializedRef.current) return

    const map = L.map(mapContainerRef.current, {
      center: [22.35, 114.15],
      zoom: 11,
      zoomControl: true,
      attributionControl: false,
    })

    L.tileLayer(tileDark, {
      maxZoom: 19,
    }).addTo(map)

    mapRef.current = map
    initializedRef.current = true

    return () => {
      map.remove()
      initializedRef.current = false
      mapRef.current = null
    }
  }, [])

  // Update markers when schools change
  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    // Clear old markers
    markersRef.current.forEach(m => m.remove())
    markersRef.current = []

    // Add district circles
    const maxSchools = Math.max(1, ...Object.values(districtGroups).map(g => g.schools.length))

    for (const [district, { schools: districtSchools, coords }] of Object.entries(districtGroups)) {
      if (!coords) continue
      const count = districtSchools.length
      const ratio = count / maxSchools

      // Circle size: 12px–40px based on count
      const radius = 12 + ratio * 28

      const color = '#2dd4bf' // teal-400
      const marker = L.circleMarker(coords, {
        radius,
        fillColor: color,
        color: 'rgba(45, 212, 191, 0.3)',
        weight: 1.5,
        opacity: 0.8,
        fillOpacity: 0.25 + ratio * 0.3,
      }).addTo(map)

      // Label
      marker.bindTooltip(
        `<div style="font-family:Inter,system-ui;font-size:12px">
          <strong>${district}</strong><br/>
          <span style="color:#94a3b8">${count} school${count > 1 ? 's' : ''}</span>
        </div>`,
        {
          direction: 'top',
          offset: [0, -radius - 4],
          opacity: 0.95,
          className: '',
        }
      )

      marker.on('click', () => {
        const query = filters ? `${filters}&district=${encodeURIComponent(district)}` : `district=${encodeURIComponent(district)}`
        window.location.href = `/schools?${query}&view=list`
      })

      markersRef.current.push(marker)
    }
  }, [districtGroups, filters])

  return (
    <div ref={mapContainerRef} className="w-full h-full rounded-xl" />
  )
}