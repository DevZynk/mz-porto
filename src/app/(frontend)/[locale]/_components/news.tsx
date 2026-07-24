import { getLatestNews } from '@/lib/payload'
import { t, Locale } from '@/lib/translate'
import Link from 'next/link'
import { News as NewsType } from '@/payload-types'
import { ArrowRightIcon } from '@phosphor-icons/react/dist/ssr'
import Container from '@/components/layout/container'
import CardNews from '@/components/card-news'
import ScrollReveal from '@/components/animation/scroll-reveal'

type Props = {
  locale: Locale
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

export default async function News({ locale }: Props) {
  // Fetch 4 latest news items
  const { docs } = await getLatestNews(locale, 4)
  const newsItems = docs as unknown as NewsType[]

  return (
    <Container id="news" className="max-w-4xl py-24">
      {/* Section Header */}
      <div className="flex items-end justify-between mb-8 pb-4 border-b border-border/80">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-muted/50 text-xs font-semibold text-muted-foreground">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            {t(locale, 'Latest Updates', 'Pembaruan Terkini')}
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            {t(locale, 'Latest from MZ Technology', 'Terbaru dari MZ Technology')}
          </h2>
        </div>
        <Link
          href={`/${locale}/news`}
          className="group flex items-center gap-1 text-xs font-semibold text-primary hover:opacity-90 transition-all cursor-pointer whitespace-nowrap"
        >
          <span>{t(locale, 'View all', 'Lihat semua')}</span>
          <ArrowRightIcon size={14} className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* Medium-style Article list */}
      <div className="space-y-0">
        {newsItems.map((news, index) => (
          <ScrollReveal key={news.id} delay={0.05 * index} direction="up" distance={5}>
            <CardNews
              news={news as any}
              locale={locale}
              isLast={index === newsItems.length - 1}
              readTime={estimateReadingTime(news.content?.content)}
            />
          </ScrollReveal>
        ))}

        {newsItems.length === 0 && (
          <div className="py-16 text-center border border-dashed rounded-2xl bg-accent/10">
            <p className="text-muted-foreground text-sm">
              {t(locale, 'No articles available yet.', 'Belum ada artikel yang tersedia.')}
            </p>
          </div>
        )}
      </div>
    </Container>
  )
}
