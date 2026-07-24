import { getPayload } from 'payload'
import config from '@payload-config'
import type { Payload } from 'payload'
import { cache } from 'react'

const globalCache = globalThis as typeof globalThis & { __payloadClient?: Promise<Payload> }

export const getPayloadClient = async (): Promise<Payload> => {
  if (globalCache.__payloadClient) return globalCache.__payloadClient

  globalCache.__payloadClient = getPayload({ config }).catch((err) => {
    globalCache.__payloadClient = undefined
    throw err
  })

  return globalCache.__payloadClient
}

// Cached Globals
export const getMeta = cache(async (locale?: string) => {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'meta', locale: (locale || 'id') as any })
})

export const getHero = cache(async (locale?: string) => {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'hero', locale: (locale || 'id') as any })
})

export const getAbout = cache(async (locale?: string) => {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'about', locale: (locale || 'id') as any })
})

// Cached Collections
export const getServices = cache(async (locale?: string) => {
  const payload = await getPayloadClient()
  return payload.find({
    collection: 'services',
    locale: locale as any,
    limit: 100,
    sort: 'createdAt',
  })
})

export const getClients = cache(async (locale?: string) => {
  const payload = await getPayloadClient()
  return payload.find({
    collection: 'clients',
    locale: locale as any,
    limit: 100,
  })
})

export const getLatestProjects = cache(async (locale?: string, limit = 3) => {
  const payload = await getPayloadClient()
  return payload.find({
    collection: 'projects',
    locale: locale as any,
    limit,
    sort: '-createdAt',
  })
})

export const getLatestNews = cache(async (locale?: string, limit = 4) => {
  const payload = await getPayloadClient()
  return payload.find({
    collection: 'news',
    locale: locale as any,
    limit,
    sort: '-createdAt',
  })
})

export const getFeaturedServices = cache(async (locale?: string, limit = 12) => {
  const payload = await getPayloadClient()
  return payload.find({
    collection: 'services',
    locale: locale as any,
    limit,
    sort: '-isFeatured,-createdAt',
  })
})

export const getService = cache(async (slug: string, locale?: string) => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'services',
    where: { slug: { equals: slug } },
    locale: locale as any,
    limit: 1,
    depth: 3,
  })
  return docs[0] || null
})

export const getProject = cache(async (slug: string, locale?: string) => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'projects',
    where: { slug: { equals: slug } },
    locale: locale as any,
    limit: 1,
  })
  return docs[0] || null
})

export const getArticle = cache(async (slug: string, locale?: string) => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'news',
    where: { slug: { equals: slug } },
    locale: locale as any,
    limit: 1,
  })
  return docs[0] || null
})
