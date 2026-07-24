'use client'

import React, { useEffect, useRef, type ReactNode } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function ServicesHorizontalScroll({
  header,
  children,
}: {
  header: ReactNode
  children: ReactNode
}) {
  const triggerRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const trigger = triggerRef.current
    const container = containerRef.current
    const scroller = scrollerRef.current
    if (!trigger || !container || !scroller) return

    // Use gsap.context for clean scope and automatic DOM reversion on unmount
    const ctx = gsap.context(() => {
      const pinDistance = () => scroller.scrollWidth - container.clientWidth + 160

      gsap.to(scroller, {
        x: () => -pinDistance(),
        ease: 'none',
        scrollTrigger: {
          trigger: trigger,
          pin: true,
          scrub: 1,
          start: 'top 0%', // Pin when section top is 0% from viewport top (flush)
          end: () => `+=${pinDistance()}`, // Pin length matches horizontal scroll distance
          invalidateOnRefresh: true,
        },
      })
    })

    return () => ctx.revert() // Reverts pin-spacer DOM manipulations instantly
  }, [])

  return (
    // Outer wrapper div to prevent React removeChild unmounting crash on pinned elements
    <div>
      <div ref={triggerRef} className="w-full bg-background overflow-hidden relative border-t border-border/30">
        <div className="max-w-4xl mx-auto px-6 pt-24 mb-12 pb-4 border-b border-border/80">
          {header}
        </div>
        <div ref={containerRef} className="max-w-4xl mx-auto overflow-hidden relative">
          {/* Left & Right Fade Shadows */}
          <div className="absolute inset-y-0 left-0 w-12 sm:w-20 bg-linear-to-r from-background to-transparent pointer-events-none z-10" />
          <div className="absolute inset-y-0 right-0 w-12 sm:w-20 bg-linear-to-l from-background to-transparent pointer-events-none z-10" />

          <div ref={scrollerRef} className="flex gap-6 px-8 pb-24 w-max">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
