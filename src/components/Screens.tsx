import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { REELS } from '../lib/data'
import { Sparkline, CountUp, usePRM } from '../lib/motion'
import Constellation from './Constellation'

/* ---------- Reel image with honest placeholder ---------- */
export function ReelImg({ reel, fill = false }: { reel: (typeof REELS)[number]; fill?: boolean }) {
  const [err, setErr] = useState(false)
  if (err) {
    return (
      <div className={`reel reel--placeholder`} style={fill ? { position: 'absolute', inset: 0, borderRadius: 0, boxShadow: 'none', aspectRatio: 'auto' } : undefined}>
        <div className="reel__ph"><b />Reel frame {reel.id}<br />drop file in /reels</div>
      </div>
    )
  }
  return <img src={reel.src} alt="" loading="lazy" decoding="async" onError={() => setErr(true)} style={fill ? { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' } : undefined} />
}

export function ReelCard({ reel, i, size }: { reel: (typeof REELS)[number]; i: number; size?: number }) {
  return (
    <div className="reel" style={size ? { width: size } : undefined}>
      <ReelImg reel={reel} fill />
      <div className="reel__scrim" />
      {i === 0 && <span className="reel__new" />}
      <span className="reel__views">{reel.views}</span>
      <div className="reel__meta"><i />{reel.handle}</div>
      <span className="reel__feedback">{reel.note}</span>
    </div>
  )
}

/* ---------- Weekly references ---------- */
export function ReferenceList({ compact = false }: { compact?: boolean }) {
  return (
    <div className="ui">
      {!compact && (<><div className="ui-title">This week</div><div className="ui-sub" style={{ marginTop: 2 }}>8 references from Mia R., your marketing manager</div></>)}
      <div className={compact ? undefined : 'reflist__grid'} style={compact ? { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 } : undefined}>
        {(compact ? REELS.slice(0, 2) : REELS).map((r, i) => <ReelCard key={r.id} reel={r} i={i} />)}
      </div>
      {!compact && (
        <div className="reflist__foot">
          <div style={{ background: 'var(--pink-50)', border: 'var(--bd-brand)', borderRadius: 'var(--r-md)', padding: '12px 14px' }}>
            <div className="ui-label" style={{ color: 'var(--pink-700)' }}>What to replicate · Reference 03</div>
            <div style={{ marginTop: 6, fontSize: 13 }}>Same hook, first two seconds. Mirror the angle. Caption stays playful.</div>
            <div style={{ display: 'flex', gap: 14, marginTop: 8 }} className="ui-label"><span>120K views, last 24h</span><span>1.4M total</span><span>40 trials posted</span></div>
          </div>
          <div style={{ display: 'grid', gap: 8 }}>
            <button className="btn btn--primary btn--sm" style={{ height: 34, fontSize: 12 }} tabIndex={-1}>Watch on Instagram</button>
            <button className="btn btn--ghost btn--sm" style={{ height: 34, fontSize: 12 }} tabIndex={-1}>Mark as filmed</button>
          </div>
        </div>
      )}
    </div>
  )
}

/* ---------- Pipeline rows ---------- */
const stages = ['Matched', 'With editor', 'Scheduled', 'Live']
export function PipelineRows() {
  const rows = [
    { f: 'IMG_4821', s: 0, l: 'Matched to Reference 03' },
    { f: 'IMG_4834', s: 1, l: 'With editor, Dani K.' },
    { f: 'IMG_4790', s: 2, l: 'Scheduled, tomorrow 6:00 PM' },
    { f: 'IMG_4766', s: 3, l: 'Live · 30K views' },
  ]
  return (
    <div className="ui">
      {rows.map((r) => (
        <div className="ui-row" key={r.f}>
          <div className="ui-thumb" />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 500, fontSize: 12 }}>{r.l}</div>
            <div className="ui-label" style={{ marginTop: 2 }}>{r.f} · 2h ago</div>
          </div>
          <div className="stepper" aria-hidden>
            {stages.map((_, i) => <span key={i} className={`stepper__dot ${i < r.s ? 'is-done' : i === r.s ? 'is-cur' : ''}`} />)}
          </div>
          <span className="ui-label" style={{ color: r.s === 3 ? 'var(--state-live)' : 'var(--pink-700)', minWidth: 62, textAlign: 'right' }}>{stages[r.s]}</span>
        </div>
      ))}
    </div>
  )
}

/* ---------- Upload sheet: 4-phase AI matching loop ---------- */
const chips = ['Reference 03', 'Kitchen / golden hour', 'Editor: Dani K.']
export function UploadSheet({ big = false }: { big?: boolean }) {
  const prm = usePRM()
  const [phase, setPhase] = useState(prm ? 3 : 0)
  useEffect(() => {
    if (prm) return
    let alive = true
    const seq = async () => {
      const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))
      while (alive) {
        setPhase(0); await wait(900)
        if (!alive) break; setPhase(1); await wait(1300)
        if (!alive) break; setPhase(2); await wait(1200)
        if (!alive) break; setPhase(3); await wait(800 + 1200)
        if (!alive) break; setPhase(-1); await wait(400)
      }
    }
    seq()
    return () => { alive = false }
  }, [prm])
  const pct = phase < 1 ? 0 : phase === 1 || phase === 2 ? 72 : 100
  const done = phase === 3
  const tiles = Array.from({ length: 9 })
  const sel = new Set([1, 4, 6])
  return (
    <div className={`ui upload glass ${big ? 'upload--big' : ''}`}>
      <div className="upload__grab" />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div className="ui-title">Upload</div>
        <div className="ui-label">{phase >= 0 ? '3 selected' : 'Camera roll'}</div>
      </div>
      <div className="ui-sub" style={{ marginTop: 2 }}>Select clips from your camera roll</div>
      <div className="upload__grid">
        {tiles.map((_, i) => {
          const isSel = sel.has(i) && phase >= 0
          return (
            <motion.div key={i} className={`upload__tile ${isSel ? 'is-sel' : ''}`} animate={{ scale: isSel ? 0.94 : 1 }} transition={{ duration: 0.18, ease: [0.34, 1.56, 0.64, 1] }}>
              <span className="upload__check">{isSel && <svg width="10" height="10" viewBox="0 0 10 10"><path d="M2 5.2l2 2 4-4.4" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>}</span>
            </motion.div>
          )
        })}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 14 }} className="ui-label">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span key={done ? 'd' : phase >= 1 ? 'm' : 'u'} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.2 }} style={{ color: done ? 'var(--state-live)' : undefined }}>
            {done ? '3 matched' : phase >= 1 ? 'Matching' : 'Uploading 12 clips, 4 done'}
          </motion.span>
        </AnimatePresence>
        <span className="tabular">{pct}%</span>
      </div>
      <div className={`bar ${done ? 'is-done' : ''}`} style={{ marginTop: 6 }}><motion.b animate={{ width: `${pct}%` }} transition={{ duration: phase === 1 ? 1.3 : 0.8, ease: [0.65, 0, 0.35, 1] }} /></div>
      <div className="upload__chips">
        {chips.map((c, i) => (
          <motion.span key={c} className="chip chip--pink" initial={false} animate={{ opacity: phase >= 2 ? 1 : 0, scale: phase >= 2 ? 1 : 0.8 }} transition={{ duration: 0.26, delay: phase >= 2 ? i * 0.16 : 0, ease: [0.34, 1.56, 0.64, 1] }}>{c}</motion.span>
        ))}
      </div>
      <div className="upload__foot">
        <AnimatePresence>{done && <motion.div className="upload__toast" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.32 }}>
          <svg width="14" height="14" viewBox="0 0 14 14"><motion.path d="M2.5 7.5l3 3 6-6.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.38 }} /></svg>
          12 clips sent. You are done.
        </motion.div>}</AnimatePresence>
        <div className="ui-sub" style={{ fontSize: 11 }}>Keep the app open or close it. Uploads finish either way.</div>
      </div>
    </div>
  )
}

/* ---------- Distribution network ---------- */
export function NetworkScreen({ dark = false }: { dark?: boolean }) {
  const tiles = [
    { h: '@account_12', f: '4.2K followers', s: 'live', l: '3 posts today · 80K views', sp: [3, 5, 4, 7, 6, 9, 8, 11] },
    { h: '@account_27', f: '1.1K followers', s: 'warm', l: 'live in 3 days', sp: [1, 1, 2, 2, 3, 3, 4, 4] },
    { h: '@account_31', f: '3.8K followers', s: 'ban', l: 'new account added', sp: [6, 7, 6, 5, 4, 2, 1, 0] },
    { h: '@account_08', f: '6.0K followers', s: 'live', l: '2 posts today · 41K views', sp: [4, 4, 5, 6, 5, 7, 8, 8] },
  ]
  return (
    <div className="ui net">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 8 }}>
        <div className="ui-title">Your network</div>
        <div className="ui-label">40 accounts · 32 live · 6 warming · 2 replaced</div>
      </div>
      <div className="net__canvas"><Constellation dark={dark} count={80} /></div>
      <div className="net__tiles">
        {tiles.map((t, i) => (
          <motion.div key={t.h} className={`ntile ntile--${t.s}`} initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: t.s === 'warm' ? 0.86 : 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span className="ntile__av" /><span style={{ fontWeight: 500, fontSize: 12 }}>{t.h}</span></div>
            <div className="ui-label" style={{ marginTop: 6 }}>{t.f}</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 }}>
              <span className="ui-label" style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><span className={`dot dot--${t.s}`} />{t.s === 'live' ? 'Live' : t.s === 'warm' ? 'Warming' : 'Replaced'}</span>
              <Sparkline points={t.sp} w={44} h={14} id={`nsp${i}`} />
            </div>
            <div className="ui-sub" style={{ fontSize: 10, marginTop: 4 }}>{t.l}</div>
            {t.s === 'warm' && <span className="ntile__warm" />}
          </motion.div>
        ))}
      </div>
      <div className="ui-sub" style={{ marginTop: 10, fontSize: 11 }}>Replacements are handled for you. You do not lose a day.</div>
    </div>
  )
}

/* ---------- Growth dashboard ---------- */
export function GrowthScreen() {
  const stats = [
    { l: 'Views today', v: 900000, f: (n: number) => `${Math.round(n / 1000)}K`, d: '+18%' },
    { l: 'Trials posted', v: 60, f: (n: number) => `${Math.round(n)}`, d: '+6' },
    { l: 'New followers', v: 2400, f: (n: number) => Math.round(n).toLocaleString('en-US'), d: '+12%' },
    { l: 'To your fan page', v: 180, f: (n: number) => `${Math.round(n)}`, d: '+22%' },
  ]
  const series = [22, 30, 26, 41, 38, 52, 47, 61, 58, 70, 66, 83, 79, 90]
  return (
    <div className="ui growth">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
        <div><div className="ui-title">Growth</div><div className="ui-label" style={{ display: 'inline-flex', gap: 6, alignItems: 'center', marginTop: 2 }}><span className="dot dot--live" style={{ animation: 'breathe 2.4s var(--e-in-out) infinite' }} />Updated just now</div></div>
        <div className="seg">{['Today', '7 days', '30 days'].map((s, i) => <span key={s} className={i === 1 ? 'is-on' : ''}>{s}</span>)}</div>
      </div>
      <div className="growth__stats">
        {stats.map((s) => (
          <div className="stat" key={s.l} style={{ minHeight: 0, padding: 14 }}>
            <div className="ui-label">{s.l}</div>
            <div className="stat__val" style={{ fontSize: 26 }}><CountUp to={s.v} format={s.f} /></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span className="delta">▲ {s.d}</span><span className="ui-label">Last 7 days</span></div>
          </div>
        ))}
      </div>
      <div className="growth__chart">
        <div className="ui-label">Views per day</div>
        <Sparkline points={series} w={520} h={110} id="bigspark" className="growth__spark" />
      </div>
      <div style={{ marginTop: 12 }}>
        <div className="ui-label" style={{ marginBottom: 4 }}>Top clips</div>
        {[['Clip 14', '400K views', '45 to fan page'], ['Clip 09', '220K views', '28 to fan page']].map((r) => (
          <div className="ui-row" key={r[0]} style={{ padding: '8px 0' }}><div className="ui-thumb" style={{ width: 22 }} /><span style={{ fontWeight: 500, flex: 1, fontSize: 12 }}>{r[0]}</span><span className="f-data" style={{ fontSize: 12 }}>{r[1]}</span><span className="ui-label">{r[2]}</span></div>
        ))}
      </div>
    </div>
  )
}

/* ---------- Creator research ---------- */
export function ResearchScreen() {
  const rows = [
    { n: 'Creator A', s: '2.1M followers · posts 4x week', hook: 'POV / Kitchen', v: '1.2M', t: '6 trial reels', sp: [2, 4, 3, 6, 8, 7, 11, 12], fresh: true },
    { n: 'Creator B', s: '860K followers · posts daily', hook: 'Face in frame', v: '700K', t: '4 trial reels', sp: [5, 5, 6, 5, 7, 8, 8, 9], fresh: false },
    { n: 'Creator C', s: '1.4M followers · posts 3x week', hook: 'Text opener', v: '410K', t: '3 trial reels', sp: [3, 2, 4, 4, 5, 4, 6, 6], fresh: true },
  ]
  return (
    <div className="ui research">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
        <div className="ui-title">Research</div>
        <div className="seg">{['Last 24h', 'Top views', 'Most trials'].map((s, i) => <span key={s} className={i === 0 ? 'is-on' : ''}>{s}</span>)}</div>
      </div>
      <div style={{ marginTop: 10 }}>
        {rows.map((r, i) => (
          <div className="rrow" key={r.n}>
            <div className="ui-thumb" style={{ width: 28, aspectRatio: '1', borderRadius: 8 }} />
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 500, fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}>{r.fresh && <span className="dot" style={{ background: 'var(--pink-400)' }} />}{r.n}</div>
              <div className="ui-label" style={{ marginTop: 2, textTransform: 'none', letterSpacing: 0 }}>{r.s}</div>
            </div>
            <span className="chip chip--n" style={{ height: 22, fontSize: 9 }}>{r.hook}</span>
            <span className="f-data" style={{ fontSize: 12, textAlign: 'right' }}>{r.v}</span>
            <Sparkline points={r.sp} w={56} h={18} id={`rsp${i}`} />
            <span className="ui-label" style={{ textAlign: 'right' }}>{r.t}</span>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 14, background: 'var(--n-50)', borderRadius: 'var(--r-md)', padding: '12px 14px', display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', gap: 12 }}>
        <div><div className="ui-label">Working hooks this week</div><div style={{ fontSize: 13, marginTop: 4 }}>POV opener, face in frame, first second.</div></div>
        <button className="btn btn--ghost btn--sm" style={{ height: 32, fontSize: 12 }} tabIndex={-1}>Save to my list</button>
      </div>
    </div>
  )
}

/* ---------- Team chat (phone) ---------- */
export function ChatScreen() {
  return (
    <div className="ui chat" style={{ '--ui-scale': 0.9 } as React.CSSProperties}>
      <div className="chat__head">
        <span className="chat__av">MR</span>
        <div><div style={{ fontWeight: 600, fontSize: 12 }}>Mia R.</div><div className="ui-label">Marketing manager</div></div>
      </div>
      <div className="chat__body">
        <div className="bubble bubble--in">Reference 03 is performing. Film two more like it.</div>
        <div className="bubble bubble--out">On it. Uploading tonight.</div>
        <div className="bubble bubble--in">
          <div className="ui-label" style={{ marginBottom: 6 }}>Dani K. · Editor</div>
          <div className="ui-thumb" style={{ width: 64, marginBottom: 8, borderRadius: 8 }} />
          Approve this cut?
          <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
            <span className="btn btn--primary" style={{ height: 28, padding: '0 12px', fontSize: 11 }}>Approve</span>
            <span className="btn btn--ghost" style={{ height: 28, padding: '0 12px', fontSize: 11 }}>Ask for changes</span>
          </div>
        </div>
        <div className="ui-label" style={{ textAlign: 'center', marginTop: 4 }}>Also sent to your Telegram</div>
      </div>
    </div>
  )
}
