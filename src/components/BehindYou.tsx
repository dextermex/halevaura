import { useEffect, useRef } from 'react'
import { motion, useMotionValueEvent, useScroll, useTransform } from 'motion/react'
import { CountUp, Reveal, usePRM } from '../lib/motion'
import { NOTIFICATIONS } from '../lib/data'
import Constellation from './Constellation'

const LIGHT = [251, 250, 251], DARK = [15, 10, 19]
const mix = (t: number) => `rgb(${LIGHT.map((l, i) => Math.round(l + (DARK[i] - l) * t)).join(',')})`

export default function BehindYou() {
  const ref = useRef<HTMLElement>(null)
  const prm = usePRM()
  const { scrollYProgress: enter } = useScroll({ target: ref, offset: ['start 100%', 'start 70%'] })
  const { scrollYProgress: leave } = useScroll({ target: ref, offset: ['end 90%', 'end 55%'] })
  const heavy = (p: number) => { const c = [0.83, 0, 0.17, 1]; const t = p; return t < 0.5 ? 2 * t * t * (1 + c[0] * 0.2) : 1 - Math.pow(-2 * t + 2, 2) / 2 }
  const set = () => {
    const e = enter.get(), l = leave.get()
    const t = Math.max(0, Math.min(1, heavy(e) - heavy(l)))
    document.body.style.setProperty('--page-bg', mix(t))
  }
  useMotionValueEvent(enter, 'change', set)
  useMotionValueEvent(leave, 'change', set)
  useEffect(() => () => { document.body.style.removeProperty('--page-bg') }, [])
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const photoY = useTransform(scrollYProgress, [0, 1], prm ? ['0%', '0%'] : ['-6%', '6%'])
  const constOp = useTransform(scrollYProgress, [0, 0.3, 0.9], [0, 0.08, 0.04])

  return (
    <section ref={ref} id="operation" data-chapter="operation" className="behind">
      <motion.div className="behind__const" style={{ opacity: constOp }} aria-hidden><Constellation dark count={110} /></motion.div>
      <div className="behind__statement">
        <Reveal amount={0.5}><p className="f-mono" style={{ color: 'var(--pink-400)' }}>Behind you</p></Reveal>
        <Reveal amount={0.5} delay={0.06}><h2 className="f-display" style={{ fontSize: 'var(--fs-display)', marginTop: 20, color: 'var(--text)' }}>While you sleep, <span className="f-serif" style={{ color: 'var(--pink-400)', fontWeight: 400 }}>the phones are working.</span></h2></Reveal>
      </div>
      <div className="container behind__grid">
        <div>
          <Reveal><h3 className="f-h1">A real team. Real phones. Real people.</h3></Reveal>
          <Reveal delay={0.06}><p className="f-lede" style={{ marginTop: 20 }}>Distribution is not software running in the dark. It is a staffed operation in Texas.</p></Reveal>
          <Reveal delay={0.1}><p className="f-body" style={{ marginTop: 18, maxWidth: '52ch' }}>Your clips are posted by publishers in the United States, by hand, on real phones. Accounts are warmed up properly before they carry anything of yours, so they go into the world ready. If one gets banned, it is replaced and you are told, usually before you notice. Nothing about your posting depends on you remembering to do it.</p></Reveal>
          <Reveal delay={0.14}><p className="f-body" style={{ marginTop: 14, color: 'var(--text)' }}>You never have to manage any of this. You just get to see it.</p></Reveal>
          <ul className="trust">
            {['Posted by hand, from the United States.', 'Accounts warmed before they go live.', 'Banned account? Replaced, and you are notified.'].map((t, i) => (
              <Reveal as="li" key={t} delay={0.16 + i * 0.07}><span className="dot dot--live" />{t}</Reveal>
            ))}
          </ul>
        </div>
        <div className="behind__notifs" aria-label="Example notifications">
          {NOTIFICATIONS.map((n, i) => (
            <motion.div key={n.t} className="notif" initial={prm ? false : { opacity: 0, x: 40, scale: 0.96 }} whileInView={{ opacity: 1, x: 0, scale: 1 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.5, delay: i * 0.09, ease: [0.16, 1, 0.3, 1] }}>
              <span className="notif__icon"><span style={{ color: 'var(--pink-500)', fontWeight: 700 }}>h</span><span style={{ color: 'var(--pink-400)' }}>.</span></span>
              <div><div className="notif__app">halevaura · now</div><div className="notif__t">{n.t}</div></div>
              <span className={`dot dot--${n.k === 'ban' ? 'ban' : n.k === 'live' ? 'live' : 'warm'}`} style={n.k === 'info' ? { background: 'var(--state-info-dk)' } : undefined} />
            </motion.div>
          ))}
        </div>
      </div>
      <div className="behind__photo">
        <motion.img src="./media/farm.webp" width={1280} height={716} alt="A rack of phones in the Texas publishing operation, lit in pink" style={{ y: photoY }} loading="lazy" decoding="async" />
        <div className="behind__caption f-mono">TEXAS, US · PUBLISHING FLOOR · 04:12 CST · POSTED BY HAND</div>
      </div>
      <div className="container behind__stats">
        {[{ l: 'Devices online', v: 180, f: (n: number) => `${Math.round(n)}+` }, { l: 'Posts shipped / week', v: 4200, f: (n: number) => Math.round(n).toLocaleString('en-US') }, { l: 'Accounts recovered', v: 96, f: (n: number) => `${Math.round(n)}%` }].map((s, i) => (
          <Reveal key={s.l} delay={i * 0.08} className="bstat">
            <div className="f-mono">{s.l}</div>
            <div className="bstat__v"><CountUp to={s.v} format={s.f} /></div>
          </Reveal>
        ))}
        <Reveal delay={0.3} className="bstat bstat--note"><p className="f-mono" style={{ color: 'var(--text-3)', textTransform: 'none', letterSpacing: 0 }}>Illustrative figures. Your own dashboard shows your own numbers, live.</p></Reveal>
      </div>
    </section>
  )
}
