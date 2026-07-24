import { getFeaturedServices } from '@/lib/payload'
import { t, Locale } from '@/lib/translate'
import Link from 'next/link'
import Image from 'next/image'
import { Media, Service } from '@/payload-types'
import { ArrowUpRightIcon, CheckCircleIcon } from '@phosphor-icons/react/dist/ssr'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import ServicesHorizontalScroll from './services-horizontal-scroll'
import ScrollReveal from '@/components/animation/scroll-reveal'
import Container from '@/components/layout/container'

type Props = {
  locale: Locale
}

export default async function ServicesSection({ locale }: Props) {
  const { docs } = await getFeaturedServices(locale)
  const services = docs as unknown as Service[]

  if (services.length === 0) {
    return (
      <section id="services" className="w-full py-24 bg-background">
        <div className="max-w-4xl mx-auto px-6 py-16 text-center border border-dashed rounded-2xl bg-accent/10">
          <p className="text-muted-foreground text-sm">
            {t(locale, 'No services available yet.', 'Belum ada layanan yang tersedia.')}
          </p>
        </div>
      </section>
    )
  }

  const headerContent = (
    <div className="flex items-end justify-between">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-muted/50 text-xs font-semibold text-muted-foreground">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          {t(locale, 'What We Offer', 'Layanan Kami')}
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          {t(locale, 'Our Digital Services', 'Layanan Solusi Digital')}
        </h2>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop: horizontal scroll — card vertikal (original) */}
      <div className="hidden md:block">
        <ServicesHorizontalScroll header={headerContent}>
          {services.map((service) => {
            const { title, slug, smallDescription, image, isFeatured, features } = service
            const { plans } = service.pricing || {}
            const lowestPricePlan =
              plans && plans.length > 0
                ? plans.reduce(
                    (lowest, current) => (current.price < lowest.price ? current : lowest),
                    plans[0],
                  )
                : null
            const lowestPrice = lowestPricePlan ? lowestPricePlan.price : null
            const basePrice = lowestPricePlan ? lowestPricePlan.basePrice : null
            const priceSuffix = lowestPricePlan?.priceSuffix
            const serviceImg = image as Media | undefined
            const serviceFeatures = features || []

            return (
              <Card
                key={service.id}
                className={`group relative w-72 sm:w-80 shrink-0 bg-card hover:bg-muted/20 dark:hover:bg-muted/5 border transition-all duration-300 rounded-lg overflow-hidden p-0 ${
                  isFeatured
                    ? 'border-primary/40 shadow-[0_0_20px_-5px_rgba(var(--primary),0.1)] ring-1 ring-primary/20'
                    : 'border-border/60'
                }`}
              >
                {isFeatured && (
                  <div className="absolute top-4 right-4 z-10 bg-primary text-primary-foreground text-[9px] font-bold tracking-widest uppercase px-2.5 py-0.5 rounded-full shadow-sm">
                    {t(locale, 'POPULAR', 'TERPOPULER')}
                  </div>
                )}
                <CardHeader className="p-0">
                  {serviceImg?.url && (
                    <Link
                      href={`/${locale}/services/${slug}`}
                      className="relative w-full aspect-3/2 rounded-sm overflow-hidden bg-muted mb-5 cursor-pointer block border border-border/40"
                    >
                      <Image
                        unoptimized
                        src={serviceImg.url}
                        alt={serviceImg.alt || title || ''}
                        fill
                        sizes="(max-width: 768px) 100vw, 350px"
                        className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
                      />
                    </Link>
                  )}
                </CardHeader>

                <div className="flex-1 flex flex-col justify-between">
                  <CardContent className="px-6">
                    <div className="space-y-1">
                      <Link href={`/${locale}/services/${slug}`}>
                        <h3 className="text-lg font-bold tracking-tight text-foreground group-hover:text-primary transition-colors cursor-pointer line-clamp-1">
                          {title}
                        </h3>
                      </Link>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {smallDescription}
                      </p>
                    </div>

                    {serviceFeatures.length > 0 && (
                      <ul className="my-5 space-y-1.5 text-xs text-muted-foreground border-t border-border/50 pt-4">
                        {serviceFeatures.slice(0, 3).map((feat) => (
                          <li key={feat.id || feat.feature} className="flex items-center gap-2">
                            <CheckCircleIcon size={14} className="text-primary shrink-0" />
                            <span className="line-clamp-1">{feat.feature}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </CardContent>

                  <CardFooter className="flex items-center justify-between px-6 py-4 border-t border-border/50">
                    <div>
                      {lowestPrice !== null ? (
                        <div className="flex flex-col">
                          <span className="text-[10px] text-muted-foreground leading-none">
                            {t(locale, 'Starts from', 'Mulai dari')}
                          </span>
                          <div className="flex items-baseline gap-1.5 flex-wrap">
                            <span className="text-sm font-bold text-foreground">
                              Rp {lowestPrice.toLocaleString()}
                            </span>
                            {basePrice && (
                              <span className="text-[10px] text-muted-foreground line-through decoration-destructive/60">
                                Rp {basePrice.toLocaleString()}
                              </span>
                            )}
                            {priceSuffix && (
                              <span className="text-[10px] text-muted-foreground font-mono">
                                {priceSuffix}
                              </span>
                            )}
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground font-medium italic">
                          {t(locale, 'Contact us', 'Hubungi kami')}
                        </span>
                      )}
                    </div>
                    <Button variant="secondary" size="lg">
                      <Link
                        href={`/${locale}/services/${slug}`}
                        className="flex items-center gap-2"
                      >
                        <p className="text-sm">{t(locale, 'Details', 'Detail')}</p>
                        <ArrowUpRightIcon size={16} />
                      </Link>
                    </Button>
                  </CardFooter>
                </div>
              </Card>
            )
          })}
        </ServicesHorizontalScroll>
      </div>

      {/* Mobile: vertical list — card kompak horizontal (image + title + price + CTA) */}
      <Container id="services" className="block md:hidden py-16">
        <div className="max-w-4xl mx-auto">
          <div className="px-1 mb-10 pb-4 border-b border-border/80">{headerContent}</div>
          <div className="flex flex-col gap-4 px-1">
            {services.map((service, i) => {
              const { title, slug, image, isFeatured } = service
              const { plans } = service.pricing || {}
              const lowestPricePlan =
                plans && plans.length > 0
                  ? plans.reduce(
                      (lowest, current) => (current.price < lowest.price ? current : lowest),
                      plans[0],
                    )
                  : null
              const lowestPrice = lowestPricePlan ? lowestPricePlan.price : null
              const basePrice = lowestPricePlan ? lowestPricePlan.basePrice : null
              const priceSuffix = lowestPricePlan?.priceSuffix
              const serviceImg = image as Media | undefined

              return (
                <ScrollReveal key={service.id} delay={0.05 * i} direction="up" distance={15}>
                  <Card
                    className={`group relative bg-card border transition-all duration-300 rounded-lg overflow-hidden p-0 ${
                      isFeatured
                        ? 'border-primary/40 shadow-[0_0_20px_-5px_rgba(var(--primary),0.1)] ring-1 ring-primary/20'
                        : 'border-border/60'
                    }`}
                  >
                    {isFeatured && (
                      <div className="absolute top-0 right-0 z-20 bg-primary text-primary-foreground text-[9px] font-bold tracking-widest uppercase px-2.5 py-0.5 rounded-tr-lg rounded-bl-lg shadow-sm">
                        {t(locale, 'POPULAR', 'TERPOPULER')}
                      </div>
                    )}
                    <div className="flex flex-row items-stretch">
                      {serviceImg?.url && (
                        <Link
                          href={`/${locale}/services/${slug}`}
                          className="relative shrink-0 w-28 aspect-3/2 overflow-hidden bg-muted border-r border-border/40"
                        >
                          <Image
                            unoptimized
                            src={serviceImg.url}
                            alt={serviceImg.alt || title || ''}
                            fill
                            sizes="120px"
                            className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
                          />
                        </Link>
                      )}
                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        <CardContent className="px-4 pt-4 pb-2">
                          <Link href={`/${locale}/services/${slug}`}>
                            <h3 className="text-sm font-bold tracking-tight text-foreground line-clamp-1">
                              {title}
                            </h3>
                          </Link>
                        </CardContent>
                        <CardFooter className="flex items-center justify-between px-4 py-3 border-t border-border/50">
                          <div>
                            {lowestPrice !== null ? (
                              <div className="flex flex-col">
                                <span className="text-[10px] text-muted-foreground leading-none">
                                  {t(locale, 'Starts from', 'Mulai dari')}
                                </span>
                                <div className="flex items-baseline gap-1.5 flex-wrap">
                                  <span className="text-xs font-bold text-foreground">
                                    Rp {lowestPrice.toLocaleString()}
                                  </span>
                                  {basePrice && (
                                    <span className="text-[10px] text-muted-foreground line-through decoration-destructive/60">
                                      Rp {basePrice.toLocaleString()}
                                    </span>
                                  )}
                                  {priceSuffix && (
                                    <span className="text-[10px] text-muted-foreground font-mono">
                                      {priceSuffix}
                                    </span>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <span className="text-xs text-muted-foreground font-medium italic">
                                {t(locale, 'Contact us', 'Hubungi kami')}
                              </span>
                            )}
                          </div>
                          <Button variant="outline" size="sm" className="text-xs h-8">
                            <Link
                              href={`/${locale}/services/${slug}`}
                              className="flex items-center gap-1.5"
                            >
                              <span>{t(locale, 'Details', 'Detail')}</span>
                              <ArrowUpRightIcon size={13} />
                            </Link>
                          </Button>
                        </CardFooter>
                      </div>
                    </div>
                  </Card>
                </ScrollReveal>
              )
            })}
          </div>
        </div>
      </Container>
    </>
  )
}
