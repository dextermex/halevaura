import { useState } from 'react'
import { FAQ as ITEMS } from '../lib/data'
import { Reveal } from '../lib/motion'

export default function FAQ() {
  const [open, setOpen] = useState<number>(0)
  return (
    <section id="faq" className="section">
      <div className="container faq">
        <div className="faq__head">
          <Reveal><span className="eyebrow">FAQ</span></Reveal>
          <Reveal delay={0.05}><h2 className="f-h1" style={{ marginTop: 20 }}>Questions creators ask.</h2></Reveal>
          <Reveal delay={0.1}><p className="f-mono" style={{ marginTop: 16 }}>Answered plainly</p></Reveal>
        </div>
        <div>
          {ITEMS.map((it, i) => (
            <Reveal key={it.q} delay={i * 0.04} amount={0.2}>
              <div className="faq-item" data-open={open === i}>
                <button className="faq-q" aria-expanded={open === i} aria-controls={`faq-${i}`} onClick={() => setOpen(open === i ? -1 : i)}>
                  <span>{it.q}</span>
                  <span className="faq-icon" aria-hidden><svg width="12" height="12" viewBox="0 0 12 12"><path d="M6 1.5v9M1.5 6h9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg></span>
                </button>
                <div className="faq-a" id={`faq-${i}`} role="region"><div><p>{it.a}</p></div></div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
