import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getMeta } from '@/lib/payload'

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await props.params
  const meta = await getMeta(locale)
  return {
    title: 'Services',
    description: meta.siteSetting?.siteDescription || '',
  }
}

export default async function Page(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params
  redirect(`/${locale}#services`)
}
