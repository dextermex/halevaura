import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import ChromeObject from '../three/ChromeObject'
import { Magnetic, Reveal, usePRM } from '../lib/motion'
import { APPLY_HREF } from '../lib/data'

export default function FinalCTA() {
  const ref = useRef<HTMLElement>(null)
  const prm = usePRM()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] })
  const y = useTransform(scrollYProgress, [0, 1], prm ? ['10%', '10%'] : ['60%', '0%'])
  const glow = useTransform(scrollYProgress, [0, 1], prm ? [0.8, 0.8] : [0.3, 1])
  return (
    <section ref={ref} id="apply" className="cta">
      <motion.div className="cta__glow" style={{ opacity: glow }} aria-hidden />
      <div className="cta__sphere" aria-hidden><motion.div style={{ y, width: '100%', height: '100%' }}><ChromeObject shape="sphere" spin={0.05} zoom={2.8} float={false} /></motion.div></div>
      <div className="container cta__inner">
        <Reveal amount={0.5}><span className="eyebrow">Apply</span></Reveal>
        <Reveal amount={0.5} delay={0.05}><h2 className="f-display grad-text" style={{ fontSize: 'var(--fs-display)', marginTop: 20 }}>You create. We handle everything else.</h2></Reveal>
        <Reveal amount={0.5} delay={0.1}><p className="f-lede" style={{ marginTop: 22, marginInline: 'auto', textAlign: 'center' }}>Your creator business, all in one app. Every capability listed is available today.</p></Reveal>
        <Reveal amount={0.5} delay={0.15}>
          <div className="cta__btns">
            <Magnetic radius={40}><a className="btn btn--primary btn--lg" href={APPLY_HREF} style={{ height: 56 }}><span className="btn__label">Apply to halevaura</span></a></Magnetic>
            <a className="btn btn--ghost btn--lg" href="#features" style={{ height: 56 }}>See the app</a>
          </div>
        </Reveal>
        <Reveal amount={0.5} delay={0.2}><p className="f-mono" style={{ marginTop: 20 }}>Reviewed by a real manager · Usually within 48 hours</p></Reveal>
      </div>
    </section>
  )
}
