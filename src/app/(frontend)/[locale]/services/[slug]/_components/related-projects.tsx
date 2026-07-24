import React from 'react'
import { ImageBox } from '@inoo-ch/payload-image-optimizer/client'
import Link from 'next/link'
import { Media, Project } from '@/payload-types'
import { ArrowRightIcon } from '@phosphor-icons/react/dist/ssr'
import { t, Locale } from '@/lib/translate'

type RelatedProjectsProps = {
  relatedProjects: Project[]
  locale: Locale
}

export default function RelatedProjects({ relatedProjects, locale }: RelatedProjectsProps) {
  if (relatedProjects.length === 0) return null

  return (
    <div className="pt-12 border-t border-border/40">
      <h2 className="text-2xl font-bold text-foreground mb-8">
        {t(locale, 'Related Projects', 'Proyek Terkait')}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatedProjects.map((project) => {
          const projImg = project.meta?.metaImage as Media | undefined
          return (
            <div
              key={project.id}
              className="group flex flex-col bg-card/45 dark:bg-card/10 border border-border/40 hover:border-border/80 rounded-xl overflow-hidden hover:shadow-md transition-all duration-300"
            >
              {projImg?.url && (
                <Link
                  href={`/${locale}/project/${project.slug}`}
                  className="relative block aspect-3/2 overflow-hidden"
                >
                  <ImageBox
                    unoptimized
                    media={projImg.url}
                    alt={projImg.alt || project.meta?.metaTitle || ''}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 360px"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>
              )}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  <Link href={`/${locale}/project/${project.slug}`}>
                    <h4 className="font-bold text-foreground leading-snug line-clamp-1 group-hover:text-primary transition-colors">
                      {project.meta?.metaTitle}
                    </h4>
                  </Link>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {project.meta?.metaDescription}
                  </p>
                </div>
                <Link
                  href={`/${locale}/project/${project.slug}`}
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
  )
}
