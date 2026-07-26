import Copyright from './copyright'
import { Locale, t } from '@/lib/translate'
import { MapPinIcon } from '@phosphor-icons/react/dist/ssr'
import Link from 'next/link'
import Contacts from './contacts'
import Logo from '../logo'
import { getNavLinks } from '../navbar/nav-items'



type Props = {
  locale: Locale
  siteDescription: string
  location: string
  maps: string
  social: Record<string, string | null | undefined>
  services: { id: number | string; title: string; slug: string }[]
}

export default function Footer({
  locale,
  siteDescription,
  location,
  maps,
  social,
  services,
}: Props) {
  const navLinks = getNavLinks(locale)

  return (
    <footer className="border-t py-10 md:py-16 w-full bg-background">
      <div className="max-w-4xl mx-auto px-6 flex gap-10 flex-col w-full">
        <div className="flex flex-col md:flex-row justify-between items-start gap-10 w-full">
          <div className="flex flex-col gap-6 w-full md:max-w-sm">
            <div className="flex flex-col gap-3 items-start text-left">
              <Logo />
              <p className="text-sm font-sans text-muted-foreground leading-relaxed">
                {siteDescription}
              </p>
              {location && maps && (
                <Link
                  href={maps}
                  target="_blank"
                  className="hover:text-primary flex items-center gap-2 text-sm text-muted-foreground mt-1 text-left"
                >
                  <MapPinIcon className="shrink-0" />
                  <p className="line-clamp-2">{location}</p>
                </Link>
              )}
            </div>
            <div className="flex flex-col gap-3 items-start">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {t(locale as any, 'Contact Us', 'Hubungi Kami')}
              </h3>
              <Contacts val={social} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 w-full md:flex md:flex-row md:gap-12 lg:gap-24 md:w-full">
            <div className="flex flex-col shrink gap-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {t(locale as any, 'Quick Links', 'Tautan Cepat')}
              </h3>
              <nav className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    href={`/${locale}${link.path}`}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors w-fit"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="flex flex-col gap-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {t(locale as any, 'Our Services', 'Layanan Kami')}
              </h3>
              <nav className="flex flex-col gap-2">
                {services.map((svc) => (
                  <Link
                    key={svc.id}
                    href={`/${locale}/services/${svc.slug}`}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors w-fit"
                  >
                    {svc.title}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>
        <Copyright locale={locale} />
      </div>
    </footer>
  )
}
