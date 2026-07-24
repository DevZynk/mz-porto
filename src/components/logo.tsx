import { getMeta } from '@/lib/payload'
import Image from 'next/image'
import { Media } from '@/payload-types'
import { Locale } from '@/lib/translate'

export default async function Logo({ size = 150, locale }: { size?: number; locale?: Locale }) {
  const logo = await getMeta(locale)

  const logoData = logo?.siteSetting?.logo as Media | null | undefined
  const logoUrl = logoData && typeof logoData === 'object' ? logoData.url : null

  if (!logoUrl) {
    return <span className="font-extrabold text-2xl">MZ Porto</span>
  }

  return (
    <Image
      unoptimized
      src={logoUrl}
      alt={logoData?.alt || 'logo'}
      width={size}
      height={size / 2}
      className="object-contain dark:brightness-20 dark:invert-100"
    />
  )
}
