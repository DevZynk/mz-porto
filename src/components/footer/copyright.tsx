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
        &copy; {new Date().getFullYear()} MZ Technology.{" "}
        {t(locale, 'All rights reserved', 'Semua hak cipta dilindungi')}
      </span>
      <a
        href="https://hztech.id"
        target="_blank"
        rel="noopener"
        className="sr-only"
        aria-label="HZ Tech"
      >
        hztech.id
      </a>
    </div>
  )
}
