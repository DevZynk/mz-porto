export type Locale = 'en' | 'id'

export function t(
  locale: Locale,
  en: string,
  id: string
) {
  return locale === 'id' ? id : en
}


export async function getLocale(): Promise<Locale> {
  if (typeof window !== 'undefined') {
    return 'id'
  }

  const { headers } = await import('next/headers')

  const pathname = (await headers()).get('x-pathname') || ''

  return pathname.startsWith('/id')
    ? 'id'
    : 'en'
}