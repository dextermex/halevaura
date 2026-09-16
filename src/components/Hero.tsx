import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import ChromeObject from '../three/ChromeObject'
import { Magnetic, EASE_OUT, usePRM } from '../lib/motion'
import { APPLY_HREF } from '../lib/data'
import { UploadSheet, PipelineRows, ReferenceList } from './Screens'

const chips = ['Built in-house by Aura x Halevora', 'Texas-based phone operation', 'Available today']

export default function Hero() {
  const ref = useRef<HTMLElement>(null)
  const prm = usePRM()
  const [narrow, setNarrow] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 900px)')
    const on = () => setNarrow(mq.matches); on(); mq.addEventListener('change', on); return () => mq.removeEventListener('change', on)
  }, [])
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const sphereY = useTransform(scrollYProgress, [0, 1], ['0%', prm ? '0%' : '12%'])
  const sphereS = useTransform(scrollYProgress, [0, 1], [1, prm ? 1 : 1.08])
  const winY = useTransform(scrollYProgress, [0, 1], ['0%', prm ? '0%' : '-6%'])
  const fanFar = useTransform(scrollYProgress, [0, 1], [12, prm ? 12 : 18])
  const fanMid = useTransform(scrollYProgress, [0, 1], [8, prm ? 8 : 14])
  const fanNear = useTransform(scrollYProgress, [0, 1], [5, prm ? 5 : 11])
  const textOp = useTransform(scrollYProgress, [0, 0.7], [1, 0.2])

  const lines = ['You create.', 'We handle']
  const entrance = (i: number) => ({
    initial: prm ? false : { opacity: 0, y: '0.12em', clipPath: 'inset(110% 0 0 0)' },
    animate: { opacity: 1, y: 0, clipPath: 'inset(-10% 0 -12% 0)' },
    transition: { duration: 0.64, delay: 0.18 + i * 0.08, ease: EASE_OUT },
  })
  const win = (i: number) => ({
    initial: prm ? false : { opacity: 0, y: 40, rotateY: 14 },
    animate: { opacity: 1, y: 0, rotateY: 0 },
    transition: { duration: 0.72, delay: 0.56 + i * 0.09, ease: EASE_OUT },
  })

  return (
    <section ref={ref} id="top" className="hero">
      <div className="hero__glow" aria-hidden />
      {!narrow && <div className="hero__sphere">
        <motion.div style={{ y: sphereY, scale: sphereS, width: '100%', height: '100%' }}
          initial={prm ? false : { opacity: 0, scale: 0.86, filter: 'blur(14px)' }} animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }} transition={{ duration: 0.9, delay: 0.06, ease: EASE_OUT }}>
          <ChromeObject shape="sphere" pointer spin={0.06} className="hero__canvas" zoom={3.1} />
        </motion.div>
      </div>}

      <div className="container hero__grid">
        <motion.div className="hero__copy" style={{ opacity: textOp }}>
          {narrow && (
            <motion.div className="hero__miniobj" initial={prm ? false : { opacity: 0, scale: 0.86 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, ease: EASE_OUT }}>
              <ChromeObject shape="sphere" spin={0.1} zoom={4.6} float={false} />
            </motion.div>
          )}
          <motion.span className="eyebrow" initial={prm ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1, ease: EASE_OUT }}>
            Built by Aura and Halevora
          </motion.span>
          <h1 className="f-display hero__h1" style={{ fontSize: 'var(--fs-hero)', marginTop: 22 }}>
            {lines.map((l, i) => (
              <motion.span key={l} className="hero__line grad-text" {...entrance(i)}>{l}</motion.span>
            ))}
            <motion.span className="hero__line f-serif" style={{ color: 'var(--pink-600)', fontWeight: 400, letterSpacing: '-0.02em' }} {...entrance(2)}>
              everything else.
            </motion.span>
          </h1>
          <motion.p className="f-lede" style={{ marginTop: 28 }} initial={prm ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.52, delay: 0.42, ease: EASE_OUT }}>
            Upload, guidance, analytics and your whole team live in one app. One app instead of a dozen tabs.
          </motion.p>
          <motion.div className="hero__cta" initial={prm ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.52, delay: 0.5, ease: EASE_OUT }}>
            <Magnetic><a className="btn btn--primary btn--lg" href={APPLY_HREF}><span className="btn__label">Apply to halevaura</span></a></Magnetic>
            <a className="btn btn--ghost btn--lg" href="#features">See the app <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden><path d="M2 6h8M6.5 2.5L10 6l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></a>
          </motion.div>
          <motion.p className="f-mono" style={{ marginTop: 18 }} initial={prm ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7, duration: 0.5 }}>
            Applications are reviewed by a real manager
          </motion.p>
          <motion.ul className="hero__chips" initial={prm ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.8, ease: EASE_OUT }}>
            {chips.map((c) => <li key={c} className="chip chip--pink">{c}</li>)}
          </motion.ul>
        </motion.div>

        <div className="hero__stage" aria-hidden>
          <motion.div className="hero__win hero__win--far" style={{ y: winY, rotateY: fanFar, scale: 0.78 }} {...win(0)}>
            <div className="ui-window ui"><div className="ui-bar"><i /><i /><i /><span className="ui-label" style={{ marginLeft: 6 }}>This week</span></div><div style={{ padding: 14 }}><ReferenceList compact /></div></div>
          </motion.div>
          <motion.div className="hero__win hero__win--mid" style={{ y: winY, rotateY: fanMid, scale: 0.92 }} {...win(1)}>
            <div className="ui-window ui"><div className="ui-bar"><i /><i /><i /><span className="ui-label" style={{ marginLeft: 6 }}>Pipeline</span></div><div style={{ padding: '4px 14px 8px' }}><PipelineRows /></div></div>
          </motion.div>
          <motion.div className="hero__win hero__win--near" style={{ y: winY, rotateY: fanNear }} {...win(2)}>
            <UploadSheet />
          </motion.div>
        </div>
      </div>

      <a href="#problem" className="hero__scroll f-mono" aria-label="Scroll to see how it works">See how it works <span className="hero__scrollline" /></a>
    </section>
  )
}
