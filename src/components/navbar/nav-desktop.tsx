'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Locale } from '@/lib/translate'
import { getNavLinks } from './nav-items'

type Props = {
  locale: Locale
}

export default function DesktopNav({ locale }: Props) {
  const pathname = usePathname()
  const navLinks = getNavLinks(locale)
  const [activeSection, setActiveSection] = useState('#home')

  useEffect(() => {
    const path = pathname.replace(`/${locale}`, '') || '/'

    if (path.startsWith('/services')) {
      setActiveSection('#services')
      return
    }
    if (path.startsWith('/project')) {
      setActiveSection('#projects')
      return
    }
    if (path.startsWith('/news')) {
      setActiveSection('#news')
      return
    }

    if (path !== '/' && path !== '') {
      setActiveSection('')
      return
    }

    const handleScroll = () => {
      let maxVisible = 0
      let current = '#home'

      navLinks.forEach((link) => {
        if (!link.path.startsWith('#')) return
        const id = link.path.replace('#', '')
        const el = document.getElementById(id)
        if (!el) return

        const rect = el.getBoundingClientRect()
        const vh = window.innerHeight
        const visible = Math.max(0, Math.min(rect.bottom, vh) - Math.max(rect.top, 0))

        if (visible > maxVisible) {
          maxVisible = visible
          current = link.path
        }
      })

      setActiveSection(current)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [pathname, locale, navLinks])

  return (
    <nav className="hidden md:flex items-center gap-1">
      {navLinks.map((link) => {
        const isActive = activeSection === link.path
        return (
          <Link
            key={link.path}
            href={`/${locale}${link.path}`}
            className={`relative px-3 py-1.5 text-sm font-medium transition-all duration-300 ${
              isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {link.label}
            {isActive && (
              <span className="absolute -bottom-0.5 left-3 right-3 h-0.5 bg-foreground rounded-full" />
            )}
          </Link>
        )
      })}
    </nav>
  )
}
