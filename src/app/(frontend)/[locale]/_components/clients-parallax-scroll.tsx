'use client'

import React, { useEffect, useRef, type ReactNode } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ImageBox } from '@inoo-ch/payload-image-optimizer/client'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export type ClientLogoItem = {
  id: string | number
  name: string
  logoUrl: string
}

export default function ClientsParallaxScroll({
  heading,
  logos,
}: {
  heading: ReactNode
  logos: ClientLogoItem[]
}) {
  const triggerRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const row1Ref = useRef<HTMLDivElement>(null)
  const row2Ref = useRef<HTMLDivElement>(null)

  const row1Logos = logos
  const row2Logos = [...logos].reverse()

  useEffect(() => {
    const trigger = triggerRef.current
    const container = containerRef.current
    const row1El = row1Ref.current
    const row2El = row2Ref.current
    if (!trigger || !container || !row1El || !row2El) return

    // Use gsap.context for clean scope and automatic DOM reversion on unmount
    const ctx = gsap.context(() => {
      const pinDistance = () =>
        Math.max(row1El.scrollWidth, row2El.scrollWidth) - container.clientWidth + 160

      // Create a timeline to animate both rows simultaneously using function-based values
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: trigger,
          pin: true,
          scrub: 1,
          start: 'top 10%', // Pin when section top is 10% from viewport top
          end: () => `+=${pinDistance()}`, // Dynamic end height
          invalidateOnRefresh: true,
        },
      })

      // Row 1 slides left
      tl.to(
        row1El,
        {
          x: () => -pinDistance(),
          ease: 'none',
        },
        0,
      )

      // Row 2 starts offset to the left and slides right to 0
      tl.fromTo(
        row2El,
        { x: () => -pinDistance() },
        {
          x: 0,
          ease: 'none',
        },
        0,
      )
    })

    return () => ctx.revert() // Reverts pin-spacer DOM manipulations instantly
  }, [])

  return (
    // Outer wrapper div to prevent React removeChild unmounting crash on pinned elements
    <div className="w-full">
      <div
        ref={triggerRef}
        className="w-full flex flex-col justify-center items-center bg-background overflow-hidden relative border-t border-border pt-16 pb-20 mt-8"
      >
        <div className="max-w-4xl w-full mx-auto px-6 mb-12 pb-4">{heading}</div>
        <div ref={containerRef} className="max-w-4xl mx-auto overflow-hidden relative">
          <div className="absolute inset-y-0 left-0 w-8 sm:w-16 bg-linear-to-r from-background to-transparent pointer-events-none z-10" />
          <div className="absolute inset-y-0 right-0 w-8 sm:w-16 bg-linear-to-l from-background to-transparent pointer-events-none z-10" />

          <div className="w-full flex flex-col gap-8">
            {/* Row 1 */}
            <div className="relative w-full overflow-visible">
              <div ref={row1Ref} className="flex gap-12 px-6 items-center w-max">
                {row1Logos.map((c) => (
                  <div
                    key={c.id}
                    className="relative w-28 h-12 shrink-0 overflow-clip rounded opacity-85 hover:opacity-100 transition-opacity duration-300"
                  >
                    <ImageBox
                      unoptimized
                      media={c.logoUrl}
                      alt={c.name}
                      fill
                      className="object-contain filter grayscale hover:grayscale-0 transition-all duration-300 dark:invert"
                    />
                  </div>
                ))}
              </div>
            </div>
            {/* Row 2 */}
            {row2Logos.length > 0 && (
              <div className="relative w-full overflow-visible">
                <div ref={row2Ref} className="flex gap-12 px-6 items-center w-max">
                  {row2Logos.map((c) => (
                    <div
                      key={c.id}
                      className="relative w-28 h-12 shrink-0 overflow-clip rounded opacity-85 hover:opacity-100 transition-opacity duration-300"
                    >
                      <ImageBox
                        unoptimized
                        media={c.logoUrl}
                        alt={c.name}
                        fill
                        className="object-contain filter grayscale hover:grayscale-0 transition-all duration-300 dark:invert"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
