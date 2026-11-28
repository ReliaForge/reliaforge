import { useEffect, useRef } from "react"
import type { ThemeMode } from "../data/content"

interface HeroMeshCanvasProps {
  theme: ThemeMode
}

interface NodePoint {
  x: number
  y: number
  baseX: number
  baseY: number
  vx: number
  vy: number
  radius: number
  accent: boolean
}

interface PulsePacket {
  from: number
  to: number
  progress: number
  speed: number
  cyan: boolean
}

function buildNodes(width: number, height: number): NodePoint[] {
  const cols = width < 640 ? 5 : width < 1024 ? 7 : 9
  const rows = 4
  const nodes: NodePoint[] = []
  const padX = width * 0.06
  const padY = height * 0.1
  const stepX = (width - padX * 2) / Math.max(1, cols - 1)
  const stepY = (height - padY * 2) / Math.max(1, rows - 1)

  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      const seed = (r * 31 + c * 17 + 7) % 19
      const jitterX = ((seed - 9) / 9) * stepX * 0.24
      const jitterY = (((seed * 7) % 17 - 8) / 8) * stepY * 0.24
      const bx = padX + c * stepX + jitterX
      const by = padY + r * stepY + jitterY
      nodes.push({
        x: bx,
        y: by,
        baseX: bx,
        baseY: by,
        vx: ((seed % 5) - 2) * 0.08,
        vy: (((seed + 2) % 5) - 2) * 0.08,
        radius: seed % 4 === 0 ? 2.6 : 1.7,
        accent: seed % 5 === 0,
      })
    }
  }
  return nodes
}

function buildEdges(nodes: NodePoint[], maxDist: number): Array<[number, number]> {
  const edges: Array<[number, number]> = []
  for (let i = 0; i < nodes.length; i += 1) {
    for (let j = i + 1; j < nodes.length; j += 1) {
      const dx = nodes[i].baseX - nodes[j].baseX
      const dy = nodes[i].baseY - nodes[j].baseY
      if (Math.hypot(dx, dy) <= maxDist) {
        edges.push([i, j])
      }
    }
  }
  return edges
}

export function HeroMeshCanvas({ theme }: HeroMeshCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const isDark = theme === "dark"
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    let width = 0
    let height = 0
    let nodes: NodePoint[] = []
    let edges: Array<[number, number]> = []
    let pulses: PulsePacket[] = []
    let rafId = 0
    const pointer = { x: -9999, y: -9999, active: false }

    const setup = () => {
      const parent = canvas.parentElement
      if (!parent) return
      const rect = parent.getBoundingClientRect()
      width = Math.max(320, rect.width)
      height = Math.max(360, Math.min(rect.height, 680))
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      nodes = buildNodes(width, height)
      const maxDist = Math.max(155, Math.min(250, width / 5.2))
      edges = buildEdges(nodes, maxDist)
      pulses = edges
        .filter((_, idx) => idx % 3 === 0)
        .slice(0, 14)
        .map(([from, to], idx) => ({
          from,
          to,
          progress: (idx * 0.17) % 1,
          speed: 0.0032 + (idx % 4) * 0.0009,
          cyan: idx % 3 === 1,
        }))
    }

    const draw = (time: number) => {
      ctx.clearRect(0, 0, width, height)

      const lineColor = isDark ? "148, 163, 184" : "71, 85, 105"
      const signalColor = isDark ? "52, 211, 153" : "5, 150, 105"
      const cyanColor = isDark ? "56, 189, 248" : "2, 132, 199"

      if (!reducedMotion) {
        const t = time * 0.00055
        for (let i = 0; i < nodes.length; i += 1) {
          const n = nodes[i]
          n.x = n.baseX + Math.sin(t + i * 0.9) * 9
          n.y = n.baseY + Math.cos(t * 0.85 + i * 1.1) * 7
        }
      }

      // Structural topology links
      ctx.lineWidth = 1
      for (const [aIdx, bIdx] of edges) {
        const a = nodes[aIdx]
        const b = nodes[bIdx]
        const midX = (a.x + b.x) * 0.5
        const midY = (a.y + b.y) * 0.5
        const ptrDist = pointer.active ? Math.hypot(midX - pointer.x, midY - pointer.y) : 999
        const boost = ptrDist < 190 ? (1 - ptrDist / 190) * 0.22 : 0
        const alpha = (isDark ? 0.11 : 0.1) + boost

        ctx.strokeStyle =
          boost > 0.06
            ? `rgba(${signalColor}, ${Math.min(0.45, alpha + 0.1)})`
            : `rgba(${lineColor}, ${alpha})`
        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(b.x, b.y)
        ctx.stroke()
      }

      // Ephemeral probe lines to cursor
      if (pointer.active && !reducedMotion) {
        for (const n of nodes) {
          const d = Math.hypot(n.x - pointer.x, n.y - pointer.y)
          if (d < 175) {
            const strength = (1 - d / 175) * (isDark ? 0.34 : 0.26)
            ctx.strokeStyle = `rgba(${signalColor}, ${strength})`
            ctx.beginPath()
            ctx.moveTo(n.x, n.y)
            ctx.lineTo(pointer.x, pointer.y)
            ctx.stroke()
          }
        }
      }

      // Telemetry pulses traveling across edges
      if (!reducedMotion) {
        for (const p of pulses) {
          p.progress += p.speed
          if (p.progress >= 1) {
            p.progress = 0
            if (edges.length > 0) {
              const nextEdge = edges[Math.floor(Math.random() * edges.length)]
              const flip = Math.random() > 0.5
              p.from = flip ? nextEdge[1] : nextEdge[0]
              p.to = flip ? nextEdge[0] : nextEdge[1]
            }
          }
          const a = nodes[p.from]
          const b = nodes[p.to]
          if (!a || !b) continue
          const x = a.x + (b.x - a.x) * p.progress
          const y = a.y + (b.y - a.y) * p.progress
          const tailProgress = Math.max(0, p.progress - 0.16)
          const tx = a.x + (b.x - a.x) * tailProgress
          const ty = a.y + (b.y - a.y) * tailProgress
          const color = p.cyan ? cyanColor : signalColor

          const grad = ctx.createLinearGradient(tx, ty, x, y)
          grad.addColorStop(0, `rgba(${color}, 0)`)
          grad.addColorStop(1, `rgba(${color}, ${isDark ? 0.82 : 0.72})`)
          ctx.strokeStyle = grad
          ctx.lineWidth = 1.6
          ctx.beginPath()
          ctx.moveTo(tx, ty)
          ctx.lineTo(x, y)
          ctx.stroke()

          ctx.fillStyle = `rgba(${color}, ${isDark ? 0.95 : 0.9})`
          ctx.beginPath()
          ctx.arc(x, y, 2.2, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      // Infrastructure nodes
      for (const n of nodes) {
        const ptrDist = pointer.active ? Math.hypot(n.x - pointer.x, n.y - pointer.y) : 999
        const near = ptrDist < 175
        const color = n.accent || near ? signalColor : lineColor
        const alpha = near ? 0.85 : n.accent ? (isDark ? 0.52 : 0.48) : isDark ? 0.34 : 0.28

        if (n.accent || near) {
          ctx.fillStyle = `rgba(${signalColor}, ${near ? 0.16 : 0.1})`
          ctx.beginPath()
          ctx.arc(n.x, n.y, n.radius * 3.2, 0, Math.PI * 2)
          ctx.fill()
        }

        ctx.fillStyle = `rgba(${color}, ${alpha})`
        ctx.beginPath()
        ctx.arc(n.x, n.y, near ? n.radius * 1.25 : n.radius, 0, Math.PI * 2)
        ctx.fill()
      }

      if (!reducedMotion) {
        rafId = window.requestAnimationFrame(draw)
      }
    }

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
        pointer.x = x
        pointer.y = y
        pointer.active = true
      } else {
        pointer.active = false
      }
    }

    const onPointerLeave = () => {
      pointer.active = false
    }

    setup()
    if (reducedMotion) {
      draw(0)
    } else {
      rafId = window.requestAnimationFrame(draw)
    }

    window.addEventListener("resize", setup)
    window.addEventListener("pointermove", onPointerMove, { passive: true })
    window.addEventListener("pointerleave", onPointerLeave)

    return () => {
      window.cancelAnimationFrame(rafId)
      window.removeEventListener("resize", setup)
      window.removeEventListener("pointermove", onPointerMove)
      window.removeEventListener("pointerleave", onPointerLeave)
    }
  }, [theme])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 z-0 [mask-image:linear-gradient(to_bottom,black_55%,transparent_100%)]"
    />
  )
}
