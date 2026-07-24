import React from 'react'
import { ChatCircleIcon } from '@phosphor-icons/react/dist/ssr'
import { t, Locale } from '@/lib/translate'
import { normalize_phone } from '@/lib/normalize.text'
import { getMeta } from '@/lib/payload'

type ConsultationCardProps = {
  locale: Locale
  serviceTitle: string
}

export default async function ConsultationCard({
  locale,
  serviceTitle,
}: ConsultationCardProps) {
  const { socialMedia } = await getMeta(locale)

  const contactWhatsapp = socialMedia?.whatsapp
  const contactEmail = socialMedia?.email

  return (
    <div className="p-6 rounded-2xl border border-border/60 bg-accent/20 dark:bg-accent/5 space-y-4">
      <h3 className="text-lg font-bold text-foreground">
        {t(locale, 'Need Custom Solution?', 'Butuh Solusi Kustom?')}
      </h3>
      <p className="text-xs text-muted-foreground leading-relaxed font-light">
        {t(
          locale,
          `If you have specific requirements not covered in our standard plans, feel free to consult with our experts.`,
          `Jika Anda memiliki kebutuhan spesifik yang tidak tercakup dalam paket standar kami, silakan berkonsultasi dengan tim ahli kami.`,
        )}
      </p>
      {(() => {
        const waMessage = locale === 'en'
          ? `Hello MZ Technology, I am interested in consulting about the *${serviceTitle}* service. Could I please get more information? Thank you.`
          : `Halo MZ Technology, saya tertarik untuk berkonsultasi mengenai layanan *${serviceTitle}*. Bisa mohon info lebih lanjut? Terima kasih.`

        const emailSubject = locale === 'en'
          ? `Service Inquiry: ${serviceTitle}`
          : `Konsultasi Layanan: ${serviceTitle}`

        const emailBody = locale === 'en'
          ? `Hello MZ Technology,\n\nI am interested in consulting about the ${serviceTitle} service. Could you please provide more details regarding custom solutions?\n\nThank you.`
          : `Halo MZ Technology,\n\nSaya tertarik untuk berkonsultasi mengenai layanan ${serviceTitle}. Bisa mohon informasi lebih lanjut mengenai solusi kustom yang tersedia?\n\nTerima kasih.`

        return (
          <div className="flex flex-col gap-3 pt-2">
            {contactWhatsapp && (
              <a
                href={`https://wa.me/${normalize_phone(contactWhatsapp)}?text=${encodeURIComponent(waMessage)}`}
                target="_blank"
                rel="noreferrer noopener"
                className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors cursor-pointer text-center shadow-sm"
              >
                <ChatCircleIcon size={18} />
                <span>{t(locale, 'Consult via WhatsApp', 'Konsultasi via WhatsApp')}</span>
              </a>
            )}
            {contactEmail && (
              <a
                href={`mailto:${contactEmail}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`}
                className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl text-sm font-semibold bg-primary hover:opacity-90 text-primary-foreground transition-colors cursor-pointer text-center"
              >
                {t(locale, 'Contact via Email', 'Hubungi via Email')}
              </a>
            )}
          </div>
        )
      })()}
    </div>
  )
}
