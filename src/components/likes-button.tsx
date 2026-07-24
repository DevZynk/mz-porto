'use client'

import { useState } from 'react'
import { incrementLikes } from '@/app/actions/comment'
import { HeartIcon } from '@phosphor-icons/react'

type Props = {
  newsId: string | number
  initialLikes: number
  locale: string
}

export default function LikesButton({ newsId, initialLikes, locale }: Props) {
  const [likes, setLikes] = useState(initialLikes)
  const [loading, setLoading] = useState(false)

  const handleLike = async () => {
    if (loading) return
    setLoading(true)
    setLikes((prev) => prev + 1)

    try {
      const res = await incrementLikes(newsId, locale)
      if (res.success && res.likes !== undefined) {
        setLikes(res.likes)
      } else {
        setLikes((prev) => prev - 1)
      }
    } catch (err) {
      setLikes((prev) => prev - 1)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleLike}
      disabled={loading}
      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors py-1.5 px-3 rounded-full border bg-background hover:bg-accent cursor-pointer"
    >
      <HeartIcon size={18} className="transition-transform duration-200 active:scale-125" />
      <span className="font-medium font-mono">{likes}</span>
    </button>
  )
}
