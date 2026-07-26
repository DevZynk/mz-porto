import { Locale } from '@/lib/translate'
import { Metadata } from 'next'
import { getMeta, getHero } from '@/lib/payload'
import { Media } from '@/payload-types'
// import LatestNewsSection from './_components/news'
import Hero from './_components/hero'
import About from './_components/about'
import ServicesSection from './_components/services'
import ProjectList from './_components/project'

type Props = {
  params: Promise<{
    locale: string
  }>
}

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await props.params
  const [hero, meta] = await Promise.all([getHero(locale), getMeta(locale)])
  const siteName = meta.siteSetting?.siteName || 'MZ Technology'
  const canonicalBase = meta.advancedSEO?.canonicalUrl || ''
  const image = hero.image as Media | undefined
  const ogImage = image?.url || (meta.openGraph?.ogImage as { url?: string } | undefined)?.url
  const h1 = hero.title || siteName
  const desc = hero.description || meta.siteSetting?.siteDescription || ''

  return {
    title: h1,
    description: desc,
    alternates: {
      canonical: `${canonicalBase}/${locale}`,
      languages: {
        en: `${canonicalBase}/en`,
        id: `${canonicalBase}/id`,
      },
    },
    openGraph: {
      title: h1,
      description: desc,
      url: `${canonicalBase}/${locale}`,
      ...(ogImage && { images: [{ url: ogImage }] }),
    },
    twitter: {
      card: 'summary_large_image',
      title: h1,
      description: desc,
      ...(ogImage && { images: [{ url: ogImage }] }),
    },
  }
}

export default async function HomePage(props: Props) {
  const { locale } = (await props.params) as { locale: Locale }

  return (
    <>
      <Hero locale={locale} />
      <About locale={locale} />
      <ServicesSection locale={locale} />
      <ProjectList locale={locale} />
      {/* <LatestNewsSection locale={locale} /> */}
    </>
  )
}
