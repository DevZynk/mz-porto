import { getMeta } from '@/lib/payload'
import { MetadataRoute } from 'next'

export default async function robots(): Promise<MetadataRoute.Robots> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  let disallow: string[] = []
  try {
    const meta = await getMeta()
    if (meta.advancedSEO?.robots === 'noindex') {
      disallow = ['/']
    }
  } catch {}

  return {
    rules: {
      userAgent: '*',
      allow: disallow.length === 0 ? '/' : undefined,
      disallow: disallow.length > 0 ? disallow : undefined,
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
