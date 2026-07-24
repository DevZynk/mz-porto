'use client'

import React, { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof document !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function NavbarClient({ children }: { children: React.ReactNode }) {
  const headerRef = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const header = headerRef.current
    if (!header) return

    const trigger = ScrollTrigger.create({
      start: 'top top',
      onUpdate: (self) => {
        if (self.scroll() > 50) {
          header.classList.add(
            'bg-background/80',
            'backdrop-blur-md',
            'border-border/50',
            'shadow-xs',
          )
          header.classList.remove('bg-transparent', 'border-transparent')
        } else {
          header.classList.add('bg-transparent', 'border-transparent')
          header.classList.remove(
            'bg-background/80',
            'backdrop-blur-md',
            'border-border/50',
            'shadow-xs',
          )
        }
      },
    })

    return () => trigger.kill()
  }, [])

  return (
    <header
      ref={headerRef}
      className="w-full fixed z-50 top-0 flex items-center transition-all duration-300 bg-transparent border-b border-transparent h-15"
    >
      {children}
    </header>
  )
}
