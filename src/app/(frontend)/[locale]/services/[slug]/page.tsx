import Link from 'next/link'
import { Metadata } from 'next'
import { getPayloadClient, getMeta, getService } from '@/lib/payload'
import RichText from '@/components/rich-text'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Media, Project, News as NewsType, Service } from '@/payload-types'
import { t, Locale } from '@/lib/translate'
import { CheckCircleIcon } from '@phosphor-icons/react/dist/ssr'
import ConsultationCard from './_components/consultation-card'
import PricingPlans from './_components/pricing-plans'
import RelatedProjects from './_components/related-projects'
import RelatedBlogs from './_components/related-blogs'

export const revalidate = 60

export async function generateMetadata(props: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = (await props.params) as { locale: Locale; slug: string }
  const service = await getService(slug, locale)
  if (!service) return {}

  const meta = await getMeta(locale)
  const siteName = meta.siteSetting?.siteName || 'MZ Technology'
  const canonicalBase = meta.advancedSEO?.canonicalUrl || ''
  const image = service.image as Media | undefined

  return {
    title: service.title,
    description: service.smallDescription || '',
    openGraph: {
      title: service.title,
      description: service.smallDescription || '',
      ...(image?.url && { images: [{ url: image.url }] }),
    },
    alternates: {
      canonical: `${canonicalBase}/${locale}/services/${slug}`,
      languages: {
        en: `${canonicalBase}/en/services/${slug}`,
        id: `${canonicalBase}/id/services/${slug}`,
      },
    },
  }
}

export default async function ServiceDetailPage(props: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = (await props.params) as { locale: Locale; slug: string }

  const payload = await getPayloadClient()
  const service = await getService(slug, locale)

  if (!service) {
    return notFound()
  }

  const serviceId = service.id

  const [relatedProjectsResult, relatedBlogsResult] = await Promise.allSettled([
    payload.find({
      collection: 'projects',
      locale: locale,
      where: { 'meta.services': { equals: serviceId } },
      limit: 6,
      sort: '-createdAt',
    }),
    payload.find({
      collection: 'news',
      locale: locale,
      where: { 'meta.services': { equals: serviceId } },
      limit: 6,
      sort: '-createdAt',
    }),
  ])

  const relatedProjects =
    relatedProjectsResult.status === 'fulfilled'
      ? (relatedProjectsResult.value.docs as unknown as Project[])
      : []
  const relatedBlogs =
    relatedBlogsResult.status === 'fulfilled'
      ? (relatedBlogsResult.value.docs as unknown as NewsType[])
      : []

  const image = service.image as Media | undefined
  const plans = service.pricing?.plans || []

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: locale === 'en' ? 'Home' : 'Beranda',
        item: `/${locale}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: locale === 'en' ? 'Services' : 'Layanan',
        item: `/${locale}/services`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: service.title,
      },
    ],
  }

  return (
    <div className="w-full min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <main className="pt-28 pb-20">
        <div className="max-w-6xl mx-auto px-6 space-y-20">
          {/* Breadcrumb Links */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
            <Link href={`/${locale}`} className="hover:text-primary transition-colors">
              {locale === 'en' ? 'Home' : 'Beranda'}
            </Link>
            <span className="opacity-40">/</span>
            <Link href={`/${locale}/services`} className="hover:text-primary transition-colors">
              {locale === 'en' ? 'Services' : 'Layanan'}
            </Link>
            <span className="opacity-40">/</span>
            <span className="text-foreground font-semibold truncate max-w-[200px]">{service.title}</span>
          </div>

          {/* Service Details Main Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start w-full">
            {/* Left Column: Image & Contact CTA */}
            <div className="lg:col-span-5 space-y-6">
              {image?.url && (
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-border/50 bg-muted shadow-xl shadow-black/5">
                  <Image
                    unoptimized
                    src={image.url}
                    alt={image.alt || service.title}
                    fill
                    className="object-cover"
                    priority
                  />
                  {/* Bottom gradient overlay */}
                  <div className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-black/40 to-transparent" />
                </div>
              )}

              {/* Consultation / Contact Card */}
              <ConsultationCard locale={locale} serviceTitle={service.title} />
            </div>

            {/* Right Column: Title & Description */}
            <div className="lg:col-span-7 space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-muted/50 text-xs font-semibold text-muted-foreground">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                {t(locale, 'Service', 'Layanan')}
              </div>

              <h1 className="text-3xl md:text-5xl font-extrabold text-foreground tracking-tight leading-tight">
                {service.title}
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed font-light">
                {service.smallDescription}
              </p>
              <div className="w-12 h-1 bg-primary rounded-full" />

              {/* Service Features */}
              {service.features && service.features.length > 0 && (
                <div className="pt-4">
                  <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-4">
                    {t(locale, 'Key Features', 'Fitur Utama')}
                  </h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {service.features.map((f) => (
                      <li
                        key={f.id || f.feature}
                        className="flex items-center gap-2.5 text-sm text-muted-foreground bg-muted/30 rounded-lg px-3 py-2 border border-border/40"
                      >
                        <CheckCircleIcon size={15} className="text-primary shrink-0" weight="bold" />
                        <span>{f.feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {service.features && service.features.length === 0 && (
                <p className="text-xs text-muted-foreground italic pt-4">
                  {t(locale, 'No features listed.', 'Tidak ada fitur yang tercantum.')}
                </p>
              )}

              {/* Rich Text Editor Content */}
              {service.content?.content && (
                <div className="mt-8 pt-8 border-t border-border/40 w-full">
                  <RichText content={service.content.content} />
                </div>
              )}
            </div>
          </div>

          {/* Pricing Plans Grid Section */}
          <PricingPlans plans={plans} locale={locale} serviceTitle={service.title} />

          {/* Related Projects Section */}
          <RelatedProjects relatedProjects={relatedProjects} locale={locale} />

          {/* Related Blogs/Articles Section */}
          <RelatedBlogs relatedBlogs={relatedBlogs} locale={locale} />
        </div>
      </main>
    </div>
  )
}
