import { useEffect } from 'react'
import Lenis from 'lenis'
import './components.css'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Problem from './components/Problem'
import HowItWorks from './components/HowItWorks'
import AppTour from './components/AppTour'
import BehindYou from './components/BehindYou'
import Team from './components/Team'
import Partnership from './components/Partnership'
import FAQ from './components/FAQ'
import FinalCTA from './components/FinalCTA'
import Footer from './components/Footer'

export default function App() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, anchors: true })
    let raf = 0
    const loop = (t: number) => { lenis.raf(t); raf = requestAnimationFrame(loop) }
    raf = requestAnimationFrame(loop)
    return () => { cancelAnimationFrame(raf); lenis.destroy() }
  }, [])
  return (
    <>
      <a className="skip" href="#how">Skip to content</a>
      <Nav />
      <main>
        <Hero />
        <Problem />
        <HowItWorks />
        <AppTour />
        <BehindYou />
        <Team />
        <Partnership />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </>
  )
}
