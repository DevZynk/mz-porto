import { Locale, t } from '@/lib/translate'

export default function Copyright({ locale }: { locale: Locale }) {
  return (
    <div className="mx-auto w-full border-t pt-5 border-border/50 flex flex-col items-center gap-1 text-xs text-muted-foreground">
{/* Website Developed by

HZ Tech
https://hztech.id

Developer:
Dheo Hilman Darmawan */}

      <span>
        &copy; {new Date().getFullYear()} MZ Technology.
        {t(locale, 'All rights reserved', 'Semua hak cipta dilindungi')}
      </span>
      <span className="text-[10px]">
        {t(locale, 'Designed & Developed by', 'Didesain & Dikembangkan oleh')}
        <a
          href="https://hztech.id"
          target="_blank"
          rel="noopener"
          className="font-medium text-foreground hover:text-primary transition-colors underline decoration-dotted underline-offset-4"
        >
          HZ Tech
        </a>
        .
      </span>
    </div>
  )
}
