import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { APPLY_HREF } from '../lib/data'
import { usePRM } from '../lib/motion'

const cols = [
  { h: 'Product', l: [['How it works', '#how'], ['Features', '#features'], ['The network', '#network'], ['Your team', '#team']] },
  { h: 'Company', l: [['About', '#partnership'], ['Careers', '#'], ['Contact', 'mailto:hello@halevaura.com']] },
  { h: 'Legal', l: [['Privacy', '#'], ['Terms', '#'], ['Creator agreement', '#']] },
]

export default function Footer() {
  const ref = useRef<HTMLElement>(null)
  const prm = usePRM()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] })
  const y = useTransform(scrollYProgress, [0, 1], prm ? ['0%', '0%'] : ['30%', '0%'])
  return (
    <footer ref={ref} className="footer dark-scope">
      <div className="container footer__top">
        <div>
          <div className="footer__tag">Ready when you are.</div>
          <a className="btn btn--primary" href={APPLY_HREF} style={{ marginTop: 16 }}>Apply to halevaura</a>
          <p className="f-mono" style={{ marginTop: 16 }}>Every capability listed is available today</p>
        </div>
        <div className="footer__cols">
          {cols.map((c) => (
            <div key={c.h}>
              <div className="f-mono" style={{ color: 'var(--pink-400)' }}>{c.h}</div>
              <ul>{c.l.map(([t, h]) => <li key={t}><a href={h}>{t}</a></li>)}</ul>
            </div>
          ))}
        </div>
      </div>
      <div className="container footer__mid">
        <div className="footer__status"><span className="dot dot--live" style={{ background: 'var(--state-live-dk)', animation: 'breathe 2.4s var(--e-in-out) infinite' }} />ALL SYSTEMS OPERATIONAL</div>
        <div className="f-mono" style={{ color: 'var(--text-3)' }}>A joint venture by Halevora and Aura · © 2026 halevaura. All rights reserved.</div>
      </div>
      <div className="footer__markwrap" aria-hidden>
        <motion.div className="footer__mark" style={{ y }}>halev<span style={{ color: 'var(--pink-500)' }}>aura</span><span style={{ color: 'var(--pink-400)' }}>.</span></motion.div>
      </div>
    </footer>
  )
}
