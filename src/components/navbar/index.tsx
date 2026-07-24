import ThemeToggle from './theme-togle'
import LocaleTogle from './locale-togle'
import { Locale } from '@/lib/translate'
import MobileNav from './nav-mobile'
import Logo from '../logo'
import NavbarClient from './navbar-client'
import DesktopNav from './nav-desktop'

export default function Navbar({ locale }: { locale: Locale }) {
  return (
    <NavbarClient>
      <div className="flex items-center justify-between max-w-4xl mx-auto w-full px-4">
        <Logo />
        <DesktopNav locale={locale} />
        <div className="flex items-center gap-3">
          <LocaleTogle />
          <ThemeToggle />
          <MobileNav locale={locale} />
        </div>
      </div>
    </NavbarClient>
  )
}
