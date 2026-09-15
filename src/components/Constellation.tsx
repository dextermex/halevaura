import { useEffect, useRef } from 'react'

type Node = { x: number; y: number; ox: number; oy: number; amp: number; per: number; ph: number; state: 0 | 1 | 2; fade: number; born: number }

function mulberry(seed: number) { return () => { seed |= 0; seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296 } }

/** Deterministic account-network constellation. 0 = live, 1 = warming, 2 = replaced. */
export default function Constellation({ count = 96, dark = false, className, style }: { count?: number; dark?: boolean; className?: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const cv = ref.current!
    const ctx = cv.getContext('2d')!
    const prm = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const rnd = mulberry(1337)
    let W = 0, H = 0, dpr = 1
    const nodes: Node[] = []
    const mk = (x: number, y: number, state: Node['state'], born: number): Node => ({ x, y, ox: x, oy: y, amp: 6 + rnd() * 8, per: 6 + rnd() * 8, ph: rnd() * Math.PI * 2, state, fade: 1, born })
    const resize = () => {
      const r = cv.getBoundingClientRect()
      dpr = Math.min(2, window.devicePixelRatio || 1)
      W = r.width; H = r.height
      cv.width = W * dpr; cv.height = H * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      if (!nodes.length) {
        for (let i = 0; i < count; i++) {
          const s = rnd(); const state = s < 0.88 ? 0 : s < 0.97 ? 1 : 2
          nodes.push(mk(0.06 * W + rnd() * 0.88 * W, 0.08 * H + rnd() * 0.84 * H, state, -10))
        }
      }
    }
    resize()
    const ro = new ResizeObserver(resize); ro.observe(cv)
    const LIVE = dark ? '#3CDE93' : '#2FC17E', WARM = dark ? '#FBC456' : '#F0B13F', BAN = dark ? '#FC6568' : '#E44645'
    const linkCol = dark ? 'rgba(233,142,172,0.22)' : 'rgba(233,142,172,0.18)'
    const pulses: { a: number; b: number; t0: number }[] = []
    let lastPulse = 0, lastBan = 0, banIdx = -1, banT = 0
    let raf = 0
    const draw = (now: number) => {
      const t = now / 1000
      ctx.clearRect(0, 0, W, H)
      if (!prm) for (const n of nodes) { n.x = n.ox + Math.sin(t * (2 * Math.PI / n.per) + n.ph) * n.amp; n.y = n.oy + Math.cos(t * (2 * Math.PI / n.per) * 0.8 + n.ph) * n.amp * 0.7 }
      const maxD = Math.min(160, Math.max(90, W * 0.16))
      // links
      ctx.lineWidth = 1; ctx.strokeStyle = linkCol
      for (let i = 0; i < nodes.length; i++) for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j]; const dx = a.x - b.x, dy = a.y - b.y; const d = Math.hypot(dx, dy)
        if (d < maxD) { ctx.globalAlpha = (1 - d / maxD) * Math.min(a.fade, b.fade); ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke() }
      }
      ctx.globalAlpha = 1
      // pulses
      if (!prm && t - lastPulse > 2.6) { lastPulse = t; const a = Math.floor(rnd() * nodes.length); let b = -1, bd = 1e9; nodes.forEach((n, k) => { if (k === a) return; const d = Math.hypot(n.x - nodes[a].x, n.y - nodes[a].y); if (d < maxD && d < bd) { bd = d; b = k } }); if (b >= 0) pulses.push({ a, b, t0: t }) }
      for (let k = pulses.length - 1; k >= 0; k--) {
        const p = pulses[k]; const A = nodes[p.a], B = nodes[p.b]; const d = Math.hypot(B.x - A.x, B.y - A.y); const dur = d / 340; const u = (t - p.t0) / dur
        if (u > 1.5) { pulses.splice(k, 1); continue }
        const uu = Math.min(1, u); const x = A.x + (B.x - A.x) * uu, y = A.y + (B.y - A.y) * uu
        ctx.strokeStyle = '#E98EAC'; ctx.lineWidth = 3; ctx.globalAlpha = u > 1 ? 1 - (u - 1) * 2 : 1; ctx.beginPath(); ctx.moveTo(A.x + (x - A.x) * 0.85, A.y + (y - A.y) * 0.85); ctx.lineTo(x, y); ctx.stroke(); ctx.globalAlpha = 1
        if (u >= 1 && u < 1.42) { const s = 1 + Math.sin(((u - 1) / 0.42) * Math.PI) * 0.9; ctx.beginPath(); ctx.arc(B.x, B.y, 3 * s, 0, Math.PI * 2); ctx.fillStyle = '#E98EAC'; ctx.fill() }
      }
      // ban/replace loop every 9s
      if (!prm && t - lastBan > 9 && t > 3) { lastBan = t; banIdx = Math.floor(rnd() * nodes.length); banT = t; nodes[banIdx].state = 2 }
      if (banIdx >= 0) { const n = nodes[banIdx]; const u = t - banT; n.fade = Math.max(0.25, 1 - u / 0.6); if (u > 1.4 && u < 1.45) { const nn = mk(n.ox + (rnd() - 0.5) * 60, n.oy + (rnd() - 0.5) * 60, 1, t); nn.fade = 0; nodes.push(nn) } if (u > 8) { nodes.splice(banIdx, 1); banIdx = -1 } }
      for (const n of nodes) if (n.born > 0 && n.fade < 1) n.fade = Math.min(1, n.fade + 0.02)
      // nodes
      for (const n of nodes) {
        ctx.globalAlpha = n.fade
        ctx.beginPath(); ctx.arc(n.x, n.y, n.state === 1 ? 3 : 2.6, 0, Math.PI * 2)
        ctx.fillStyle = n.state === 0 ? LIVE : n.state === 1 ? WARM : BAN; ctx.fill()
        if (n.state === 1) { ctx.beginPath(); ctx.arc(n.x, n.y, 6 + Math.sin(t * 2 + n.ph) * 1.5, 0, Math.PI * 2); ctx.strokeStyle = WARM; ctx.globalAlpha = 0.35 * n.fade; ctx.lineWidth = 1; ctx.stroke() }
      }
      ctx.globalAlpha = 1
      if (!prm) raf = requestAnimationFrame(draw)
    }
    if (prm) { const b = nodes[5]; b.state = 2; b.fade = 0.25; nodes.push(mk(b.ox + 40, b.oy + 30, 1, 0)); draw(0) } else raf = requestAnimationFrame(draw)
    return () => { cancelAnimationFrame(raf); ro.disconnect() }
  }, [count, dark])
  return <canvas ref={ref} className={className} style={{ width: '100%', height: '100%', display: 'block', ...style }} aria-hidden />
}
