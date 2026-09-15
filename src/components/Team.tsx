import { motion } from 'motion/react'
import { Reveal, usePRM } from '../lib/motion'
import { ChatScreen } from './Screens'

const cards = [
  { r: 'Your marketing manager', b: 'Sends your weekly list, writes the notes on every reference, and tells you what is working. One message away, every day.', m: 'Weekly list · notes · results' },
  { r: 'Your editors', b: 'Your own in-house editors. They get your clips the moment you upload, cut them, and send them back for approval.', m: 'In-house · same day · you approve' },
  { r: 'Your publishers', b: 'The Texas team that posts your edited clips across your accounts, by hand, on schedule.', m: 'Texas · by hand · on schedule' },
]

export default function Team() {
  const prm = usePRM()
  return (
    <section id="team" className="section">
      <div className="container">
        <div className="team__head">
          <div>
            <Reveal><span className="eyebrow">Your team</span></Reveal>
            <Reveal delay={0.05}><h2 className="f-h1" style={{ marginTop: 20 }}>Your team, inside the app.</h2></Reveal>
            <Reveal delay={0.1}><p className="f-lede" style={{ marginTop: 20 }}>Chat, feedback and approvals in one thread. Mirrored to Telegram and WhatsApp, so nothing is missed.</p></Reveal>
          </div>
        </div>
        <div className="team__grid">
          {cards.map((c, i) => (
            <motion.article key={c.r} className="tcard" initial={prm ? false : { opacity: 0, rotateX: 12, y: 24 }} whileInView={{ opacity: 1, rotateX: 0, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6, delay: i * 0.09, ease: [0.16, 1, 0.3, 1] }}>
              <span className="tcard__trace" aria-hidden />
              <div className="tcard__num f-serif">0{i + 1}</div>
              <h3 className="f-h3" style={{ color: '#F4F0F4', marginTop: 'auto' }}>{c.r}</h3>
              <p style={{ color: '#B3AFB6', marginTop: 12, fontSize: 'var(--fs-body-sm)', textWrap: 'pretty' }}>{c.b}</p>
              <div className="f-mono" style={{ marginTop: 18, color: 'var(--pink-400)' }}>{c.m}</div>
            </motion.article>
          ))}
          <motion.div className="tcard tcard--chat" initial={prm ? false : { opacity: 0, rotateX: 12, y: 24 }} whileInView={{ opacity: 1, rotateX: 0, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6, delay: 0.27, ease: [0.16, 1, 0.3, 1] }}>
            <div className="tcard__chatwrap"><ChatScreen /></div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
