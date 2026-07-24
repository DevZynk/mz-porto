'use client'

import Image from 'next/image'
import { useSite } from '@/components/provider/site'

export default function Logo({ size = 150 }: { size?: number }) {
  const { logoUrl, alt, siteName } = useSite()

  if (!logoUrl) {
    return <span className="font-extrabold text-2xl">{siteName}</span>
  }

  return (
    <Image
      unoptimized
      src={logoUrl}
      alt={alt || 'logo'}
      width={size}
      height={size / 2}
      className="object-contain dark:brightness-20 dark:invert-100"
    />
  )
}
