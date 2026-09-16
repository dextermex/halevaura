import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import ChromeObject from '../three/ChromeObject'
import { Reveal, usePRM } from '../lib/motion'

const steps = [
  { n: '01', t: 'See the reference', b: 'Your marketing manager sends a fresh list every week. Each one is a real reel with the hook, the angle and the caption vibe already written out for you.', shape: 'sphere' as const },
  { n: '02', t: 'Film and upload', b: 'Film everything in one go, then pick your clips from your camera roll. One upload, no folders, no file names, nothing to organise.', shape: 'ring' as const },
  { n: '03', t: 'We handle the rest', b: 'Your clips go to your editor, then out across your accounts, posted by real people. You watch the numbers come in.', shape: 'pill' as const },
]

export default function HowItWorks() {
  const ref = useRef<HTMLElement>(null)
  const prm = usePRM()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 80%', 'end 60%'] })
  const line = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])
  return (
    <section ref={ref} id="how" className="section">
      <div className="container">
        <div style={{ maxWidth: 720 }}>
          <Reveal><span className="eyebrow">How it works</span></Reveal>
          <Reveal delay={0.05}><h2 className="f-h1" style={{ marginTop: 20 }}>Three steps. That is the whole job.</h2></Reveal>
        </div>
        <div className="steps">
          <motion.span className="steps__line" style={{ width: prm ? '100%' : line }} aria-hidden />
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.1} className="step">
              <div className="step__tile glass">
                <ChromeObject shape={s.shape} spin={i % 2 ? -0.5 : 0.5} zoom={4.8} float className="step__obj" />
              </div>
              <div className="step__num f-serif">{s.n}</div>
              <h3 className="f-h3" style={{ marginTop: 6 }}>{s.t}</h3>
              <p className="f-body" style={{ marginTop: 12 }}>{s.b}</p>
            </Reveal>
          ))}
        </div>
        <Reveal><p className="f-mono" style={{ marginTop: 'clamp(40px, 5vw, 72px)', textAlign: 'center' }}>That is it. Everything else happens behind the app.</p></Reveal>
      </div>
    </section>
  )
}
