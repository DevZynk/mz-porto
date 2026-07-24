'use server'

import { getPayloadClient } from '@/lib/payload'
import { revalidatePath } from 'next/cache'

export async function addComment(newsId: string | number, locale: string, formData: FormData) {
  const userName = (formData.get('userName') as string) || 'Anonim'
  const comment = formData.get('comment') as string

  if (!comment) return { success: false, error: 'Komentar tidak boleh kosong' }

  try {
    const payload = await getPayloadClient()
    const newsItem = await payload.findByID({ collection: 'news', id: newsId })

    await payload.update({
      collection: 'news',
      id: newsId,
      data: {
        meta: {
          ...newsItem.meta,
          comments: [...(newsItem.meta?.comments || []), { userName, comment }],
        },
      },
    })

    revalidatePath(`/${locale}/news/${newsItem.slug}`)
    return { success: true }
  } catch (error: any) {
    console.error('Failed to submit comment:', error)
    return { success: false, error: error.message || 'Gagal mengirim komentar' }
  }
}

export async function incrementLikes(newsId: string | number, locale: string) {
  try {
    const payload = await getPayloadClient()

    const newsItem = await payload.findByID({ collection: 'news', id: newsId })
    const currentLikes = newsItem.meta?.likes || 0

    await payload.update({
      collection: 'news',
      id: newsId,
      data: {
        meta: { ...newsItem.meta, likes: currentLikes + 1 },
      },
    })

    revalidatePath(`/${locale}/news/${newsItem.slug}`)
    return { success: true, likes: currentLikes + 1 }
  } catch (error: any) {
    console.error('Failed to increment likes:', error)
    return { success: false, error: error.message }
  }
}
