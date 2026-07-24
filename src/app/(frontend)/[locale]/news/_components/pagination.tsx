import React from 'react'
import Link from 'next/link'
import { t, Locale } from '@/lib/translate'

type Props = {
  currentPage: number
  totalPages: number
  hasPrevPage: boolean
  hasNextPage: boolean
  getPageUrl: (targetPage: number) => string
  locale: Locale
}

export default function Pagination({
  currentPage,
  totalPages,
  hasPrevPage,
  hasNextPage,
  getPageUrl,
  locale,
}: Props) {
  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-between border-t border-border/60 pt-6 mt-8">
      <Link
        href={hasPrevPage ? getPageUrl(currentPage - 1) : '#'}
        className={`text-xs font-semibold px-4 py-2 border rounded-full transition-colors ${
          hasPrevPage 
            ? 'text-foreground hover:bg-accent cursor-pointer' 
            : 'text-neutral-300 border-neutral-100 dark:text-neutral-700 dark:border-neutral-900 pointer-events-none'
        }`}
      >
        {t(locale, '← Previous', '← Sebelumnya')}
      </Link>
      
      <span className="text-xs text-muted-foreground font-mono">
        {t(locale, 'Page', 'Halaman')} {currentPage} {t(locale, 'of', 'dari')} {totalPages}
      </span>

      <Link
        href={hasNextPage ? getPageUrl(currentPage + 1) : '#'}
        className={`text-xs font-semibold px-4 py-2 border rounded-full transition-colors ${
          hasNextPage 
            ? 'text-foreground hover:bg-accent cursor-pointer' 
            : 'text-neutral-300 border-neutral-100 dark:text-neutral-700 dark:border-neutral-900 pointer-events-none'
        }`}
      >
        {t(locale, 'Next →', 'Berikutnya →')}
      </Link>
    </div>
  )
}
