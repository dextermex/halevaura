import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { NAV, APPLY_HREF } from '../lib/data'
import { Magnetic, EASE_OUT } from '../lib/motion'

export function Wordmark({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <span className={`wordmark ${className ?? ''}`} style={style}>halev<span style={{ color: 'var(--pink-500)' }}>aura</span><span className="wordmark__dot">.</span></span>
  )
}

export default function Nav() {
  const [condensed, setCondensed] = useState(false)
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const on = () => setCondensed(window.scrollY > 80)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  useEffect(() => { document.documentElement.style.overflow = open ? 'hidden' : '' }, [open])
  return (
    <>
      <header className={`nav ${condensed ? 'is-condensed glass' : ''}`} style={{ borderRadius: condensed ? 999 : 0 }}>
        <div className="nav__inner">
          <a href="#top" aria-label="halevaura home" style={{ fontSize: 22, lineHeight: 1 }}><Wordmark /></a>
          <nav className="nav__links" aria-label="Primary">
            {NAV.map((n) => <a key={n.href} href={n.href}>{n.label}</a>)}
          </nav>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span className="hide-sm"><Magnetic radius={20}>
              <a className="btn btn--primary btn--sm" href={APPLY_HREF}>{condensed ? 'Apply' : 'Apply to halevaura'}</a>
            </Magnetic></span>
            <button className="nav__burger" aria-label="Open menu" aria-expanded={open} onClick={() => setOpen(true)}>
              <span /><span />
            </button>
          </div>
        </div>
      </header>
      <AnimatePresence>
        {open && (
          <motion.div className="sheet" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <motion.div className="sheet__panel glass" initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 24, opacity: 0 }} transition={{ duration: 0.42, ease: EASE_OUT }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 24 }}><Wordmark /></span>
                <button aria-label="Close menu" onClick={() => setOpen(false)} className="faq-icon" style={{ width: 40, height: 40 }}>
                  <svg width="14" height="14" viewBox="0 0 14 14"><path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
                </button>
              </div>
              <nav style={{ display: 'grid', gap: 4, marginTop: 24 }}>
                {NAV.map((n, i) => (
                  <motion.a key={n.href} href={n.href} onClick={() => setOpen(false)} className="f-h3" style={{ padding: '12px 0', borderBottom: 'var(--bd-hair)' }}
                    initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 * i + 0.1, duration: 0.4, ease: EASE_OUT }}>
                    {n.label}
                  </motion.a>
                ))}
              </nav>
              <a className="btn btn--primary" href={APPLY_HREF} style={{ marginTop: 28, width: '100%' }}>Apply to halevaura</a>
              <p className="f-mono" style={{ marginTop: 14, textAlign: 'center' }}>Reviewed by a real manager</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
