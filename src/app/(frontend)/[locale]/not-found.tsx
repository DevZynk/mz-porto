import Link from 'next/link'

export default async function NotFound(props: { params?: Promise<{ locale?: string }> }) {
  let locale = 'en'
  try {
    const resolved = await props.params
    if (resolved?.locale) locale = resolved.locale
  } catch {}

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4 px-6">
        <h1 className="text-6xl font-bold text-foreground">404</h1>
        <p className="text-muted-foreground">
          {locale === 'id' ? 'Halaman tidak ditemukan' : 'Page not found'}
        </p>
        <Link
          href={`/${locale}`}
          className="inline-block text-sm font-semibold text-primary underline"
        >
          {locale === 'id' ? 'Kembali ke beranda' : 'Go home'}
        </Link>
      </div>
    </div>
  )
}
