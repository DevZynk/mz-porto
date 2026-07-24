'use client'

import { createContext, useContext } from 'react'

type Social = {
  whatsapp: string
  instagram: string
  tiktok: string
  facebook: string
}

type SiteService = {
  id: number | string
  title: string
  slug: string
}

type Site = {
  siteName: string
  siteDescription: string
  location: string
  logoUrl: string | null
  alt: string
  social: Social
  maps: string
  address: string
  email: string
  phone: string
  services: SiteService[]
}

const SiteContext = createContext<Site | null>(null)

export function SiteProvider({ children, value }: { children: React.ReactNode; value: Site }) {
  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>
}

export function useSite() {
  const ctx = useContext(SiteContext)
  if (!ctx) throw new Error('useSite must be used inside SiteProvider')
  return ctx
}
