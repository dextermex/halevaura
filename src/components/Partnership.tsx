import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import ChromeObject from '../three/ChromeObject'
import { Reveal, usePRM } from '../lib/motion'
import { Wordmark } from './Nav'

export default function Partnership() {
  const ref = useRef<HTMLElement>(null)
  const prm = usePRM()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const progress = useTransform(scrollYProgress, [0, 1], prm ? [0.5, 0.5] : [0, 1])
  const agencyOp = useTransform(scrollYProgress, [0.35, 0.7], prm ? [1, 1] : [1, 0])
  const agencyX = useTransform(scrollYProgress, [0, 0.7], prm ? [0, 0] : [0, 40])
  const markOp = useTransform(scrollYProgress, [0.55, 0.9], prm ? [1, 1] : [0, 1])
  const markS = useTransform(scrollYProgress, [0.55, 0.9], prm ? [1, 1] : [0.9, 1])
  return (
    <section ref={ref} id="partnership" className="partner">
      <div className="partner__sticky">
        <div className="container" style={{ textAlign: 'center' }}>
          <Reveal amount={0.4}><span className="eyebrow">Two agencies. One technology.</span></Reveal>
          <div className="partner__row">
            <motion.span className="partner__agency" style={{ opacity: agencyOp, x: agencyX }}>Halevora</motion.span>
            <div className="partner__obj"><ChromeObject shape="merge" progress={progress} spin={0.12} zoom={5.2} float={false} /></div>
            <motion.span className="partner__agency" style={{ opacity: agencyOp, x: useTransform(agencyX, (v) => -v) }}>Aura</motion.span>
          </div>
          <motion.div className="partner__mark" style={{ opacity: markOp, scale: markS }}>
            <Wordmark style={{ fontSize: 'var(--fs-display)', fontWeight: 700, letterSpacing: '-0.04em' }} />
          </motion.div>
          <Reveal amount={0.3} delay={0.05}><p className="f-serif partner__quote">Halevora and Aura already run creator businesses at scale, every day. Rather than stitch together other people's tools, the two agencies built their own. The halevaura creator app is that technology, and every capability listed here is available today.</p></Reveal>
          <Reveal amount={0.3} delay={0.1}><p className="f-mono" style={{ marginTop: 28 }}>Aura x Halevora · One app · Your whole operation behind it</p></Reveal>
        </div>
      </div>
    </section>
  )
}
