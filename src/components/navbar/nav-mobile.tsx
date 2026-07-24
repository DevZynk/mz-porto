'use client'

import { useState } from 'react'
import { Drawer, DrawerContent, DrawerHeader, DrawerTrigger } from '../ui/drawer'
import { Button } from '../ui/button'
import { Locale } from '@/lib/translate'
import { getNavLinks } from './nav-items'
import Link from 'next/link'
import { ListIcon, XIcon } from '@phosphor-icons/react/dist/ssr'

export default function MobileNav({ locale }: { locale: Locale }) {
  const [open, setOpen] = useState(false)
  const navLinks = getNavLinks(locale)

  const close = () => setOpen(false)

  return (
    <Drawer open={open} onOpenChange={setOpen} swipeDirection="right">
      <DrawerTrigger
        render={
          <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
            <ListIcon className="w-5 h-5" />
          </Button>
        }
      />
      <DrawerContent className="max-w-xs w-full">
        <DrawerHeader className="flex flex-row items-center justify-between px-5 py-4 border-b border-border/50">
          <span className="font-bold text-sm text-foreground">
            {locale === 'en' ? 'Menu' : 'Menu'}
          </span>
          <Button variant="ghost" size="icon" aria-label="Close menu" onClick={close}>
            <XIcon className="w-5 h-5" />
          </Button>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto px-5 py-6">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={`/${locale}${link.path}`}
                onClick={close}
                className="px-3 py-2.5 rounded-xl text-sm font-medium text-foreground hover:bg-muted hover:text-primary transition-all duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

      </DrawerContent>
    </Drawer>
  )
}
