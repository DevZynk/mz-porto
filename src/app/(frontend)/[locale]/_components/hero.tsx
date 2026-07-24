import Container from '@/components/layout/container'
import Image from 'next/image'
import { getHero } from '@/lib/payload'
import ScrollReveal from '@/components/animation/scroll-reveal'
import { Button } from '@/components/ui/button'
import { t, Locale } from '@/lib/translate'
import { Media } from '@/payload-types'
import ShinyText from '@/components/animation/shiny-text'
import Threads from './client-threads'
import { ArrowDownIcon } from '@phosphor-icons/react/dist/ssr'
import { useIsMobile } from '@/hooks/use-is-mobile'

export default async function Hero({ locale }: { locale: Locale }) {
  const res = await getHero(locale)
  const { title, description, image } = res
  const heroImage = image && typeof image === 'object' ? (image as Media) : null

  return (
    <Container id="hero" className="relative flex my-auto w-full h-dvh">
      <div className="flex justify-center items-center max-w-4xl mx-auto w-full">
        {/* Background Ambient Gradients, 16:9 Hero Image & WebGL Threads */}
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
          {/* 16:9 Background Image Layer */}
          {heroImage?.url && (
            <div className="absolute inset-0 w-full h-full flex items-center justify-center">
              <div className="relative w-full aspect-video min-h-full min-w-full overflow-hidden">
                <Image
                  unoptimized
                  src={heroImage.url}
                  alt={heroImage.alt || title || 'Hero Background'}
                  fill
                  priority
                  className="object-cover object-center scale-105 filter blur-[1px]"
                />
                {/* Gradient Vignette Mask for Legibility */}
                <div className="absolute inset-0 bg-linear-to-b from-background/90 via-background/65 to-background" />
                <div className="absolute inset-0 bg-radial from-transparent via-background/40 to-background" />
              </div>
            </div>
          )}

          {/* Subtle radial center spotlight matching theme primary color */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,color-mix(in_srgb,var(--primary)_8%,transparent)_0%,transparent_70%)]" />

          {/* Animated ambient orbs */}
          <div
            className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] animate-pulse"
            style={{ animationDuration: '10s' }}
          />
          <div
            className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-chart-1/5 rounded-full blur-[100px] animate-pulse"
            style={{ animationDuration: '15s' }}
          />

          {/* WebGL Threads Canvas (auto-disabled on mobile) */}
       <div className="absolute hidden md:block inset-0 z-10 opacity-70">
            <Threads amplitude={2} distance={0.3} enableMouseInteraction />
          </div>
        </div>

        <div className="max-w-4xl text-center my-auto py-10 relative z-20 w-full px-4">
          {/* Eyebrow badge */}
          <ScrollReveal delay={0} direction="up" distance={10}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border/60 bg-muted/60 backdrop-blur-sm text-xs font-semibold text-muted-foreground mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              {t(locale, 'Reliable IT Solutions', 'Solusi IT Terpercaya')}
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1} direction="up" distance={20}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]">
              {' '}
              <ShinyText
                text={title}
                speed={5}
                delay={0}
                color={'var(--foreground)'}
                shineColor="var(--primary)"
                spread={120}
                direction="left"
                yoyo={false}
                pauseOnHover={true}
                disabled={false}
              />
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={0.25} direction="up" distance={20}>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed mt-5">
              {description}
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.4} direction="up" distance={15}>
            <div className="flex items-center justify-center gap-3 pt-6 flex-wrap">
              <a href="#contact">
                <Button size="lg" className="shadow-lg shadow-primary/20">
                  {t(locale, 'Contact Us', 'Hubungi Kami')}
                </Button>
              </a>
              <a href="#about">
                <Button size="lg" variant="outline">
                  {t(locale, 'Learn More', 'Pelajari Lebih')}
                </Button>
              </a>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.55} direction="up" distance={10}>
            <p className="text-xs text-muted-foreground/60 mt-6 font-medium">
              {t(
                locale,
                'Trusted by 50+ companies across Indonesia',
                'Dipercaya oleh 50+ perusahaan di Indonesia',
              )}
            </p>
          </ScrollReveal>
        </div>
      </div>

      {/* Scroll down indicator */}
      <a
        href="#about"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 text-muted-foreground/50 hover:text-primary transition-colors group"
        aria-label="Scroll down"
      >
        <span className="text-[10px] font-mono uppercase tracking-widest opacity-70 group-hover:opacity-100 transition-opacity">
          {t(locale, 'Scroll', 'Gulir')}
        </span>
        <ArrowDownIcon size={16} className="animate-bounce" />
      </a>
    </Container>
  )
}
