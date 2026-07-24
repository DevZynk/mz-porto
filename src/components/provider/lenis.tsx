'use client'

import { createContext, useContext, useEffect, useRef } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useIsMobile } from '@/hooks/use-is-mobile'

gsap.registerPlugin(ScrollTrigger)

const LenisContext = createContext<React.RefObject<Lenis | null> | null>(null)

export function LenisProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)
  const isMobile = useIsMobile()

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

    if (isMobile) {
      // On mobile, Lenis is passthrough — just refresh ScrollTrigger once
      requestAnimationFrame(() => ScrollTrigger.refresh())
      return () => {
        lenis.destroy()
      }
    }

    lenis.on('scroll', ScrollTrigger.update)

    const updateLenis = (time: number) => {
      lenis.raf(time * 1000)
    }

    gsap.ticker.add(updateLenis)
    gsap.ticker.lagSmoothing(0)

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
