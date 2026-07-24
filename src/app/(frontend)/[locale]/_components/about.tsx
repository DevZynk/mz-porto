import ScrollReveal from '@/components/animation/scroll-reveal'
import Container from '@/components/layout/container'
import { getAbout, getClients } from '@/lib/payload'
import { t, Locale } from '@/lib/translate'
import { CpuIcon } from '@phosphor-icons/react/dist/ssr'
import { Media } from '@/payload-types'
import ClientsParallaxScroll from './clients-parallax-scroll'
import LogoLoop, { type LogoItem } from '@/components/animation/logo-loop'

export default async function About({ locale }: { locale: Locale }) {
  const data = await getAbout(locale)
  const client = await getClients(locale)

  const clientLogos = client.docs
    .filter(
      (c): c is typeof c & { logo: Media } =>
        !!c.logo && typeof c.logo === 'object' && !!(c.logo as Media).url,
    )
    .map((c) => ({
      id: c.id,
      name: c.name,
      logoUrl: (c.logo as Media).url!,
    }))

  return (
    <>
      <Container id="about" className="h-auto py-24 flex flex-col justify-center">
        <ScrollReveal className="space-y-4 text-center mb-14 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-muted/50 text-xs font-semibold text-muted-foreground">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
            {t(locale, 'About us', 'Tentang Kami')}
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight bg-linear-to-r from-foreground via-foreground/80 to-foreground/50 bg-clip-text text-transparent">
            {data.title}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
            {data.description}
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start w-full max-w-4xl mx-auto">
          {/* Left Side: Story & Stats */}
          <ScrollReveal direction="left" className="lg:col-span-5 space-y-6">
            <div className="relative rounded-2xl border border-border/60 bg-muted/30 backdrop-blur-sm p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <CpuIcon className="w-4 h-4 text-primary" />
                </div>
                <span className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
                  {t(locale, 'Our Story', 'Kisah Kami')}
                </span>
              </div>
              <h4 className="text-lg font-bold text-foreground">
                {t(locale, 'Innovation & Quality', 'Inovasi & Kualitas')}
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed italic">
                &ldquo;{data.description}&rdquo;
              </p>
            </div>

            <div className="rounded-xl border border-border/40 bg-muted/20 px-6 py-5">
              <div className="flex items-center gap-10">
                {data.item?.[0] && (
                  <div>
                    <div className="text-4xl font-extrabold text-foreground tracking-tight tabular-nums">
                      {data.item[0].value}
                    </div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1 font-semibold">
                      {data.item[0].title}
                    </div>
                  </div>
                )}
                {data.item?.[1] && (
                  <>
                    <div className="w-px h-10 bg-border" />
                    <div>
                      <div className="text-4xl font-extrabold text-foreground tracking-tight tabular-nums">
                        {data.item[1].value}
                      </div>
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1 font-semibold">
                        {data.item[1].title}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </ScrollReveal>

          <div className="hidden lg:flex lg:col-span-1 items-stretch justify-center pt-4">
            <div className="w-px bg-linear-to-b from-transparent via-border to-transparent" />
          </div>

          <ScrollReveal
            direction="right"
            className="lg:col-span-6 space-y-5 text-foreground/80 leading-relaxed text-base sm:text-lg"
          >
            {data.content && data.content.length > 0 ? (
              <div className="space-y-4">
                {data.content.map((p: any, i: number) => (
                  <p
                    key={p.id || i}
                    className="text-base sm:text-lg font-normal text-muted-foreground leading-relaxed"
                  >
                    {p.paragraph}
                  </p>
                ))}
              </div>
            ) : null}
          </ScrollReveal>
        </div>
      </Container>

      {clientLogos.length > 0 && (
        <>
          <div className="block md:hidden py-12 border-t border-border">
            <h3 className="text-2xl font-bold font-mono tracking-tight text-foreground text-center mb-8">
              {t(locale, 'Our Clients', 'Klien Kami')}
            </h3>
            <LogoLoop
              logos={clientLogos.map((l) => ({ src: l.logoUrl, alt: l.name }) satisfies LogoItem)}
              speed={80}
              direction="left"
              logoHeight={60}
              gap={40}
              scaleOnHover
              fadeOut
            />
          </div>
          <div className="hidden md:block">
            <ClientsParallaxScroll
              heading={
                <h3 className="text-2xl w-full mx-auto font-bold font-mono tracking-tight text-foreground text-center">
                  {t(locale, 'Our Clients', 'Klien Kami')}
                </h3>
              }
              logos={clientLogos}
            />
          </div>
        </>
      )}
    </>
  )
}
