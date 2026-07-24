import {
  ArrowUpRightIcon,
  EnvelopeIcon,
  FacebookLogoIcon,
  InstagramLogoIcon,
  LinkedinLogoIcon,
  PhoneIcon,
  TelegramLogoIcon,
  TiktokLogoIcon,
  WhatsappLogoIcon,
  XLogoIcon,
} from '@phosphor-icons/react/dist/ssr'
import Link from 'next/link'
import { Meta } from '@/payload-types'

type Props = {
  val?: Meta['socialMedia']
}

const Icons = {
  facebook: FacebookLogoIcon,
  instagram: InstagramLogoIcon,
  email: EnvelopeIcon,
  whatsapp: WhatsappLogoIcon,
  linkedin: LinkedinLogoIcon,
  twitter: XLogoIcon,
  telegram: TelegramLogoIcon,
  tiktok: TiktokLogoIcon,
  phone: PhoneIcon,
}

const platformNames: Record<string, string> = {
  facebook: 'Facebook',
  instagram: 'Instagram',
  email: 'Email',
  whatsapp: 'WhatsApp',
  linkedin: 'LinkedIn',
  twitter: 'Twitter',
  telegram: 'Telegram',
  tiktok: 'TikTok',
  phone: 'Phone',
}

import { normalize_phone } from '@/lib/normalize.text'
import { Button } from '../ui/button'

export default function Contacts({ val }: Props) {
  if (!val) return null

  const socialLinks = Object.entries(val)
    .filter(([key, value]) => !!value && key !== 'id')
    .map(([key, value]) => {
      let href = value as string
      if (key === 'email' && !href.startsWith('mailto:')) {
        href = `mailto:${href}`
      } else if (key === 'phone' && !href.startsWith('tel:')) {
        href = `tel:${href}`
      } else if (key === 'whatsapp' && !href.startsWith('http') && !href.startsWith('wa.me')) {
        href = `https://wa.me/${normalize_phone(href)}`
      }

      const Icon = Icons[key as keyof typeof Icons] || EnvelopeIcon

      return {
        key,
        title: platformNames[key] || key,
        href,
        Icon,
      }
    })

  return (
    <div className="flex flex-row gap-1">
      {socialLinks.map((item) => {
        const Icon = item.Icon
        return (
          <Button key={item.key} variant={'ghost'} size={'icon-lg'} className='hover:scale-110'>
            <Link
              href={item.href}
              target="_blank"
              className="flex items-center justify-between gap-4 py-1 h transition-all duration-300 transform  group"
            >
              <Icon size={18} />
            </Link>
          </Button>
        )
      })}
    </div>
  )
}
