'use client'

import { createContext, useContext, useEffect, useRef } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const LenisContext = createContext<React.RefObject<Lenis | null> | null>(null)

export function LenisProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      smoothWheel: true,
      autoRaf: true,
      anchors: {
        offset: -80,
        duration: 1.2,
      },
    })

    lenisRef.current = lenis

    lenis.on('scroll', ScrollTrigger.update)

    const updateLenis = (time: number) => {
      lenis.raf(time * 1000)
    }

    gsap.ticker.add(updateLenis)
    gsap.ticker.lagSmoothing(0)

    // Refresh ScrollTrigger after layout settles
    const raf = requestAnimationFrame(() => ScrollTrigger.refresh())
    const timeout = setTimeout(() => ScrollTrigger.refresh(), 500)

    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(timeout)
      gsap.ticker.remove(updateLenis)
      lenis.destroy()
    }
  }, [])

  return <LenisContext.Provider value={lenisRef}>{children}</LenisContext.Provider>
}

export function useLenis() {
  const context = useContext(LenisContext)
  return context?.current ?? null
}
