import React from 'react'
import '../styles.css'
import { Outfit, DM_Sans, Lora } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Metadata } from 'next'
import { LenisProvider } from '@/components/provider/lenis'
import { ThemeProvider } from '@/components/provider/theme-provider'
import Navbar from '@/components/navbar'
import { Locale } from '@/lib/translate'
import Footer from '@/components/footer'
import { getMeta, getServices } from '@/lib/payload'
import { SiteProvider } from '@/components/provider/site'
import { Media } from '@/payload-types'
import Script from 'next/script'

export const revalidate = 60

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
})

const dmsans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dmsans',
})

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
  weight: ['400', '500', '600', '700'],
})

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const meta = await getMeta(locale)

  const siteName = meta.siteSetting?.siteName || 'MZ Technology'
  const siteDescription = meta.siteSetting?.siteDescription || ''
  const canonicalBase = meta.advancedSEO?.canonicalUrl || ''
  const ogImage = meta.openGraph?.ogImage as { url?: string } | undefined
  const seoMetaTitle = meta.seo?.metaTitle || siteName
  const seoMetaDescription = meta.seo?.metaDescription || siteDescription
  const ogTitle = meta.openGraph?.ogTitle || seoMetaTitle
  const ogDescription = meta.openGraph?.ogDescription || seoMetaDescription

  return {
    title: {
      default: siteName,
      template: `%s | ${siteName}`,
    },
    description: seoMetaDescription,
    metadataBase: canonicalBase ? new URL(canonicalBase) : undefined,
    alternates: {
      canonical: `${canonicalBase}/${locale}`,
      languages: {
        en: `${canonicalBase}/en`,
        id: `${canonicalBase}/id`,
      },
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: `${canonicalBase}/${locale}`,
      siteName,
      locale: locale === 'id' ? 'id_ID' : 'en_US',
      type: 'website',
      ...(ogImage?.url && { images: [{ url: ogImage.url }] }),
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description: ogDescription,
      ...(ogImage?.url && { images: [{ url: ogImage.url }] }),
    },
  }
}

export default async function RootLayout(props: {
  params: Promise<{ locale: string }>
  children: React.ReactNode
}) {
  const { children } = props
  const params = await props.params

  const [meta, { docs: serviceDocs }] = await Promise.all([
    getMeta(params.locale),
    getServices(params.locale),
  ])
  const siteName = meta.siteSetting?.siteName || 'MZ Technology'
  const siteDescription = meta.siteSetting?.siteDescription || ''
  const canonicalBase = meta.advancedSEO?.canonicalUrl || ''
  const logoMedia = meta.siteSetting?.logo as Media | undefined
  const social = meta.socialMedia || {}

  const address = meta.siteSetting?.address
  const business = address?.business

  const siteValue = {
    siteName,
    siteDescription,
    location: address?.location || '',
    logoUrl: logoMedia?.url || null,
    alt: logoMedia?.alt || siteName,
    social: {
      whatsapp: social.whatsapp || '',
      instagram: social.instagram || '',
      tiktok: social.tiktok || '',
      facebook: social.facebook || '',
    },
    maps: address?.maps || '',
    address: address?.location || '',
    email: social.email || '',
    phone: social.phone || '',
    services: (serviceDocs || []).map((s: any) => ({
      id: s.id,
      title: s.title,
      slug: s.slug,
    })),
  }

  return (
    <html
      lang={params.locale}
      className={`${outfit.variable} ${dmsans.variable} ${lora.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="author" href="/humans.txt" />
        <link rel="author" href="https://hztech.id" />
        <link rel="me" href="https://hztech.id" />
        <link rel="help" href="https://hztech.id" />
        <link rel="license" href="https://hztech.id" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: siteName,
              url: canonicalBase,
              description: siteDescription,
              creator: {
                '@type': 'Organization',
                name: 'HZ Tech',
                url: 'https://hztech.id',
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: siteName,
              url: canonicalBase,
              logo: logoMedia?.url || undefined,
              contactPoint: {
                '@type': 'ContactPoint',
                telephone: social.whatsapp || social.phone || undefined,
                email: social.email || undefined,
                contactType: 'customer service',
              },
              ...(address?.location && {
                address: {
                  '@type': 'PostalAddress',
                  streetAddress: address.location,
                  addressLocality: business?.city || undefined,
                  addressRegion: business?.region || undefined,
                  postalCode: business?.postalCode || undefined,
                  addressCountry: 'ID',
                },
              }),
            }),
          }}
        />
      </head>
      <body>
        <ThemeProvider defaultTheme="light" attribute="class" disableTransitionOnChange>
          <SiteProvider value={siteValue}>
            <LenisProvider>
              <main>
                <Navbar locale={params.locale as Locale} />
                {children}
              </main>
              <Footer
                locale={params.locale as Locale}
                siteDescription={siteDescription}
                location={address?.location || ''}
                maps={address?.maps || ''}
                social={social}
                services={(serviceDocs || []).map((s: any) => ({
                  id: s.id,
                  title: s.title,
                  slug: s.slug,
                }))}
              />
            </LenisProvider>
          </SiteProvider>
        </ThemeProvider>
        <Analytics />

        <Script src="https://collect.hztech.id/analytics.min.js" />
      </body>
    </html>
  )
}
