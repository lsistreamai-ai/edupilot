'use client'

import { useEffect, useRef, useState } from 'react'

declare global {
  interface Window {
    THREE: any
  }
}

// Load Three.js from CDN once
let threePromise: Promise<void> | null = null
function loadThree(): Promise<void> {
  if (threePromise) return threePromise
  if (typeof window !== 'undefined' && window.THREE) {
    threePromise = Promise.resolve()
    return threePromise
  }
  threePromise = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js'
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load Three.js'))
    document.head.appendChild(script)
  })
  return threePromise
}

export default function GlobeBackground() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let mounted = true
    loadThree().then(() => {
      if (mounted) setLoaded(true)
    }).catch(() => {})

    return () => { mounted = false }
  }, [])

  useEffect(() => {
    if (!loaded || !containerRef.current) return

    const THREE = window.THREE
    if (!THREE) return

    const container = containerRef.current
    const width = container.clientWidth
    const height = container.clientHeight

    // Scene
    const scene = new THREE.Scene()

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100)
    camera.position.z = 5

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    // Lights
    const ambientLight = new THREE.AmbientLight(0x6366f1, 0.4)
    scene.add(ambientLight)
    const pointLight = new THREE.PointLight(0x818cf8, 0.6, 10, 0)
    pointLight.position.set(5, 5, 5)
    scene.add(pointLight)
    const pointLight2 = new THREE.PointLight(0xa78bfa, 0.3, 10, 0)
    pointLight2.position.set(-3, -3, -3)
    scene.add(pointLight2)

    // Globe group
    const globeGroup = new THREE.Group()
    scene.add(globeGroup)

    // Wireframe sphere
    const sphereGeo = new THREE.SphereGeometry(1.8, 64, 64)
    const wireframe = new THREE.LineSegments(
      new THREE.EdgesGeometry(sphereGeo),
      new THREE.LineBasicMaterial({ color: 0x6366f1, transparent: true, opacity: 0.15 })
    )
    globeGroup.add(wireframe)

    // Grid rings (latitude lines)
    for (let i = 1; i <= 4; i++) {
      const y = -1.8 + (3.6 * i) / 5
      const r = Math.sqrt(1.8 * 1.8 - y * y)
      const ringGeo = new THREE.TorusGeometry(r, 0.01, 16, 64)
      const ring = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({
        color: 0x6366f1,
        transparent: true,
        opacity: 0.12
      }))
      ring.position.y = y
      globeGroup.add(ring)
    }

    // Longitude rings
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI
      const ringGeo = new THREE.TorusGeometry(1.8, 0.01, 16, 64)
      const ring = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({
        color: 0x6366f1,
        transparent: true,
        opacity: 0.12
      }))
      ring.rotation.y = angle
      globeGroup.add(ring)
    }

    // Equator highlight
    const equatorGeo = new THREE.TorusGeometry(1.8, 0.02, 16, 128)
    const equator = new THREE.Mesh(equatorGeo, new THREE.MeshBasicMaterial({
      color: 0x818cf8,
      transparent: true,
      opacity: 0.3
    }))
    equator.rotation.x = Math.PI / 2
    globeGroup.add(equator)

    // Particle dots on the surface (continent-like clusters)
    const dotsGroup = new THREE.Group()
    globeGroup.add(dotsGroup)

    const dotGeo = new THREE.SphereGeometry(0.02, 4, 4)
    const dotMat = new THREE.MeshBasicMaterial({ color: 0x818cf8, transparent: true, opacity: 0.8 })
    const dotMatDim = new THREE.MeshBasicMaterial({ color: 0xa78bfa, transparent: true, opacity: 0.4 })

    // Continent shapes as rough lat/lng clusters
    const continents: [number, number][] = [
      // North America
      ...[40, -100], [45, -90], [50, -80], [55, -70], [60, -60], [45, -110], [35, -95],
      // South America
      ...[0, -60], [-10, -55], [-20, -50], [-30, -45], [-20, -65], [-5, -70],
      // Europe
      ...[50, 10], [55, 15], [48, 5], [52, 20], [45, 25], [55, 30], [42, 15],
      // Africa
      ...[10, 10], [5, 20], [0, 15], [-10, 25], [-20, 20], [-30, 25], [15, 30], [5, 35],
      // Asia
      ...[55, 60], [50, 70], [45, 80], [40, 90], [35, 75], [30, 100], [25, 90], [35, 110], [45, 100],
      // Southeast Asia
      ...[15, 100], [10, 105], [5, 110], [0, 115], [-5, 120], [10, 120],
      // Australia
      ...[-25, 135], [-30, 145], [-25, 150], [-20, 140],
      // Japan
      ...[38, 138], [35, 137], [33, 135],
      // East Asia extra
      ...[40, 115], [35, 115], [30, 115],
    ]

    for (const [lat, lng] of continents) {
      // Add slight random jitter
      const jlat = lat + (Math.random() - 0.5) * 6
      const jlng = lng + (Math.random() - 0.5) * 6

      const phi = (90 - jlat) * (Math.PI / 180)
      const theta = (jlng + 180) * (Math.PI / 180)
      const r = 1.78

      const x = -r * Math.sin(phi) * Math.cos(theta)
      const y = r * Math.cos(phi)
      const z = r * Math.sin(phi) * Math.sin(theta)

      const dot = new THREE.Mesh(dotGeo, Math.random() > 0.3 ? dotMat : dotMatDim)
      dot.position.set(x, y, z)
      dotsGroup.add(dot)

      // Extra nearby dots for density
      if (Math.random() > 0.5) {
        for (let d = 0; d < 2; d++) {
          const dd = new THREE.Mesh(dotGeo, dotMatDim)
          const offset = 0.03
          dd.position.set(
            x + (Math.random() - 0.5) * offset,
            y + (Math.random() - 0.5) * offset,
            z + (Math.random() - 0.5) * offset
          )
          dd.position.normalize().multiplyScalar(r)
          dotsGroup.add(dd)
        }
      }
    }

    // Orbiting particles
    const orbitGroup = new THREE.Group()
    scene.add(orbitGroup)

    const orbitParticles: THREE.Mesh[] = []
    for (let i = 0; i < 12; i++) {
      const particle = new THREE.Mesh(
        new THREE.SphereGeometry(0.03, 8, 8),
        new THREE.MeshBasicMaterial({ color: 0x818cf8, transparent: true, opacity: 0.6 })
      )
      const angle = (i / 12) * Math.PI * 2
      const r = 2.2 + Math.random() * 0.6
      particle.userData = { angle, radius: r, speed: 0.001 + Math.random() * 0.002, y: (Math.random() - 0.5) * 0.8 }
      orbitGroup.add(particle)
      orbitParticles.push(particle)
    }

    // Animation
    let animationId: number
    function animate() {
      animationId = requestAnimationFrame(animate)

      globeGroup.rotation.y += 0.002
      globeGroup.rotation.x += 0.0003

      // Animate orbiting particles
      for (const p of orbitParticles) {
        p.userData.angle += p.userData.speed
        const a = p.userData.angle
        const r = p.userData.radius
        p.position.x = Math.cos(a) * r
        p.position.z = Math.sin(a) * r
        p.position.y = p.userData.y * Math.sin(Date.now() * 0.001)
      }

      // Point light orbits
      const t = Date.now() * 0.0005
      pointLight.position.x = Math.cos(t) * 3
      pointLight.position.z = Math.sin(t) * 3

      renderer.render(scene, camera)
    }
    animate()

    // Resize
    function onResize() {
      const w = container.clientWidth
      const h = container.clientHeight
      renderer.setSize(w, h)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', onResize)
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [loaded])

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full"
      style={{ pointerEvents: 'none' }}
    />
  )
}