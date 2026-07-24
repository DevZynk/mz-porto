'use client'

import React, { useEffect, useRef } from 'react'

export default function NavbarClient({ children }: { children: React.ReactNode }) {
  const headerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const header = headerRef.current
    if (!header) return

    const onScroll = () => {
      if (window.scrollY > 50) {
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
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
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
