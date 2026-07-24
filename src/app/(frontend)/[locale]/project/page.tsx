import { Metadata } from 'next'
import { getPayloadClient, getMeta, getServices } from '@/lib/payload'
import { t, Locale } from '@/lib/translate'
import Link from 'next/link'
import React from 'react'
import { Media, Category, Project, Service, Client } from '@/payload-types'
import Container from '@/components/layout/container'
import ScrollReveal from '@/components/animation/scroll-reveal'
import CardProject from '@/components/card-project'

type Props = {
  params: Promise<{
    locale: string
  }>
  searchParams: Promise<{
    category?: string
    service?: string
  }>
}

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ category?: string; service?: string }>
}): Promise<Metadata> {
  const { locale } = (await props.params) as { locale: string }
  const meta = await getMeta(locale)
  const canonicalBase = meta.advancedSEO?.canonicalUrl || ''

  const ogImage = meta.openGraph?.ogImage as { url?: string } | undefined

  return {
    title: locale === 'en' ? 'Projects' : 'Proyek',
    description: meta.siteSetting?.siteDescription || '',
    alternates: {
      canonical: `${canonicalBase}/${locale}/project`,
      languages: {
        en: `${canonicalBase}/en/project`,
        id: `${canonicalBase}/id/project`,
      },
    },
    openGraph: {
      ...(ogImage?.url && { images: [{ url: ogImage.url }] }),
      url: `${canonicalBase}/${locale}/project`,
    },
    twitter: {
      card: 'summary_large_image',
    },
  }
}

export default async function ProjectListPage(props: Props) {
  const { locale } = (await props.params) as { locale: Locale }
  const { category, service } = await props.searchParams
  const payload = await getPayloadClient()

  // 1. Fetch categories and services for filters
  const { docs: categories } = await payload.find({
    collection: 'category',
    locale: locale,
    limit: 100,
  })

  const { docs: services } = await getServices(locale)

  // 2. Build filter conditions
  const whereClauses: any[] = []

  if (category && category !== 'all') {
    whereClauses.push({
      'meta.category': {
        equals: category,
      },
    })
  }

  if (service && service !== 'all') {
    whereClauses.push({
      'meta.services': {
        contains: service,
      },
    })
  }

  const query: any = {
    collection: 'projects',
    locale: locale,
    limit: 100,
    sort: '-createdAt',
  }

  if (whereClauses.length > 0) {
    query.where = {
      and: whereClauses,
    }
  }

  // Fetch projects
  const { docs } = await payload.find(query)
  const projects = docs as unknown as Project[]

  return (
    <div className="min-h-screen bg-background pt-28 pb-20 font-sans">
      <Container id="project-list" className="max-w-4xl">
        {/* Header */}
        <div className="mb-12 text-left space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-muted/50 text-xs font-semibold text-muted-foreground">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            {t(locale, 'Portfolio', 'Portofolio')}
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground">
            {t(locale, 'MZ Technology Projects', 'Proyek MZ Technology')}
          </h1>
          <p className="text-muted-foreground text-base max-w-xl">
            {t(
              locale,
              'Explore our complete portfolio of engineering achievements and digital solutions.',
              'Jelajahi portofolio lengkap pencapaian rekayasa dan solusi digital kami.',
            )}
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap gap-3 mb-8 pb-6 border-b border-border/60">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            <Link
              href={`/${locale}/project`}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                !category || category === 'all'
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-muted/50 text-muted-foreground border-border hover:bg-muted'
              }`}
            >
              {t(locale, 'All Categories', 'Semua Kategori')}
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/${locale}/project?category=${cat.id}${service ? `&service=${service}` : ''}`}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  category === cat.id.toString()
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-muted/50 text-muted-foreground border-border hover:bg-muted'
                }`}
              >
                {cat.title}
              </Link>
            ))}
          </div>
        </div>

        {/* Projects List */}
        <div className="flex flex-col divide-y divide-border/60 w-full">
          {projects.map((project, index) => {
            const { metaTitle, metaDescription, metaImage, client, services, likes, comments } =
              project.meta || {}
            const image = metaImage as Media | undefined
            const commentCount = comments?.length || 0
            const clientData = client as Client | undefined
            const clientName = typeof clientData === 'object' ? clientData?.name : undefined
            const firstServiceName =
              services && typeof services === 'object' && 'title' in services
                ? (services as Service).title
                : undefined

            return (
              <ScrollReveal
                key={project.id}
                delay={0.05 * index}
                direction="up"
                distance={15}
                className="group flex flex-col w-full hover:bg-muted/30 dark:hover:bg-muted/5 rounded-2xl transition-all duration-300"
              >
                <CardProject
                  slug={project.slug}
                  locale={locale}
                  title={metaTitle || ''}
                  description={metaDescription || ''}
                  image={image}
                  client={clientName}
                  service={firstServiceName}
                  likes={likes || 0}
                  commentCount={commentCount}
                />
              </ScrollReveal>
            )
          })}

          {projects.length === 0 && (
            <div className="py-16 text-center border border-dashed rounded-2xl bg-accent/10">
              <p className="text-muted-foreground text-sm">
                {t(locale, 'No projects found.', 'Tidak ada proyek yang ditemukan.')}
              </p>
            </div>
          )}
        </div>
      </Container>
    </div>
  )
}
