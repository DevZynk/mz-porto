import { Metadata } from 'next'
import { getPayloadClient, getMeta, getServices } from '@/lib/payload'
import { t, Locale } from '@/lib/translate'
import Link from 'next/link'
import { News } from '@/payload-types'
import NewsFilterControls from '@/components/news-filter-controls'
import CardNews from '@/components/card-news'
import Pagination from './_components/pagination'

type Props = {
  params: Promise<{
    locale: string
  }>
  searchParams: Promise<{
    q?: string
    category?: string
    service?: string
    sort?: string
    page?: string
  }>
}

// Simple reading time estimator (average 200 words per minute)
function estimateReadingTime(lexicalContent: any): number {
  let wordCount = 0
  const extractText = (nodes: any[]) => {
    if (!Array.isArray(nodes)) return
    for (const node of nodes) {
      if (!node || typeof node !== 'object') continue
      if (typeof node.text === 'string') {
        wordCount += node.text.split(/\s+/).filter(Boolean).length
      }
      if (Array.isArray(node.children)) {
        extractText(node.children)
      }
    }
  }
  if (lexicalContent?.root?.children) {
    extractText(lexicalContent.root.children)
  }
  return Math.max(1, Math.ceil(wordCount / 200))
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { locale } = (await props.params) as { locale: string }
  const meta = await getMeta(locale)
  const canonicalBase = meta.advancedSEO?.canonicalUrl || ''

  const ogImage = meta.openGraph?.ogImage as { url?: string } | undefined

  return {
    title: locale === 'en' ? 'News & Insights' : 'Berita & Wawasan',
    description: meta.siteSetting?.siteDescription || '',
    alternates: {
      canonical: `${canonicalBase}/${locale}/news`,
      languages: {
        en: `${canonicalBase}/en/news`,
        id: `${canonicalBase}/id/news`,
      },
    },
    openGraph: {
      ...(ogImage?.url && { images: [{ url: ogImage.url }] }),
      url: `${canonicalBase}/${locale}/news`,
    },
    twitter: {
      card: 'summary_large_image',
    },
  }
}

export default async function NewsArticlesPage(props: Props) {
  const { locale } = (await props.params) as { locale: Locale }
  const { q, category, service, sort, page } = await props.searchParams
  const payload = await getPayloadClient()

  // 1. Fetch categories and services forselectors
  const { docs: categories } = await payload.find({
    collection: 'category',
    locale: locale,
    limit: 100,
  })

  const { docs: services } = await getServices(locale)

  // 2. Build filter conditions
  const whereClauses: any[] = []

  if (q) {
    whereClauses.push({
      or: [
        {
          'meta.metaTitle': {
            like: q,
          },
        },
        {
          'meta.metaDescription': {
            like: q,
          },
        },
      ],
    })
  }

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

  // 3. Configure pagination and sorting
  const currentPage = page ? parseInt(page) : 1
  const limit = 10

  const query: any = {
    collection: 'news',
    locale: locale,
    limit: limit,
    page: currentPage,
  }

  if (whereClauses.length > 0) {
    query.where = {
      and: whereClauses,
    }
  }

  if (sort === 'oldest') {
    query.sort = 'createdAt'
  } else if (sort === 'popular') {
    query.sort = '-meta.likes'
  } else {
    query.sort = '-createdAt'
  }

  // Fetch paginated data
  const { docs, totalPages, hasPrevPage, hasNextPage } = await payload.find(query)
  const newsItems = docs as unknown as News[]

  // Map listings for select controls
  const categoriesList = categories.map((c) => ({ id: c.id, title: c.title }))
  const servicesList = services.map((s) => ({ id: s.id, title: s.title }))

  // Helper to build page URLs while keeping filter state
  const getPageUrl = (targetPage: number) => {
    const params = new URLSearchParams()
    if (q) params.set('q', q)
    if (category && category !== 'all') params.set('category', category)
    if (service && service !== 'all') params.set('service', service)
    if (sort && sort !== 'newest') params.set('sort', sort)
    params.set('page', targetPage.toString())
    return `/${locale}/news?${params.toString()}`
  }

  return (
    <div className="min-h-screen bg-background pt-28 pb-20 font-sans">
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="mb-12 text-left space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-muted/50 text-xs font-semibold text-muted-foreground">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            {t(locale, 'News & Insights', 'Berita & Wawasan')}
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold font-heading tracking-tight text-foreground">
            {t(locale, 'MZ Technology News & Insights', 'Portal Berita & Wawasan MZ')}
          </h1>
          <p className="text-muted-foreground text-base max-w-xl">
            {t(
              locale,
              'Explore our archives, technical insights, project releases, and team updates.',
              'Jelajahi arsip berita, wawasan teknis, perilisan proyek, dan kabar tim terbaru kami.',
            )}
          </p>
        </div>

        {/* Search, Filter and Sort Controls */}
        <NewsFilterControls categories={categoriesList} services={servicesList} locale={locale} />

        {/* Medium-style News Feed */}
        <div className="space-y-0">
          {newsItems.map((news, index) => (
            <CardNews
              key={news.id}
              news={news}
              locale={locale}
              isLast={index === newsItems.length - 1}
              readTime={estimateReadingTime(news.content?.content)}
            />
          ))}

          {newsItems.length === 0 && (
            <div className="py-16 text-center border border-dashed rounded-2xl bg-accent/10">
              <p className="text-muted-foreground text-sm">
                {t(
                  locale,
                  'No articles found matching your criteria.',
                  'Tidak ada artikel yang cocok dengan kriteria pencarian Anda.',
                )}
              </p>
              {(q || (category && category !== 'all') || (service && service !== 'all')) && (
                <Link
                  href={`/${locale}/news`}
                  className="inline-block mt-3 text-xs font-semibold text-primary underline"
                >
                  {t(locale, 'Reset filters', 'Reset filter')}
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Pagination controls */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          hasPrevPage={hasPrevPage}
          hasNextPage={hasNextPage}
          getPageUrl={getPageUrl}
          locale={locale}
        />
      </div>
    </div>
  )
}
