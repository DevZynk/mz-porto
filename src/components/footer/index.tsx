import Copyright from './copyright'
import { Locale, t } from '@/lib/translate'
import { MapPinIcon } from '@phosphor-icons/react/dist/ssr'
import Link from 'next/link'
import Contacts from './contacts'
import Logo from '../logo'
import { getMeta, getServices } from '@/lib/payload'
import Container from '../layout/container'
import ScrollReveal from '../animation/scroll-reveal'

const footerNavLinks = (locale: Locale) => [
  { label: t(locale, 'Home', 'Beranda'), path: '/' },
  { label: t(locale, 'About', 'Tentang'), path: '#about' },
  { label: t(locale, 'Services', 'Layanan'), path: '/services' },
  { label: t(locale, 'Project', 'Proyek'), path: '/project' },
  { label: t(locale, 'News', 'Berita'), path: '/news' },
]

export default async function Footer({ locale }: { locale: Locale }) {
  const result = await Promise.allSettled([getMeta(locale), getServices(locale)])
  const meta = result[0].status === 'fulfilled' ? result[0].value : null
  const services = result[1].status === 'fulfilled' ? result[1].value.docs : []
  const description = meta?.siteSetting?.siteDescription
  const location = meta?.siteSetting?.address?.location
  const maps = meta?.siteSetting?.address?.maps
  const contact = meta?.socialMedia
  const navLinks = footerNavLinks(locale)
  return (
    <Container id="contact" className="border-t py-10 md:py-16 max-w-4xl w-full">
      <footer className="flex gap-10 flex-col w-full mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start gap-10 w-full">
          {/* Column 1: Brand details & Socials */}
          <ScrollReveal
            delay={0.1}
            direction="up"
            distance={10}
            className="flex flex-col gap-6 w-full md:max-w-sm"
          >
            <div className="flex flex-col gap-3 items-start text-left">
              <Logo size={200} locale={locale} />
              <p className="text-sm font-sans text-muted-foreground leading-relaxed">
                {description}
              </p>
              {location && maps && (
                <Link
                  href={`${maps}`}
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
                {t(locale, 'Contact Us', 'Hubungi Kami')}
              </h3>
              <Contacts val={contact} />
            </div>
          </ScrollReveal>

          {/* Column 2: Navigation Lists (Split evenly 50/50 on mobile) */}
          <ScrollReveal
            delay={0.1}
            direction="down"
            distance={10}
            className="grid grid-cols-2 gap-8 w-full md:flex md:flex-row md:gap-16 lg:gap-24 md:w-auto"
          >
            <div className="flex flex-col gap-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {t(locale, 'Quick Links', 'Tautan Cepat')}
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
                {t(locale, 'Our Services', 'Layanan Kami')}
              </h3>
              <nav className="flex flex-col gap-2">
                {services.map((svc: any) =>
                  svc ? (
                    <Link
                      key={svc.id}
                      href={`/${locale}/services/${svc.slug}`}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors w-fit"
                    >
                      {svc.title}
                    </Link>
                  ) : null,
                )}
              </nav>
            </div>
          </ScrollReveal>
        </div>
        <Copyright locale={locale} />
      </footer>
    </Container>
  )
}
