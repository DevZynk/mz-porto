import { getMeta } from '@/lib/payload'
import { NextResponse } from 'next/server'

export async function GET() {
  const Meta = await getMeta()
  const siteName = Meta.siteSetting?.siteName || ''

  const content = `/* TEAM */

  Developer: Dheo Hilman Darmawan
  Company: HZ Tech
  Website: https://hztech.id
  Email: dheo.hilman@hztech.id
  GitHub: https://github.com/DevZynk

  /* SITE */

  Site: ${siteName}
  Framework: Next.js 15
  CMS: Payload CMS
  Language: Indonesian
  Doctype: HTML5

  Last Update: 2026

  /* THANKS */

  Payload CMS
  Next.js
  TailwindCSS
  Shadcn/UI

  /* CONTACT */

  https://hztech.id
`

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
