import React from 'react'
import { CheckIcon } from '@phosphor-icons/react/dist/ssr'
import { t, Locale } from '@/lib/translate'
import { getMeta } from '@/lib/payload'
import { normalize_phone } from '@/lib/normalize.text'

type PlanItem = {
  name: string
  basePrice?: number | null
  price: number
  priceSuffix?: string | null
  description?: string | null
  features?:
    | {
        feature?: string | null
        id?: string | null
      }[]
    | null
  id?: string | null
}

type PricingPlansProps = {
  plans: PlanItem[]
  locale: Locale
  serviceTitle: string
}

export default async function PricingPlans({ plans, locale, serviceTitle }: PricingPlansProps) {
  if (plans.length === 0) return null
  const { socialMedia } = await getMeta(locale)

  const contactWhatsapp = socialMedia?.whatsapp
  const contactEmail = socialMedia?.email

  return (
    <div className="pt-12 border-t border-border/40">
      <div className="space-y-2 mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          {t(locale, 'Select Pricing Plan', 'Pilihan Paket Harga')}
        </h2>
        <p className="text-sm text-muted-foreground max-w-2xl font-light">
          {t(
            locale,
            'Choose the package that best fits your project scope and budget requirements.',
            'Pilih paket yang paling sesuai dengan cakupan proyek dan kebutuhan anggaran Anda.',
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan, index) => {
          const waMessage = locale === 'en'
            ? `Hello MZ Technology, I would like to inquire about/order the *${serviceTitle}* service with the *${plan.name}* package. What are the next steps? Thank you.`
            : `Halo MZ Technology, saya ingin bertanya/memesan layanan *${serviceTitle}* dengan Paket *${plan.name}*. Bagaimana prosedur pemesanan selanjutnya? Terima kasih.`

          const emailSubject = locale === 'en'
            ? `Service Order: ${serviceTitle} - ${plan.name} Package`
            : `Pemesanan Layanan: ${serviceTitle} - Paket ${plan.name}`

          const emailBody = locale === 'en'
            ? `Hello MZ Technology,\n\nI would like to order the ${serviceTitle} service with the ${plan.name} package.\n\nCould you please provide the billing procedure and next steps?\n\nThank you.`
            : `Halo MZ Technology,\n\nSaya ingin memesan layanan ${serviceTitle} dengan Paket ${plan.name}.\n\nBisa mohon diinformasikan prosedur administrasi dan langkah selanjutnya?\n\nTerima kasih.`

          const whatsappLink = contactWhatsapp
            ? `https://wa.me/${normalize_phone(contactWhatsapp)}?text=${encodeURIComponent(waMessage)}`
            : null
          
          const emailLink = contactEmail
            ? `mailto:${contactEmail}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`
            : null

          const ctaUrl = whatsappLink || emailLink || '#'

          // Highlight the standard plan (typically second package) if there are multiple plans
          const isHighlighted = plans.length > 1 && index === 1

          return (
            <div
              key={plan.id || plan.name}
              className={`flex flex-col justify-between bg-card hover:bg-muted/10 dark:hover:bg-muted/5 border rounded-3xl p-8 hover:shadow-xl transition-all duration-300 relative ${
                isHighlighted
                  ? 'border-primary shadow-[0_0_30px_-5px_rgba(var(--primary),0.15)] ring-1 ring-primary md:scale-[1.03] z-10'
                  : 'border-border/60'
              }`}
            >
              {isHighlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 bg-primary text-primary-foreground text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full shadow-md">
                  {t(locale, 'MOST POPULAR', 'PALING POPULER')}
                </div>
              )}

              <div className="space-y-5">
                <div className="space-y-1">
                  <h3 className="font-bold text-xl text-foreground">{plan.name}</h3>
                  {plan.description && (
                    <p className="text-xs text-muted-foreground leading-relaxed font-light">
                      {plan.description}
                    </p>
                  )}
                </div>

                <div className="flex items-baseline gap-1.5 flex-wrap pt-2">
                  <span className="text-3xl font-extrabold tracking-tight text-foreground">
                    Rp {plan.price.toLocaleString()}
                  </span>
                  {plan.basePrice && (
                    <span className="text-xs text-muted-foreground line-through decoration-destructive/60">
                      Rp {plan.basePrice.toLocaleString()}
                    </span>
                  )}
                  {plan.priceSuffix && (
                    <span className="text-xs text-muted-foreground font-mono">
                      {plan.priceSuffix}
                    </span>
                  )}
                </div>

                {plan.features && plan.features.length > 0 && (
                  <ul className="space-y-3 text-xs text-muted-foreground pt-5 border-t border-border/40">
                    {plan.features.map((feat) => (
                      <li key={feat.id || feat.feature || ''} className="flex items-start gap-2.5">
                        <span className="p-0.5 rounded-full bg-primary/10 text-primary mt-0.5 shrink-0">
                          <CheckIcon size={10} className="stroke-3" />
                        </span>
                        <span className="leading-tight">{feat.feature}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="pt-8">
                <a
                  href={ctaUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className={`flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer text-center shadow-xs ${
                    isHighlighted
                      ? 'bg-primary hover:bg-primary/95 text-primary-foreground font-extrabold'
                      : 'bg-muted hover:bg-muted/80 text-foreground border border-border/60'
                  }`}
                >
                  {t(locale, 'Choose Plan', 'Pilih Paket')}
                </a>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
