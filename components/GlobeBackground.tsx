'use client'

import { useEffect, useRef } from 'react'

export default function GlobeBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    let rotation = 0

    // Globe params
    const cx = canvas.width / 2
    const cy = canvas.height / 2
    const radius = Math.min(cx, cy) * 0.7

    // Draw a stylized globe with grid lines
    function drawGlobe(rot: number) {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const w = canvas.width
      const h = canvas.height

      // Outer glow
      const glow = ctx.createRadialGradient(cx, cy, radius * 0.9, cx, cy, radius * 1.15)
      glow.addColorStop(0, 'rgba(99, 102, 241, 0.08)')
      glow.addColorStop(0.5, 'rgba(99, 102, 241, 0.03)')
      glow.addColorStop(1, 'rgba(99, 102, 241, 0)')
      ctx.fillStyle = glow
      ctx.beginPath()
      ctx.arc(cx, cy, radius * 1.15, 0, Math.PI * 2)
      ctx.fill()

      // Globe base
      ctx.beginPath()
      ctx.arc(cx, cy, radius, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.4)'
      ctx.lineWidth = 1.5
      ctx.stroke()

      // Fill with subtle gradient
      const fill = ctx.createRadialGradient(cx - radius * 0.3, cy - radius * 0.3, 0, cx, cy, radius)
      fill.addColorStop(0, 'rgba(99, 102, 241, 0.12)')
      fill.addColorStop(0.5, 'rgba(99, 102, 241, 0.05)')
      fill.addColorStop(1, 'rgba(15, 23, 42, 0.3)')
      ctx.fillStyle = fill
      ctx.fill()

      // Longitudinal lines
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2 + rot * 0.3
        ctx.beginPath()
        ctx.ellipse(cx, cy, radius * Math.abs(Math.cos(angle)), radius, 0, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(99, 102, 241, ${0.1 + Math.abs(Math.cos(angle)) * 0.15})`
        ctx.lineWidth = 0.5
        ctx.stroke()
      }

      // Latitudinal lines
      for (let i = 1; i <= 4; i++) {
        const y = cy - radius + (radius * 2 * i) / 5
        const rx = radius * Math.sin(Math.acos(Math.abs(y - cy) / radius))
        if (rx > 0) {
          ctx.beginPath()
          ctx.ellipse(cx, y, rx, 1.5, 0, 0, Math.PI * 2)
          ctx.strokeStyle = `rgba(99, 102, 241, ${0.08 + i * 0.02})`
          ctx.lineWidth = 0.5
          ctx.stroke()
        }
      }

      // Equator highlight
      ctx.beginPath()
      ctx.ellipse(cx, cy, radius, 1.5, 0, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(129, 140, 248, 0.3)'
      ctx.lineWidth = 1
      ctx.stroke()

      // Dots/nodes on surface
      const nodes = [
        [0.3, -0.4], [0.6, -0.2], [0.7, 0.1], [0.4, 0.5],
        [-0.2, -0.5], [-0.5, -0.1], [-0.3, 0.4], [-0.7, 0.2],
        [0, -0.6], [0.1, 0.6], [-0.6, -0.3], [0.8, 0.4],
        [-0.8, -0.1], [0.5, 0.3], [-0.4, -0.4], [0.2, 0.1]
      ]

      for (const [dx, dy] of nodes) {
        const nx = dx * Math.cos(rot * 0.5) - dy * Math.sin(rot * 0.5)
        const ny = dx * Math.sin(rot * 0.5) + dy * Math.cos(rot * 0.5)
        const z = Math.sqrt(Math.max(0, 1 - nx * nx - ny * ny))
        const x = cx + nx * radius
        const y = cy + ny * radius

        if (z > 0.2) {
          ctx.beginPath()
          ctx.arc(x, y, 2, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(129, 140, 248, ${0.3 + z * 0.5})`
          ctx.fill()

          // Glow
          ctx.beginPath()
          ctx.arc(x, y, 4, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(129, 140, 248, ${0.1 + z * 0.15})`
          ctx.fill()
        }
      }
    }

    function resize() {
      canvas!.width = canvas!.offsetWidth * 2
      canvas!.height = canvas!.offsetHeight * 2
    }

    function animate() {
      rotation += 0.003
      drawGlobe(rotation)
      animationId = requestAnimationFrame(animate)
    }

    resize()
    animate()
    window.addEventListener('resize', resize)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full opacity-70"
      style={{ pointerEvents: 'none' }}
    />
  )
}