'use client'

// components/GlobeScene.tsx
// Full HTML5 Canvas 3D globe — particle continents, atmosphere, grid lines, rotation

import { useEffect, useRef } from 'react'

interface Dot { lat: number; lng: number }
interface City { name: string; lat: number; lng: number }

export default function GlobeScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let rotation = 0
    // Mouse/touch interaction
    let isDragging = false
    let lastX = 0
    let targetRotation = 0
    let autoRotate = true
    let autoSpeed = 0.008

    const resize = () => {
      const parent = canvas.parentElement!
      const w = parent.clientWidth
      const h = parent.clientHeight
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = w + 'px'
      canvas.style.height = h + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      return { w, h }
    }

    let { w, h } = resize()
    window.addEventListener('resize', () => { const s = resize(); w = s.w; h = s.h })

    // Mouse handlers
    const onDown = (e: MouseEvent | Touch) => {
      isDragging = true
      autoRotate = false
      lastX = e.clientX
      targetRotation = rotation
    }
    const onMove = (e: MouseEvent | Touch) => {
      if (!isDragging) return
      const dx = e.clientX - lastX
      targetRotation += dx * 0.005
      lastX = e.clientX
    }
    const onUp = () => {
      isDragging = false
      // Resume auto-rotation after 2s idle
      setTimeout(() => { if (!isDragging) autoRotate = true }, 2000)
    }

    const handleMouseDown = (e: MouseEvent) => onDown(e)
    const handleMouseMove = (e: MouseEvent) => onMove(e)
    const handleTouchStart = (e: TouchEvent) => { e.preventDefault(); onDown(e.touches[0]) }
    const handleTouchMove = (e: TouchEvent) => { e.preventDefault(); onMove(e.touches[0]) }

    canvas.addEventListener('mousedown', handleMouseDown)
    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('mouseup', onUp)
    canvas.addEventListener('mouseleave', onUp)
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false })
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false })
    canvas.addEventListener('touchend', onUp)

    // Continent dots
    const dots: Dot[] = []
    const addLand = (points: [number, number][]) => {
      for (const [lat, lng] of points) dots.push({ lat, lng })
    }

    // NA
    addLand([[45,-100],[50,-85],[55,-70],[60,-60],[45,-110],[35,-95],[30,-105],[40,-75],[48,-55],[52,-95],[38,-120],[55,-95],[42,-80],[47,-70],[58,-75]])
    // SA
    addLand([[-5,-80],[0,-65],[-5,-55],[-10,-75],[-15,-70],[-20,-65],[-25,-70],[-30,-70],[-35,-70],[-40,-70],[-8,-45],[-15,-50],[-25,-55],[-35,-60],[-45,-65],[-3,-70],[2,-60]])
    // Europe
    addLand([[50,-5],[48,2],[52,5],[55,10],[58,12],[60,15],[45,7],[42,12],[38,15],[55,-5],[50,0],[52,8],[40,20],[45,25],[50,25],[55,20],[60,20],[42,-8],[44,-5],[36,-5],[48,15],[55,30]])
    // Africa
    addLand([[30,30],[25,25],[20,35],[15,35],[10,40],[5,38],[0,35],[-5,35],[-10,30],[-15,25],[-20,20],[-25,25],[-30,25],[-35,20],[-5,40],[5,45],[10,50],[10,35],[-10,15],[-5,20],[15,20],[0,10],[-10,30]])
    // Asia
    addLand([[60,60],[55,65],[50,70],[45,75],[50,80],[55,85],[60,90],[65,100],[65,110],[60,115],[55,120],[50,125],[45,130],[40,130],[55,100],[60,95],[50,55],[45,60],[40,65],[35,70],[30,75],[25,80],[20,85],[15,95],[20,100],[25,105],[30,110],[35,105]])
    // Japan
    addLand([[35,135],[36,138],[38,140],[40,141],[42,142],[34,136]])
    // Australia
    addLand([[-20,125],[-22,130],[-25,135],[-28,140],[-25,145],[-22,150],[-18,145],[-15,140],[-15,135],[-18,130],[-20,125],[-23,145],[-26,135],[-30,140],[-30,135]])
    // NZ
    addLand([[-38,172],[-40,175],[-43,172],[-45,168],[-42,173]])
    // India
    addLand([[22,78],[20,80],[18,82],[15,80],[10,78],[8,76],[12,75],[18,74],[25,72],[28,75],[25,78],[22,78],[15,76]])

    // Grid lines
    const gridLines: { lat1: number; lng1: number; lat2: number; lng2: number }[] = []
    for (let lat = -80; lat <= 80; lat += 20) {
      for (let lng = 0; lng < 360; lng += 10) {
        gridLines.push({ lat1: lat, lng1: lng, lat2: lat, lng2: lng + 10 })
      }
    }
    for (let lng = 0; lng < 360; lng += 30) {
      for (let lat = -80; lat < 80; lat += 10) {
        gridLines.push({ lat1: lat, lng1: lng, lat2: lat + 10, lng2: lng })
      }
    }

    // Cities
    const cities: City[] = [
      { name: 'HK', lat: 22, lng: 114 },
      { name: 'Tokyo', lat: 35, lng: 139 },
      { name: 'NYC', lat: 40, lng: -74 },
      { name: 'London', lat: 51, lng: 0 },
      { name: 'Singapore', lat: 1.3, lng: 103 },
      { name: 'Sydney', lat: -33, lng: 151 },
    ]

    const toCartesian = (lat: number, lng: number, radius: number) => {
      const phi = (90 - lat) * Math.PI / 180
      const theta = (lng + 180) * Math.PI / 180
      return {
        x: -radius * Math.sin(phi) * Math.cos(theta),
        y: radius * Math.cos(phi),
        z: radius * Math.sin(phi) * Math.sin(theta),
      }
    }

    const project = (x: number, y: number, z: number) => {
      return { px: x + w / 2, py: -y + h / 2, z }
    }

    const rotateY = (x: number, y: number, z: number, angle: number) => {
      const cos = Math.cos(angle), sin = Math.sin(angle)
      return { x: x * cos - z * sin, y, z: x * sin + z * cos }
    }

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      const R = Math.min(w, h) * 0.35

      // Draw globe background glow
      const gx = w / 2, gy = h / 2
      const glow = ctx.createRadialGradient(gx, gy, R * 0.85, gx, gy, R * 1.25)
      glow.addColorStop(0, 'rgba(20, 184, 166, 0.08)')
      glow.addColorStop(0.5, 'rgba(20, 184, 166, 0.03)')
      glow.addColorStop(1, 'rgba(20, 184, 166, 0)')
      ctx.fillStyle = glow
      ctx.beginPath()
      ctx.arc(gx, gy, R * 1.25, 0, Math.PI * 2)
      ctx.fill()

      const visibleDots: { px: number; py: number; z: number }[] = []

      // Globe circle clip
      ctx.save()
      ctx.beginPath()
      ctx.arc(gx, gy, R, 0, Math.PI * 2)
      ctx.clip()

      // Base sphere gradient
      const sphereGrad = ctx.createRadialGradient(gx - R * 0.3, gy - R * 0.3, R * 0.1, gx, gy, R)
      sphereGrad.addColorStop(0, 'rgba(30, 41, 59, 0.95)')
      sphereGrad.addColorStop(0.6, 'rgba(15, 23, 42, 0.95)')
      sphereGrad.addColorStop(1, 'rgba(2, 6, 23, 0.98)')
      ctx.fillStyle = sphereGrad
      ctx.fillRect(0, 0, w, h)

      // Grid lines
      for (const line of gridLines) {
        const p1 = toCartesian(line.lat1, line.lng1, R)
        const p2 = toCartesian(line.lat2, line.lng2, R)
        const r1 = rotateY(p1.x, p1.y, p1.z, rotation)
        const r2 = rotateY(p2.x, p2.y, p2.z, rotation)

        if (r1.z > 0 && r2.z > 0) {
          const s1 = project(r1.x, r1.y, r1.z)
          const s2 = project(r2.x, r2.y, r2.z)
          const alpha = Math.max(0.03, 0.06 * (1 - Math.abs(s1.z / R)))
          ctx.strokeStyle = `rgba(20, 184, 166, ${alpha})`
          ctx.lineWidth = 0.3
          ctx.beginPath()
          ctx.moveTo(s1.px, s1.py)
          ctx.lineTo(s2.px, s2.py)
          ctx.stroke()
        }
      }

      // Continent dots
      for (const dot of dots) {
        const p = toCartesian(dot.lat, dot.lng, R)
        const r = rotateY(p.x, p.y, p.z, rotation)
        if (r.z > 0) {
          const s = project(r.x, r.y, r.z)
          visibleDots.push(s)
          const alpha = 0.5 + 0.5 * (1 - Math.abs(s.z / R))
          ctx.fillStyle = `rgba(20, 184, 166, ${alpha * 0.7})`
          ctx.beginPath()
          ctx.arc(s.px, s.py, 1.2, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      ctx.restore()

      // Atmosphere ring
      ctx.beginPath()
      ctx.arc(gx, gy, R + 1, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(20, 184, 166, 0.15)'
      ctx.lineWidth = 1
      ctx.stroke()

      ctx.beginPath()
      ctx.arc(gx, gy, R + 4, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(20, 184, 166, 0.06)'
      ctx.lineWidth = 1
      ctx.stroke()

      // City dots
      for (const city of cities) {
        const p = toCartesian(city.lat, city.lng, R + 2)
        const r = rotateY(p.x, p.y, p.z, rotation)
        if (r.z > 0) {
          const s = project(r.x, r.y, r.z)
          const pulse = 0.5 + 0.5 * Math.sin(Date.now() * 0.002 + city.lng)
          ctx.fillStyle = `rgba(45, 212, 191, ${0.5 + pulse * 0.4})`
          ctx.beginPath()
          ctx.arc(s.px, s.py, 3, 0, Math.PI * 2)
          ctx.fill()
          // City label
          ctx.fillStyle = `rgba(204, 251, 241, 0.7)`
          ctx.font = '8px Inter, sans-serif'
          ctx.fillText(city.name, s.px + 6, s.py + 3)
        }
      }

      rotation += (targetRotation - rotation) * 0.1
      if (autoRotate) {
        targetRotation += autoSpeed
      }
      animId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('mousedown', handleMouseDown)
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('mouseup', onUp)
      canvas.removeEventListener('mouseleave', onUp)
      canvas.removeEventListener('touchstart', handleTouchStart)
      canvas.removeEventListener('touchmove', handleTouchMove)
      canvas.removeEventListener('touchend', onUp)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ display: 'block' }}
    />
  )
}