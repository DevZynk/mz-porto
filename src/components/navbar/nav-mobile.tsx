'use client'

import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTrigger } from '../ui/drawer'
import { Button } from '../ui/button'
import { List, X, ChatCircle, EnvelopeSimple } from '@phosphor-icons/react/dist/ssr'
import { Locale } from '@/lib/translate'
import { getNavLinks } from './nav-items'
import Link from 'next/link'
import { useSite } from '../provider/site'

export default function MobileNav({ locale }: { locale: Locale }) {
  const navLinks = getNavLinks(locale)
  const site = useSite()

  return (
    <Drawer swipeDirection="right">
      <DrawerTrigger
        render={
          <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
            <List className="w-5 h-5" />
          </Button>
        }
      />
      <DrawerContent className="max-w-xs w-full">
        <DrawerHeader className="flex flex-row items-center justify-between px-5 py-4 border-b border-border/50">
          <span className="font-bold text-sm text-foreground">
            {locale === 'en' ? 'Menu' : 'Menu'}
          </span>
          <DrawerClose>
            <Button variant="ghost" size="icon" aria-label="Close menu">
              <X className="w-5 h-5" />
            </Button>
          </DrawerClose>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto px-5 py-6">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={`/${locale}${link.path}`}
                className="px-3 py-2.5 rounded-xl text-sm font-medium text-foreground hover:bg-muted hover:text-primary transition-all duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="border-t border-border/50 px-5 py-4 space-y-3">
          {site.social?.whatsapp && (
            <a
              href={`https://wa.me/${site.social.whatsapp.replace(/\+/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <ChatCircle className="w-4 h-4" weight="fill" />
              <span>{site.social.whatsapp}</span>
            </a>
          )}
          {site.social?.instagram && (
            <a
              href={`https://instagram.com/${site.social.instagram.replace(/^@/, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <EnvelopeSimple className="w-4 h-4" weight="fill" />
              <span>{site.social.instagram}</span>
            </a>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  )
}
