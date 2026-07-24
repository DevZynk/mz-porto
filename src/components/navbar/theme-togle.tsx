'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { SunIcon, MoonIcon } from '@phosphor-icons/react'
import { Button } from '../ui/button'
import { useTheme } from 'next-themes'

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState<boolean>(false)

  useEffect(() => {
    setTimeout(() => {
      setMounted(true)
    }, 0)
  }, [])

  return (
    <Button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      size={'icon'}
      variant={'ghost'}
      aria-label="Toggle dark mode"
      className={'relative flex items-center justify-center'}
    >
      <AnimatePresence initial={false}>
        {!mounted ? (
          <motion.div
            key="placeholder"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute"
          />
        ) : theme === 'dark' ? (
          <motion.div
            key="sun"
            initial={{ scale: 0, rotate: -90, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0, rotate: 90, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 450, damping: 22 }}
            className="absolute flex items-center justify-center"
          >
            <SunIcon className="w-5 h-5 text-primary" />
          </motion.div>
        ) : (
          <motion.div
            key="moon"
            initial={{ scale: 0, rotate: -90, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0, rotate: 90, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 450, damping: 22 }}
            className="absolute flex items-center justify-center"
          >
            <MoonIcon className="w-5 h-5 text-primary" />
          </motion.div>
        )}
      </AnimatePresence>
    </Button>
  )
}
