import { Metadata } from 'next'
import { getPayloadClient, getMeta, getArticle } from '@/lib/payload'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import React from 'react'
import { Media, Category, Service, News } from '@/payload-types'
import RichText from '@/components/rich-text'
import Link from 'next/link'
import EngagementSection from '@/components/engagement-section'
import { addComment } from '@/app/actions/comment'
import { UserIcon, ArrowRightIcon } from '@phosphor-icons/react/dist/ssr'
import { t, Locale } from '@/lib/translate'

type Props = {
  params: Promise<{
    locale: string
    slug: string
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
  const { locale, slug } = (await props.params) as { locale: Locale; slug: string }
  const article = await getArticle(slug, locale)
  if (!article) return {}

  const meta = await getMeta(locale)
  const canonicalBase = meta.advancedSEO?.canonicalUrl || ''
  const { metaTitle, metaDescription, metaImage } = article.meta || {}
  const image = metaImage as Media | undefined

  return {
    title: metaTitle || '',
    description: metaDescription || '',
    alternates: {
      canonical: `${canonicalBase}/${locale}/news/${slug}`,
      languages: {
        en: `${canonicalBase}/en/news/${slug}`,
        id: `${canonicalBase}/id/news/${slug}`,
      },
    },
    openGraph: {
      title: metaTitle || '',
      description: metaDescription || '',
      type: 'article',
      url: `${canonicalBase}/${locale}/news/${slug}`,
      ...(image?.url && { images: [{ url: image.url }] }),
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle || '',
      description: metaDescription || '',
      ...(image?.url && { images: [{ url: image.url }] }),
    },
  }
}

export default async function NewsArticlePage(props: Props) {
  const { locale, slug } = (await props.params) as { locale: Locale; slug: string }
  const payload = await getPayloadClient()

  const article = await getArticle(slug, locale)
  if (!article) return notFound()

  const { metaTitle, metaDescription, metaAuthor, metaImage, category, services, likes, comments } =
    article.meta || {}
  const content = article.content?.content

  const image = metaImage as Media | undefined
  const categoriesList = (category as Category[] | undefined) || []
  const servicesList = (services as Service[] | undefined) || []
  const activeComments = comments || []
  const readTime = estimateReadingTime(content)

  // Fetch related news articles sharing the same services or categories (excluding the current article)
  const serviceIds = servicesList.map((s) => s.id)
  const categoryIds = categoriesList.map((c) => c.id)

  let relatedNews: News[] = []
  const relatedConditions: any[] = [{ id: { not_equals: article.id } }]
  const orConditions: any[] = []
  if (serviceIds.length > 0) {
    orConditions.push({ 'meta.services': { in: serviceIds } })
  }
  if (categoryIds.length > 0) {
    orConditions.push({ 'meta.category': { in: categoryIds } })
  }

  if (orConditions.length > 0) {
    relatedConditions.push({ or: orConditions })
    try {
      const relatedResult = await payload.find({
        collection: 'news',
        locale: locale,
        where: {
          and: relatedConditions,
        },
        limit: 3,
        sort: '-createdAt',
      })
      relatedNews = relatedResult.docs as unknown as News[]
    } catch (e) {
      console.error('Error fetching related news:', e)
    }
  }

  // Date Formatter
  const publishDate = article.createdAt
    ? new Date(article.createdAt).toLocaleDateString(locale === 'id' ? 'id-ID' : 'en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : ''

  // Get initials for the author's avatar
  const initials = metaAuthor
    ? metaAuthor
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'A'

  const boundAddComment = async (formData: FormData) => {
    'use server'
    await addComment(article.id.toString(), locale, formData)
  }

  return (
    <article className="min-h-screen bg-background pt-28 pb-24 font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: metaTitle,
            description: metaDescription,
            image: image?.url || undefined,
            datePublished: article.createdAt,
            dateModified: article.updatedAt,
            author: { '@type': 'Person', name: metaAuthor },
          }),
        }}
      />
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        {/* Category tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {categoriesList.map((cat) => (
            <span
              key={cat.id}
              className="text-xs font-semibold tracking-wide uppercase text-primary bg-primary/10 px-2.5 py-1 rounded"
            >
              {cat.title}
            </span>
          ))}
        </div>

        {/* Title */}
        <h1 className="text-[32px] md:text-[40px] lg:text-[42px] font-medium font-serif tracking-tight text-neutral-900 dark:text-neutral-50 leading-[44px] md:leading-[50px] mb-3">
          {metaTitle}
        </h1>

        {/* Description / Subtitle */}
        {metaDescription && (
          <p className="font-serif text-xl text-neutral-500 dark:text-neutral-400 font-light leading-relaxed mb-6">
            {metaDescription}
          </p>
        )}

        {/* Author / Date Meta */}
        <div className="flex items-center gap-3 py-6">
          <div className="w-11 h-11 rounded-full bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-neutral-600 dark:text-neutral-300 font-semibold font-sans text-sm">
            {initials}
          </div>
          <div className="flex flex-col text-sm">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-neutral-950 dark:text-neutral-50">
                {metaAuthor}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-neutral-500 dark:text-neutral-400 mt-0.5 text-xs">
              <span>{publishDate}</span>
              <span>•</span>
              <span>{readTime} min read</span>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        {image?.url && (
          <div className="relative w-full aspect-video rounded-xl overflow-hidden my-8 border bg-muted">
            <Image
              unoptimized
              src={image.url}
              alt={image.alt || metaTitle || ''}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}
        {/* Engagement Toolbar */}
        <EngagementSection
          newsId={article.id.toString()}
          locale={locale}
          initialLikes={likes || 0}
          commentCount={activeComments.length}
        />
        {/* Rich Text Body Content */}
        <div className="max-w-none">
          <RichText content={content} />
        </div>

        {/* Related Services */}
        {servicesList.length > 0 && (
          <div className="py-6 border-t border-border mt-8">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Relate Services
            </h2>
            <div className="flex flex-wrap gap-2">
              {servicesList.map((service) => (
                <span
                  key={service.id}
                  className="text-xs font-medium border px-3 py-1.5 rounded-full bg-accent/40 text-foreground"
                >
                  {service.title}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Related News Section */}
        {relatedNews.length > 0 && (
          <div className="pt-12 border-t border-border mt-8">
            <h2 className="text-xl font-bold mb-6 text-foreground font-sans">
              {t(locale, 'Related News', 'Berita Terkait')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {relatedNews.map((item) => {
                const itemImg = item.meta?.metaImage as Media | undefined
                return (
                  <div
                    key={item.id}
                    className="group flex flex-col bg-card hover:bg-muted/10 dark:hover:bg-muted/5 border border-border/40 hover:border-border/80 rounded-xl overflow-hidden hover:shadow-md transition-all duration-300"
                  >
                    {itemImg?.url && (
                      <Link
                        href={`/${locale}/news/${item.slug}`}
                        className="relative block aspect-video overflow-hidden"
                      >
                        <Image
                          unoptimized
                          src={itemImg.url}
                          alt={itemImg.alt || item.meta?.metaTitle || ''}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 250px"
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </Link>
                    )}
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div className="space-y-1">
                        <Link href={`/${locale}/news/${item.slug}`}>
                          <h4 className="font-bold text-sm text-foreground leading-snug line-clamp-1 group-hover:text-primary transition-colors">
                            {item.meta?.metaTitle}
                          </h4>
                        </Link>
                        <p className="text-[11px] text-muted-foreground line-clamp-2">
                          {item.meta?.metaDescription}
                        </p>
                      </div>
                      <Link
                        href={`/${locale}/news/${item.slug}`}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary group/link pt-2"
                      >
                        <span>{t(locale, 'Read Article', 'Baca Artikel')}</span>
                        <ArrowRightIcon
                          size={12}
                          className="transition-transform group-hover/link:translate-x-0.5"
                        />
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Inline Comments Section */}
        <section id="discussion" className="mt-12 pt-12 border-t border-border">
          <h2 className="text-xl font-bold mb-6 text-foreground font-sans">
            Discussion ({activeComments.length})
          </h2>

          {/* Comment Form */}
          <form
            action={boundAddComment}
            className="flex flex-col gap-3 mb-8 bg-accent/30 p-4 rounded-xl border border-border/50"
          >
            <p className="text-sm font-semibold text-foreground">Write a response</p>
            <div className="flex flex-col gap-2">
              <input
                name="userName"
                type="text"
                placeholder="Name (Optional)"
                defaultValue={locale === 'id' ? 'Anonim' : 'Anonymous'}
                className="w-full text-sm bg-background border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <textarea
                name="comment"
                required
                rows={3}
                placeholder="What are your thoughts?"
                className="w-full text-sm bg-background border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary resize-none"
              />
            </div>
            <button
              type="submit"
              className="self-end text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90 px-4 py-2 rounded-full transition-opacity cursor-pointer"
            >
              Respond
            </button>
          </form>

          {/* Comments List */}
          <div className="space-y-4">
            {activeComments.map((c, i) => (
              <div
                key={c.id || i}
                className="p-4 rounded-xl border bg-background flex flex-col gap-1.5"
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center text-muted-foreground">
                    <UserIcon size={12} />
                  </div>
                  <span className="text-xs font-semibold text-foreground">
                    {c.userName || 'Anonim'}
                  </span>
                </div>
                <p className="text-sm text-foreground/90 pl-8 leading-relaxed whitespace-pre-wrap">
                  {c.comment}
                </p>
              </div>
            ))}
            {activeComments.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">
                No responses yet. Be the first to share your thoughts!
              </p>
            )}
          </div>
        </section>
      </div>
    </article>
  )
}
