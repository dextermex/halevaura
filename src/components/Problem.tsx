import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { Reveal, usePRM } from '../lib/motion'

const artefacts = [
  { kind: 'drive', title: 'Content_FINAL_v3 (2)', sub: 'Upload failed at 94% · Retry', rot: -6 },
  { kind: 'voice', title: 'Voice note · 1:42', sub: 'WhatsApp · "which one is the final cut?"', rot: 4 },
  { kind: 'sheet', title: 'Q3_posting_schedule.xlsx', sub: 'Cell C14: "ask editor??"', rot: -3 },
  { kind: 'msg', title: 'Where is the edit?', sub: 'Sent 3 days ago · No reply', rot: 5 },
]

const pains = [
  'Uploads crawl. Then they fail at 94 percent.',
  'Folders multiply. Nobody knows which cut is final.',
  'Clips disappear between editors and never go live.',
]

function Icon({ kind }: { kind: string }) {
  const common = { width: 18, height: 18, viewBox: '0 0 18 18', fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  if (kind === 'drive') return <svg {...common}><path d="M2 5.5h5l1.5 2H16v7H2z" /></svg>
  if (kind === 'voice') return <svg {...common}><path d="M9 3v12M5 6v6M13 6v6M2 8v2M16 8v2" /></svg>
  if (kind === 'sheet') return <svg {...common}><rect x="2.5" y="3" width="13" height="12" rx="1.5" /><path d="M2.5 8h13M2.5 12h13M8 3v12" /></svg>
  return <svg {...common}><path d="M3 4h12v8H8l-4 3v-3H3z" /></svg>
}

export default function Problem() {
  const ref = useRef<HTMLElement>(null)
  const prm = usePRM()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const sat = useTransform(scrollYProgress, [0.2, 0.8], prm ? [0, 0] : [0.6, 0])
  const filter = useTransform(sat, (s) => `grayscale(${1 - s}) saturate(${0.4 + s})`)
  const spread = useTransform(scrollYProgress, [0.15, 0.85], prm ? [1, 1] : [0.9, 1.1])
  const lineW = useTransform(scrollYProgress, [0.3, 0.9], ['0%', '100%'])

  return (
    <section ref={ref} id="problem" className="section problem" style={{ background: 'var(--bg-sunken)' }}>
      <div className="container problem__grid">
        <div>
          <Reveal><span className="eyebrow">The problem</span></Reveal>
          <Reveal delay={0.05}><h2 className="f-h1" style={{ marginTop: 20 }}>Your best work is stuck in Drive.</h2></Reveal>
          <Reveal delay={0.1}><p className="f-lede" style={{ marginTop: 22 }}>You film all week. Then the real work starts, and it has nothing to do with content.</p></Reveal>
          <ul className="problem__pains">
            {pains.map((p, i) => (
              <Reveal as="li" key={p} delay={0.12 + i * 0.07}><span className="problem__num f-mono">0{i + 1}</span><span>{p}</span></Reveal>
            ))}
          </ul>
          <Reveal delay={0.3}><p className="f-body" style={{ marginTop: 28, maxWidth: '52ch' }}>You did not sign up to name files. You did not sign up to chase an editor at 2am, or to rebuild a folder because Drive gave up halfway. Every hour spent on logistics is an hour not spent on camera.</p></Reveal>
        </div>
        <div className="problem__stage">
          <motion.div className="problem__stack" style={{ filter, scale: spread }}>
            {artefacts.map((a, i) => (
              <motion.div key={a.title} className="artefact" style={{ rotate: a.rot, zIndex: 4 - i }}
                initial={prm ? false : { opacity: 0, y: 30, rotate: 0 }} whileInView={{ opacity: 1, y: 0, rotate: a.rot }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}>
                <span className="artefact__icon"><Icon kind={a.kind} /></span>
                <div><div className="artefact__t">{a.title}</div><div className="artefact__s">{a.sub}</div></div>
                <span className="artefact__badge">{a.kind === 'drive' ? '!' : a.kind === 'msg' ? '3d' : '…'}</span>
              </motion.div>
            ))}
          </motion.div>
          <motion.span className="problem__line" style={{ width: lineW }} />
        </div>
      </div>
      <div className="container" style={{ marginTop: 'clamp(64px, 8vw, 128px)' }}>
        <Reveal><h3 className="f-h2" style={{ maxWidth: '22ch' }}>So we built the other side of the job into one app.</h3></Reveal>
        <Reveal delay={0.08}><p className="f-lede" style={{ marginTop: 18, maxWidth: '58ch' }}>One upload. Everything after that is handled by people who do this all day. You open the app, see what to film, film it, send it. That is the whole job.</p></Reveal>
      </div>
    </section>
  )
}
