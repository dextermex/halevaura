import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from 'react'
import { motion, useInView, useMotionValue, useSpring, useTransform, animate, useReducedMotion } from 'motion/react'

export const EASE_OUT = [0.16, 1, 0.3, 1] as const
export const EASE_HEAVY = [0.83, 0, 0.17, 1] as const

export function usePRM() {
  const prm = useReducedMotion()
  return !!prm
}

/** Reveal-once wrapper: fade + translate + optional clip wipe. */
export function Reveal({
  children, delay = 0, y = 18, as = 'div', className, style, wipe = false, amount = 0.35, once = true,
}: {
  children: ReactNode; delay?: number; y?: number; as?: 'div' | 'span' | 'li' | 'p' | 'h1' | 'h2' | 'h3'; className?: string; style?: CSSProperties; wipe?: boolean; amount?: number; once?: boolean
}) {
  const prm = usePRM()
  const M = motion[as] as typeof motion.div
  const hidden = wipe
    ? { opacity: 0, y: '0.12em', clipPath: 'inset(110% 0 0 0)' }
    : { opacity: 0, y }
  const shown = wipe
    ? { opacity: 1, y: 0, clipPath: 'inset(-10% 0 -10% 0)' }
    : { opacity: 1, y: 0 }
  return (
    <M
      className={className}
      style={style}
      initial={prm ? false : hidden}
      whileInView={shown}
      viewport={{ once, amount }}
      transition={{ duration: wipe ? 0.64 : 0.56, delay, ease: EASE_OUT }}
    >
      {children}
    </M>
  )
}

/** Magnetic pill: pointer-tracked offset, spring home on leave. Coarse pointers get press only. */
export function Magnetic({ children, radius = 28, strength = 0.28, clamp = 14, className, style }: { children: ReactNode; radius?: number; strength?: number; clamp?: number; className?: string; style?: CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null)
  const prm = usePRM()
  const x = useMotionValue(0), y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 260, damping: 26 })
  const sy = useSpring(y, { stiffness: 260, damping: 26 })
  const lx = useTransform(sx, (v) => v * 0.5)
  const ly = useTransform(sy, (v) => v * 0.5)
  useEffect(() => {
    if (prm || !window.matchMedia('(pointer: fine)').matches) return
    const el = ref.current
    if (!el) return
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2
      const dx = e.clientX - cx, dy = e.clientY - cy
      const inside = Math.abs(dx) < r.width / 2 + radius && Math.abs(dy) < r.height / 2 + radius
      if (!inside) { x.set(0); y.set(0); return }
      const c = (v: number) => Math.max(-clamp, Math.min(clamp, v))
      x.set(c(dx * strength)); y.set(c(dy * strength))
    }
    window.addEventListener('pointermove', move, { passive: true })
    return () => window.removeEventListener('pointermove', move)
  }, [prm, radius, strength, clamp, x, y])
  return (
    <motion.div ref={ref} style={{ x: sx, y: sy, display: 'inline-block', ...style }} className={className}>
      <motion.div style={{ x: lx, y: ly }}>{children}</motion.div>
    </motion.div>
  )
}

/** Count-up in the value's real format. */
export function CountUp({ to, format, className, duration = 1.4 }: { to: number; format?: (n: number) => string; className?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.4 })
  const prm = usePRM()
  const fmt = format ?? ((n: number) => Math.round(n).toLocaleString('en-US'))
  const [v, setV] = useState(prm ? to : 0)
  useEffect(() => {
    if (!inView || prm) return
    const c = animate(0, to, { duration, ease: EASE_OUT, onUpdate: (n) => setV(n) })
    return () => c.stop()
  }, [inView, to, duration, prm])
  return (
    <span ref={ref} className={className} style={{ fontVariantNumeric: 'tabular-nums', display: 'inline-block', minWidth: `${fmt(to).length * 0.62}ch` }}>
      {fmt(v)}
    </span>
  )
}

export function Sparkline({ points, w = 120, h = 34, stroke = 'var(--pink-500)', id = 'sparkfill', className }: { points: number[]; w?: number; h?: number; stroke?: string; id?: string; className?: string }) {
  const max = Math.max(...points), min = Math.min(...points)
  const px = (i: number) => (i / (points.length - 1)) * (w - 6) + 3
  const py = (v: number) => h - 4 - ((v - min) / Math.max(1, max - min)) * (h - 10)
  const d = points.map((v, i) => `${i ? 'L' : 'M'}${px(i).toFixed(1)},${py(v).toFixed(1)}`).join(' ')
  const area = `${d} L${px(points.length - 1).toFixed(1)},${h} L${px(0).toFixed(1)},${h} Z`
  const lx = px(points.length - 1), ly = py(points[points.length - 1])
  return (
    <svg className={`spark ${className ?? ''}`} width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="rgba(214,123,159,0.22)" />
          <stop offset="1" stopColor="rgba(214,123,159,0)" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${id})`} />
      <motion.path d={d} fill="none" stroke={stroke} strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 0.9, ease: EASE_OUT }} />
      <circle cx={lx} cy={ly} r={4} fill={stroke} stroke="rgba(247,214,227,0.9)" strokeWidth={3} />
    </svg>
  )
}
