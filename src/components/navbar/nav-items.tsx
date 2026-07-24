import { t, Locale } from '@/lib/translate'

export const getNavLinks = (locale: Locale) => [
  { label: t(locale, 'Home', 'Beranda'), path: '#home' },
  { label: t(locale, 'About', 'Tentang'), path: '#about' },
  { label: t(locale, 'Services', 'Layanan'), path: '#services' },
  { label: t(locale, 'Project', 'Proyek'), path: '#projects' },
  { label: t(locale, 'News', 'Berita'), path: '#news' },
  { label: t(locale, 'Contact', 'Kontak'), path: '#contact' },
]
