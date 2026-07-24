import { Metadata } from 'next'
import { getPayloadClient, getMeta, getProject } from '@/lib/payload'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import React from 'react'
import { Media, Category, Service, Project } from '@/payload-types'
import RichText from '@/components/rich-text'
import Link from 'next/link'
import ProjectEngagementSection from '@/components/project-engagement-section'
import { addProjectComment } from '@/app/actions/project'
import {
  UserIcon,
  CalendarIcon,
  UserCircleIcon,
  ArrowRightIcon,
} from '@phosphor-icons/react/dist/ssr'
import { t, Locale } from '@/lib/translate'

type Props = {
  params: Promise<{
    locale: string
    slug: string
  }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { locale, slug } = (await props.params) as { locale: Locale; slug: string }

  const project = await getProject(slug, locale)
  if (!project) return {}

  const meta = await getMeta(locale)
  const canonicalBase = meta.advancedSEO?.canonicalUrl || ''
  const { metaTitle, metaDescription, metaImage } = project.meta || {}
  const image = metaImage as Media | undefined

  return {
    title: metaTitle || '',
    description: metaDescription || '',
    alternates: {
      canonical: `${canonicalBase}/${locale}/project/${slug}`,
      languages: {
        en: `${canonicalBase}/en/project/${slug}`,
        id: `${canonicalBase}/id/project/${slug}`,
      },
    },
    openGraph: {
      title: metaTitle || '',
      description: metaDescription || '',
      url: `${canonicalBase}/${locale}/project/${slug}`,
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

export default async function ProjectShowcasePage(props: Props) {
  const { locale, slug } = (await props.params) as { locale: Locale; slug: string }
  const payload = await getPayloadClient()

  const project = await getProject(slug, locale)
  if (!project) return notFound()

  const { metaTitle, metaDescription, metaAuthor, metaImage, category, services, likes, comments } =
    project.meta || {}
  const content = project.content?.content

  const image = metaImage as Media | undefined
  const categoriesList = (category as Category[] | undefined) || []
  const activeComments = comments || []
  const currentService =
    services && typeof services === 'object' && 'title' in services ? (services as Service) : null
  const currentServiceId =
    services && typeof services === 'object' ? services.id : services || undefined

  // Fetch related projects sharing the same services or categories (excluding the current project)
  const categoryIds = categoriesList.map((c) => c.id)

  let relatedProjects: Project[] = []
  const relatedConditions: any[] = [{ id: { not_equals: project.id } }]
  const orConditions: any[] = []
  if (currentServiceId) {
    orConditions.push({ 'meta.services': { equals: currentServiceId } })
  }
  if (categoryIds.length > 0) {
    orConditions.push({ 'meta.category': { in: categoryIds } })
  }

  if (orConditions.length > 0) {
    relatedConditions.push({ or: orConditions })
    try {
      const relatedResult = await payload.find({
        collection: 'projects',
        locale: locale as Locale,
        where: {
          and: relatedConditions,
        },
        limit: 3,
        sort: '-createdAt',
      })
      relatedProjects = relatedResult.docs as unknown as Project[]
    } catch (e) {
      console.error('Error fetching related projects:', e)
    }
  }

  // Date Formatter
  const publishDate = project.createdAt
    ? new Date(project.createdAt).toLocaleDateString(locale === 'id' ? 'id-ID' : 'en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : ''

  const boundAddComment = async (formData: FormData) => {
    'use server'
    await addProjectComment(project.id.toString(), locale, formData)
  }

  return (
    <article className="min-h-screen bg-background pt-28 pb-24 font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CreativeWork',
            headline: metaTitle,
            description: metaDescription,
            image: image?.url || undefined,
            datePublished: project.createdAt,
            dateModified: project.updatedAt,
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
        <h1 className="text-[32px] md:text-[40px] lg:text-[42px] font-bold tracking-tight text-neutral-900 dark:text-neutral-50 leading-[44px] md:leading-[50px] mb-3">
          {metaTitle}
        </h1>

        {/* Description / Subtitle */}
        {metaDescription && (
          <p className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed mb-6">
            {metaDescription}
          </p>
        )}

        {/* Project Meta details (Author / Date) */}
        <div className="flex flex-wrap items-center gap-4 py-4 border-y border-border/60 my-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <UserCircleIcon size={18} className="text-primary" />
            <span className="font-medium text-foreground">{metaAuthor}</span>
          </div>
          <div className="hidden sm:block text-border">•</div>
          <div className="flex items-center gap-1.5">
            <CalendarIcon size={18} />
            <span>{publishDate}</span>
          </div>
        </div>

        {/* Featured Image */}
        {image?.url && (
          <div className="relative w-full aspect-video rounded-xl overflow-hidden my-8 border bg-muted shadow-sm">
            <Image
              unoptimized
              src={image.url}
              alt={image.alt || metaTitle || 'project showcase image'}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Rich Text Body Content */}
        <div className="max-w-none prose dark:prose-invert">
          {content && <RichText content={content} />}
        </div>

        {/* Related Services */}
        {currentService && (
          <div className="py-6 border-t border-border mt-8">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              {t(locale, 'Related Services', 'Layanan Terkait')}
            </h2>
            <div className="flex flex-wrap gap-2">
              <span className="text-xs font-medium border px-3 py-1.5 rounded-full bg-accent/40 text-foreground">
                {currentService.title}
              </span>
            </div>
          </div>
        )}

        {/* Engagement Toolbar */}
        <ProjectEngagementSection
          projectId={slug}
          locale={locale}
          initialLikes={likes || 0}
          commentCount={activeComments.length}
        />

        {/* Related Projects Section */}
        {relatedProjects.length > 0 && (
          <div className="pt-12 border-t border-border mt-8">
            <h2 className="text-xl font-bold mb-6 text-foreground font-sans">
              {t(locale, 'Related Projects', 'Proyek Terkait')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {relatedProjects.map((proj) => {
                const projImg = proj.meta?.metaImage as Media | undefined
                return (
                  <div
                    key={proj.id}
                    className="group flex flex-col bg-card hover:bg-muted/10 dark:hover:bg-muted/5 border border-border/40 hover:border-border/80 rounded-xl overflow-hidden hover:shadow-md transition-all duration-300"
                  >
                    {projImg?.url && (
                      <Link
                        href={`/${locale}/project/${proj.slug}`}
                        className="relative block aspect-video overflow-hidden"
                      >
                        <Image
                          unoptimized
                          src={projImg.url}
                          alt={projImg.alt || proj.meta?.metaTitle || ''}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 250px"
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </Link>
                    )}
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div className="space-y-1">
                        <Link href={`/${locale}/project/${proj.slug}`}>
                          <h4 className="font-bold text-sm text-foreground leading-snug line-clamp-1 group-hover:text-primary transition-colors">
                            {proj.meta?.metaTitle}
                          </h4>
                        </Link>
                        <p className="text-[11px] text-muted-foreground line-clamp-2">
                          {proj.meta?.metaDescription}
                        </p>
                      </div>
                      <Link
                        href={`/${locale}/project/${proj.slug}`}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary group/link pt-2"
                      >
                        <span>{t(locale, 'View Details', 'Lihat Detail')}</span>
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

        {/* Comments / Discussion Section */}
        <section id="discussion" className="mt-12 pt-12 border-t border-border">
          <h2 className="text-xl font-bold mb-6 text-foreground font-sans">
            {t(
              locale,
              `Discussion (${activeComments.length})`,
              `Diskusi (${activeComments.length})`,
            )}
          </h2>

          {/* Comment Form */}
          <form
            action={boundAddComment}
            className="flex flex-col gap-3 mb-8 bg-accent/30 p-4 rounded-xl border border-border/50"
          >
            <p className="text-sm font-semibold text-foreground">
              {t(locale, 'Write a response', 'Tulis tanggapan')}
            </p>
            <div className="flex flex-col gap-2">
              <input
                name="userName"
                type="text"
                placeholder={t(locale, 'Name (Optional)', 'Nama (Opsional)')}
                defaultValue="Anonim"
                className="w-full text-sm bg-background border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <textarea
                name="comment"
                required
                rows={3}
                placeholder={t(locale, 'What are your thoughts?', 'Apa pendapat Anda?')}
                className="w-full text-sm bg-background border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary resize-none"
              />
            </div>
            <button
              type="submit"
              className="self-end text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90 px-4 py-2 rounded-full transition-opacity cursor-pointer"
            >
              {t(locale, 'Respond', 'Kirim')}
            </button>
          </form>

          {/* Comments List */}
          <div className="space-y-4">
            {activeComments.map((c, i) => (
              <div
                key={c.id || i}
                className="p-4 rounded-xl border bg-background flex flex-col gap-1.5 shadow-xs"
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
                {t(
                  locale,
                  'No responses yet. Be the first to share your thoughts!',
                  'Belum ada tanggapan. Jadilah yang pertama memberikan pendapat!',
                )}
              </p>
            )}
          </div>
        </section>
      </div>
    </article>
  )
}
