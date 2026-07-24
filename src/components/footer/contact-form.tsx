'use client'

import { useRef } from 'react'
import { submitContact } from '@/app/actions/contact'
import { Button } from '@/components/ui/button'

export default function ContactForm({ locale }: { locale: string }) {
  const formRef = useRef<HTMLFormElement>(null)

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        const result = await submitContact(formData)
        if (result.success) formRef.current?.reset()
      }}
      className="flex flex-col gap-3 w-full"
    >
      <input
        name="name"
        type="text"
        required
        placeholder={locale === 'id' ? 'Nama Anda' : 'Your Name'}
        className="w-full text-sm bg-background border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
      />
      <input
        name="email"
        type="email"
        required
        placeholder={locale === 'id' ? 'Email Anda' : 'Your Email'}
        className="w-full text-sm bg-background border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
      />
      <textarea
        name="message"
        required
        rows={3}
        placeholder={locale === 'id' ? 'Pesan Anda' : 'Your Message'}
        className="w-full text-sm bg-background border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary resize-none"
      />
      <Button type="submit" size="sm" className="self-start">
        {locale === 'id' ? 'Kirim Pesan' : 'Send Message'}
      </Button>
    </form>
  )
}
