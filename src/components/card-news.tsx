import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Media, Category, News } from '@/payload-types'
import { HandsClappingIcon, ChatCircleIcon } from '@phosphor-icons/react/dist/ssr'
import { Locale } from '@/lib/translate'

type CardNewsProps = {
  news: News
  locale: Locale
  isLast: boolean
  readTime: number
}

export default function CardNews({ news, locale, isLast, readTime }: CardNewsProps) {
  const { metaTitle, metaDescription, metaAuthor, metaImage, category, likes, comments } =
    news.meta || {}
  const image = metaImage as Media | undefined
  const currentCategories = (category as Category[] | undefined) || []
  const activeComments = comments || []

  const publishDate = news.createdAt
    ? new Date(news.createdAt).toLocaleDateString(locale === 'id' ? 'id-ID' : 'en-US', {
        day: 'numeric',
        month: 'short',
      })
    : ''

  return (
    <article
      className={`py-8 flex border-b gap-6 md:gap-10 items-start flex-col md:flex-row justify-between ${
        !isLast ? 'border-b border-border/60' : ''
      }`}
    >
      {/* Left text column */}
      <div className="flex-1 min-w-0">
        {/* Author meta row */}
        <div className="flex items-center gap-2 mb-2 text-xs">
          <div className="w-5 h-5 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center text-neutral-600 dark:text-neutral-300 font-bold text-[9px]">
            {metaAuthor ? metaAuthor[0].toUpperCase() : 'A'}
          </div>
          <span className="font-medium text-neutral-800 dark:text-neutral-200">
            {metaAuthor || 'Admin'}
          </span>
          <span className="text-neutral-400 font-light">•</span>
          <span className="text-neutral-500">{publishDate}</span>
        </div>

        {/* Title */}
        <Link href={`/${locale}/news/${news.slug}`} className="group cursor-pointer block mb-1">
          <h3 className="font-sans font-bold text-lg md:text-xl text-neutral-900 dark:text-neutral-50 leading-snug group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors line-clamp-2">
            {metaTitle}
          </h3>
        </Link>

        {/* Excerpt */}
        {metaDescription && (
          <p className="hidden md:block font-serif text-[14px] leading-[20px] text-neutral-500 dark:text-neutral-400 line-clamp-2 mb-4">
            {metaDescription}
          </p>
        )}

        {/* Footer Meta */}
        <div className="flex items-center justify-between text-xs text-neutral-500 mt-2">
          <div className="flex items-center gap-4">
            <span>{readTime} min read</span>

            {currentCategories[0] && (
              <span className="bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded-full text-[10px] font-medium text-neutral-600 dark:text-neutral-300">
                {currentCategories[0].title}
              </span>
            )}
          </div>

          {/* Engagement Counts */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-[11px]">
              <HandsClappingIcon size={14} className="text-neutral-400" />
              <span>{likes || 0}</span>
            </div>
            <div className="flex items-center gap-1 text-[11px]">
              <ChatCircleIcon size={14} className="text-neutral-400" />
              <span>{activeComments.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Image Thumbnail */}
      {image?.url && (
        <Link
          href={`/${locale}/news/${news.slug}`}
          className="relative block w-full h-30 md:w-52 md:h-32 rounded-md overflow-hidden bg-muted shrink-0 cursor-pointer"
        >
          <Image
            unoptimized
            src={image.url}
            alt={image.alt || metaTitle || ''}
            fill
            sizes="(max-width: 768px) 100vw, 208px"
            className="object-cover"
          />
        </Link>
      )}
    </article>
  )
}
