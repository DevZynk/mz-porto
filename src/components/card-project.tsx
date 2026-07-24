import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Media } from '@/payload-types'
import { t, Locale } from '@/lib/translate'
import { ArrowRightIcon } from '@phosphor-icons/react/dist/ssr'

type CardProjectProps = {
  slug: string
  locale: Locale
  title?: string
  description?: string
  image?: Media
  service?: string
  client?: string
  likes?: number
  commentCount?: number
}

export default function CardProject({
  slug,
  locale,
  title,
  description,
  image,
  client,
  service,
}: CardProjectProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-6 p-5 w-full items-start sm:items-center border-b">
      {/* Project Image */}
      {image?.url && (
        <Link
          href={`/${locale}/project/${slug}`}
          className="relative aspect-square w-20 md:w-28 rounded-xl overflow-hidden bg-muted border border-border/50 shrink-0 cursor-pointer block"
        >
          <Image
            unoptimized
            src={image.url}
            alt={image.alt || title || ''}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 176px, 208px"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </Link>
      )}

      {/* Content */}
      <div className="flex-1 flex flex-col justify-between h-full min-w-0 space-y-3">
        <div className="space-y-2">
          {/* Client badge and link */}
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-wrap gap-1.5">
              {client && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-medium font-mono uppercase bg-primary/10 text-primary border border-primary/20 animate-fade-in">
                  {client}
                </span>
              )}
              {service && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-medium font-mono uppercase bg-secondary/15 text-muted-foreground border border-border animate-fade-in">
                  {service}
                </span>
              )}
            </div>
            <Link
              href={`/${locale}/project/${slug}`}
              className="inline-flex items-center gap-1 font-semibold text-primary text-xs hover:opacity-90 group/link cursor-pointer"
            >
              <span>{t(locale, 'View Project', 'Lihat Proyek')}</span>
              <ArrowRightIcon
                size={12}
                className="transition-transform group-hover/link:translate-x-0.5"
              />
            </Link>
          </div>

          {/* Title */}
          <Link href={`/${locale}/project/${slug}`} className="block group/title cursor-pointer">
            <h3 className="text-lg md:text-xl font-bold tracking-tight text-foreground group-hover/title:text-primary transition-colors line-clamp-1">
              {title}
            </h3>
          </Link>

          {/* Description */}
          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed font-light">
            {description}
          </p>
        </div>
      </div>
    </div>
  )
}
