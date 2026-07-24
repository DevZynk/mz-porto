'use client'

import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register ScrollTrigger plugin on client side
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface ScrollRevealProps {
  children: React.ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  duration?: number
  distance?: number
  scrub?: boolean | number
  once?: boolean
}

export default function ScrollReveal({
  children,
  className,
  delay = 0,
  direction = 'up',
  duration = 0.8,
  distance = 30,
  scrub = true,
  once = false,
}: ScrollRevealProps) {
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = elementRef.current
    if (!el) return

    let initialX = 0
    let initialY = 0

    if (direction === 'up') initialY = distance
    else if (direction === 'down') initialY = -distance
    else if (direction === 'left') initialX = distance
    else if (direction === 'right') initialX = -distance

    // Set initial styling state before animate
    gsap.set(el, {
      opacity: 0,
      x: initialX,
      y: initialY,
    })

    const ctx = gsap.context(() => {
      gsap.to(el, {
        opacity: 1,
        x: 0,
        y: 0,
        duration: duration,
        delay: delay,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%', // Trigger slightly before it comes fully into view
          toggleActions: once
            ? scrub
              ? 'play none none reverse'
              : 'play none none none'
            : 'play reverse play reverse',
          scrub: scrub,
          once: once,
        },
      })
    }, el)

    return () => ctx.revert() // clean up GSAP animation context and scrolltrigger listeners
  }, [direction, distance, duration, delay, scrub, once])

  return (
    <div ref={elementRef} className={className} style={{ opacity: 0 }}>
      {children}
    </div>
  )
}
