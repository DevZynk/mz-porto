import {
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
import { normalize_phone } from '@/lib/normalize.text'

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

type Props = {
  val?: Record<string, string | null | undefined>
}

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
      const name = platformNames[key] || key

      return { key, name, href, Icon }
    })

  return (
    <div className="flex flex-row gap-1">
      {socialLinks.map(({ key, name, href, Icon }) => (
        <Link
          key={key}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={name}
          className="inline-flex items-center justify-center w-9 h-9 rounded-md hover:scale-110 hover:bg-muted transition-all duration-300"
        >
          <Icon size={18} />
        </Link>
      ))}
    </div>
  )
}
