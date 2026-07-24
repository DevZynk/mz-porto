'use client'

import { useParams } from 'next/navigation'

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  const params = useParams()
  const locale = (params?.locale as string) || 'en'

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4 px-6">
        <h1 className="text-6xl font-bold text-foreground">500</h1>
        <p className="text-muted-foreground">
          {locale === 'id' ? 'Terjadi kesalahan' : 'Something went wrong'}
        </p>
        <button
          onClick={reset}
          className="inline-block text-sm font-semibold text-primary underline cursor-pointer"
        >
          {locale === 'id' ? 'Coba lagi' : 'Try again'}
        </button>
      </div>
    </div>
  )
}
