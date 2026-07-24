import { getPayloadClient, getMeta } from '@/lib/payload'
import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayloadClient()
  const meta = await getMeta()
  const baseUrl =
    meta.advancedSEO?.canonicalUrl || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  const locales = ['en', 'id']
  const entries: MetadataRoute.Sitemap = []

  for (const locale of locales) {
    entries.push({
      url: `${baseUrl}/${locale}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    })
  }

  async function fetchAll<T>(collection: string): Promise<T[]> {
    const limit = 500
    let page = 1
    let all: T[] = []
    let hasMore = true
    while (hasMore) {
      const result = await payload.find({
        collection: collection as any,
        limit,
        page,
        sort: '-updatedAt',
      })
      all = all.concat(result.docs as T[])
      hasMore = result.hasNextPage ?? false
      page++
    }
    return all
  }

  const services = await fetchAll<any>('services')
  for (const service of services) {
    for (const locale of locales) {
      entries.push({
        url: `${baseUrl}/${locale}/services/${service.slug}`,
        lastModified: new Date(service.updatedAt),
        changeFrequency: 'monthly',
        priority: 0.8,
      })
    }
  }

  const projects = await fetchAll<any>('projects')
  for (const project of projects) {
    for (const locale of locales) {
      entries.push({
        url: `${baseUrl}/${locale}/project/${project.slug}`,
        lastModified: new Date(project.updatedAt),
        changeFrequency: 'monthly',
        priority: 0.7,
      })
    }
  }

  const news = await fetchAll<any>('news')
  for (const article of news) {
    for (const locale of locales) {
      entries.push({
        url: `${baseUrl}/${locale}/news/${article.slug}`,
        lastModified: new Date(article.updatedAt),
        changeFrequency: 'weekly',
        priority: 0.6,
      })
    }
  }

  return entries
}
