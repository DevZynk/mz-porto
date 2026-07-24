'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'motion/react'
import { Locale } from '@/lib/translate'

export default function LocaleTogle() {
  const pathname = usePathname() || '/'
  const searchParams = useSearchParams()
  const [hash, setHash] = React.useState('')

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      setHash(window.location.hash)
      const handleHashChange = () => {
        setHash(window.location.hash)
      }
      window.addEventListener('hashchange', handleHashChange)
      return () => window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])

  const segments = pathname.split('/')
  const currentLocale = (segments[1] === 'en' || segments[1] === 'id') ? (segments[1] as Locale) : 'id'
  const nextLocale = currentLocale === 'id' ? 'en' : 'id'

  // Construct toggle path
  const newSegments = [...segments]
  if (newSegments[1] === 'id' || newSegments[1] === 'en') {
    newSegments[1] = nextLocale
  } else {
    newSegments.splice(1, 0, nextLocale)
  }

  // Sanitize hash to prevent duplicates (e.g. #home#home -> #home)
  let cleanHash = hash
  if (cleanHash) {
    const parts = cleanHash.split('#').filter(Boolean)
    cleanHash = parts.length > 0 ? '#' + parts[parts.length - 1] : ''
  }

  // Parse and update query params
  const params = new URLSearchParams(searchParams.toString())
  if (params.has('locale')) {
    params.set('locale', nextLocale)
  }
  const searchStr = params.toString()
  const togglePath = newSegments.join('/') + (searchStr ? '?' + searchStr : '') + cleanHash

  return (
    <Link
      href={togglePath}
      aria-label="Toggle language"
      className="relative w-9 h-9 flex items-center justify-center font-bold text-xs uppercase hover:bg-accent rounded-md transition-colors overflow-hidden"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={currentLocale}
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -15, opacity: 0 }}
          transition={{ duration: 0.15, ease: 'easeInOut' }}
          className="absolute font-semibold font-mono text-xs uppercase"
        >
          {currentLocale}
        </motion.span>
      </AnimatePresence>
    </Link>
  )
}
