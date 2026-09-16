import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform } from 'motion/react'
import { Reveal, usePRM } from '../lib/motion'
import { ReferenceList, UploadSheet, NetworkScreen, GrowthScreen, ResearchScreen, PipelineRows } from './Screens'

const STEPS = [
  { id: 'references', eyebrow: 'Weekly content list', h: 'Never wonder what to film again.', b: 'Every week your marketing manager drops a fresh list. Each reference is a real reel you can watch, with notes on what to replicate, the hook, the angle and the caption vibe. Tap one to see how it actually performed before you film. No guessing, no blank page, no group chat archaeology.', f: ['Real reels to watch, not written briefs', 'Hook, angle and caption vibe on every card', 'Live performance on each reference before you film'] },
  { id: 'upload', eyebrow: 'Upload', h: 'Upload once. Never touch a folder.', b: 'Film all week, then select your clips from your camera roll and send them in one go. The app matches every clip to the right reference on its own, then hands it to an editor on your team who is free right now. No naming, no folders, no Drive. Nothing gets lost, ever.', f: ['Select straight from your camera roll', 'Clips matched to references automatically', 'Routed to an available editor on your team'] },
  { id: 'network', eyebrow: 'Distribution', h: 'Your clips go out. Everywhere.', b: 'Once your clip is edited, it goes out across your network of Instagram accounts. Real people on real phones in Texas post every one of them by hand. New accounts are warmed up before they ever carry your content. You see which accounts are warming, which are live, and what each one is doing.', f: ['Real publishers in Texas, posting manually', 'Accounts warmed up before they go live', 'Instant alert if an account is replaced'] },
  { id: 'growth', eyebrow: 'Growth OS', h: 'Your whole business, one screen.', b: 'Views per day, per account. Trials posted per day. Which reel sent which fan to your fan page. Followers, top clips, what is climbing and what is flat. It updates all day, and you can open it any time. Full oversight of your own business, without asking anyone for a report.', f: ['Views by day and by account', 'Trials posted, tracked daily', 'Which reel brought which fan to your fan page'] },
  { id: 'research', eyebrow: 'Research', h: 'See what is working right now.', b: 'Browse other creators in the network. See what they posted in the last 24 hours, how it performed, how many trial reels they run a day and which hooks are landing. This is the exact research your marketing managers do every morning. Now it is in your hand too.', f: ['Last 24 hours across the network', 'Views, trial reels per day, top hooks', 'The same view your manager works from'] },
]

function Screen({ i }: { i: number }) {
  if (i === 0) return <ReferenceList />
  if (i === 1) return (
    <div className="tour__upload">
      <UploadSheet big />
      <div className="tour__pipeline">
        <div className="ui-label" style={{ marginBottom: 4 }}>Status · 12 clips</div>
        <PipelineRows />
        <div className="ui-sub" style={{ marginTop: 12, fontSize: 11 }}>Every clip is matched, edited, scheduled and posted. You only see the status.</div>
      </div>
    </div>
  )
  if (i === 2) return <NetworkScreen />
  if (i === 3) return <GrowthScreen />
  return <ResearchScreen />
}

function StepText({ s, i, active }: { s: (typeof STEPS)[number]; i: number; active: boolean }) {
  return (
    <div className={`tour__step ${active ? 'is-active' : ''}`} id={i === 2 ? 'network' : undefined}>
      <span className="eyebrow">{s.eyebrow}</span>
      <h3 className="f-h2" style={{ marginTop: 16 }}>{s.h}</h3>
      <p className="f-body" style={{ marginTop: 16, maxWidth: '48ch' }}>{s.b}</p>
      <ul className="tour__feat">{s.f.map((f) => <li key={f}>{f}</li>)}</ul>
    </div>
  )
}

export default function AppTour() {
  const ref = useRef<HTMLDivElement>(null)
  const prm = usePRM()
  const [active, setActive] = useState(0)
  const [narrow, setNarrow] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 960px)')
    const on = () => setNarrow(mq.matches); on(); mq.addEventListener('change', on); return () => mq.removeEventListener('change', on)
  }, [])
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  useMotionValueEvent(scrollYProgress, 'change', (p) => { const n = Math.min(STEPS.length - 1, Math.max(0, Math.floor(p * STEPS.length))); if (n !== active) setActive(n) })
  const rail = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <section id="features" className="tour" ref={ref} style={{ height: narrow ? 'auto' : `${(STEPS.length + 1) * 100}vh` }}>
      <div className="container" style={{ paddingTop: 'var(--section-y)' }}>
        <Reveal><span className="eyebrow">Features</span></Reveal>
        <Reveal delay={0.05}><h2 className="f-h1" style={{ marginTop: 20, maxWidth: '16ch' }}>Everything after the camera, handled.</h2></Reveal>
      </div>
      {narrow ? (
        <div className="container tour__stack">
          {STEPS.map((s, i) => (
            <div key={s.id} className="tour__stackitem">
              <StepText s={s} i={i} active />
              <div className="tour__window ui-window" style={{ marginTop: 24 }}><div className="ui-bar"><i /><i /><i /></div><div className="tour__screen"><Screen i={i} /></div></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="tour__sticky">
          <div className="container tour__grid">
            <div className="tour__text">
              <span className="tour__rail"><motion.span style={{ scaleY: rail }} /></span>
              <AnimatePresence mode="wait">
                <motion.div key={active} initial={prm ? false : { opacity: 0.4, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}>
                  <StepText s={STEPS[active]} i={active} active />
                </motion.div>
              </AnimatePresence>
              <div className="tour__dots">{STEPS.map((s, i) => <span key={s.id} className={i === active ? 'is-on' : ''} />)}</div>
            </div>
            <div className="tour__stage">
              <motion.div className={`tour__window ui-window ${active >= 2 ? 'is-lit' : ''}`} style={{ rotateY: -6, rotateX: 3 }}>
                <div className="ui-bar"><i /><i /><i /><span className="ui-label" style={{ marginLeft: 6 }}>halevaura · {STEPS[active].eyebrow}</span></div>
                <div className="tour__screen">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.div key={active} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.42, ease: [0.65, 0, 0.35, 1] }}>
                      <Screen i={active} />
                    </motion.div>
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
