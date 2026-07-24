import { getLatestProjects } from '@/lib/payload'
import { t, Locale } from '@/lib/translate'
import Link from 'next/link'
import React from 'react'
import { Media, Category, Project, Client, Service } from '@/payload-types'
import { ArrowRightIcon } from '@phosphor-icons/react/dist/ssr'
import Container from '@/components/layout/container'
import ScrollReveal from '@/components/animation/scroll-reveal'
import CardProject from '@/components/card-project'

type Props = {
  locale: Locale
}

export default async function ProjectList({ locale }: Props) {
  const { docs } = await getLatestProjects(locale, 4)
  const projects = docs as unknown as Project[]

  return (
    <Container id="projects" className="h-auto py-24 flex flex-col max-w-4xl justify-center">
      {/* Section Header */}
      <div className="flex items-end justify-between mb-12 pb-4 border-b border-border/80">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-muted/50 text-xs font-semibold text-muted-foreground">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
            {t(locale, 'Our Portfolio', 'Portofolio Kami')}
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            {t(locale, 'Selected Projects', 'Proyek Terpilih')}
          </h2>
        </div>
        <Link
          href={`/${locale}/project`}
          className="group flex items-center gap-1 text-xs font-semibold text-primary hover:opacity-90 transition-all cursor-pointer whitespace-nowrap"
        >
          <span>{t(locale, 'View all', 'Lihat semua')}</span>
          <ArrowRightIcon size={14} className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* Projects List */}
      <div className="flex flex-col divide-y divide-border/60 max-w-4xl mx-auto w-full">
        {projects.map((project, index) => {
          const { metaTitle, metaDescription, metaImage, client, services, likes, comments } =
            project.meta || {}
          const image = metaImage as Media | undefined
          const commentCount = comments?.length || 0
          const clientData = client as Client | undefined
          const clientName = typeof clientData === 'object' ? clientData?.name : undefined
          const service =
            services && typeof services === 'object' && 'title' in services
              ? services.title
              : undefined

          return (
            <ScrollReveal
              key={project.id}
              delay={0.05 * index}
              direction="up"
              distance={5}
              className="group flex flex-col w-full hover:bg-muted/30 dark:hover:bg-muted/5 rounded-2xl transition-all duration-300"
            >
              <CardProject
                slug={project.slug}
                locale={locale}
                title={metaTitle || ''}
                description={metaDescription || ''}
                image={image}
                client={clientName}
                service={service}
                likes={likes || 0}
                commentCount={commentCount}
              />
            </ScrollReveal>
          )
        })}
      </div>

      {projects.length === 0 && (
        <div className="py-16 text-center border border-dashed rounded-2xl bg-accent/10">
          <p className="text-muted-foreground text-sm">
            {t(locale, 'No Project available yet.', 'Belum ada Project yang tersedia.')}
          </p>
        </div>
      )}
    </Container>
  )
}
