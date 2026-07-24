'use client'

import { useState, useEffect } from 'react'
import { ChatCircleIcon, ShareNetworkIcon, HandsClapping } from '@phosphor-icons/react'
import { incrementProjectLikes } from '@/app/actions/project'

type Props = {
  projectId: string | number
  locale: string
  initialLikes: number
  commentCount: number
}

export default function ProjectEngagementSection({ projectId, locale, initialLikes, commentCount }: Props) {
  const [copied, setCopied] = useState(false)
  const [likes, setLikes] = useState(initialLikes)
  const [likeLoading, setLikeLoading] = useState(false)
  const [hasClapped, setHasClapped] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const clapped = localStorage.getItem(`clapped_project_${projectId}`) === 'true'
      setHasClapped(clapped)
    }
  }, [projectId])

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy URL:', err)
    }
  }

  const handleLike = async () => {
    if (likeLoading || hasClapped) return
    setLikeLoading(true)
    setHasClapped(true)
    setLikes((prev) => prev + 1)
    if (typeof window !== 'undefined') {
      localStorage.setItem(`clapped_project_${projectId}`, 'true')
    }

    try {
      const res = await incrementProjectLikes(projectId, locale)
      if (res.success && res.likes !== undefined) {
        setLikes(res.likes)
      } else {
        setLikes((prev) => prev - 1)
        setHasClapped(false)
        if (typeof window !== 'undefined') {
          localStorage.removeItem(`clapped_project_${projectId}`)
        }
      }
    } catch (err) {
      setLikes((prev) => prev - 1)
      setHasClapped(false)
      if (typeof window !== 'undefined') {
        localStorage.removeItem(`clapped_project_${projectId}`)
      }
    } finally {
      setLikeLoading(false)
    }
  }

  const scrollToComments = () => {
    const el = document.getElementById('discussion')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      {/* Floating Toolbar */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-6 px-6 py-2 bg-background/90 backdrop-blur-md border border-border/80 rounded-full shadow-lg max-w-sm w-[90%] md:w-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
        {/* Likes Button */}
        <button
          onClick={handleLike}
          disabled={likeLoading || hasClapped}
          className={`flex items-center gap-2 text-sm transition-colors py-1.5 px-3 rounded-full border bg-background cursor-pointer ${
            hasClapped
              ? 'text-emerald-600 border-emerald-200 bg-emerald-50 dark:text-emerald-400 dark:border-emerald-950/30'
              : 'text-muted-foreground hover:text-primary hover:bg-accent border-border/80'
          }`}
        >
          <HandsClapping size={18} weight={hasClapped ? 'fill' : 'regular'} className="transition-transform duration-200 active:scale-125" />
          <span className="font-medium font-mono">{likes}</span>
        </button>
        
        {/* Comment trigger */}
        <button
          onClick={scrollToComments}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors py-1.5 px-3 rounded-full hover:bg-accent cursor-pointer"
        >
          <ChatCircleIcon size={18} />
          <span className="font-medium font-mono">{commentCount}</span>
        </button>

        {/* Share Button */}
        <button
          onClick={handleShare}
          className="relative flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors py-1.5 px-3 rounded-full hover:bg-accent cursor-pointer"
        >
          <ShareNetworkIcon size={18} />
          {copied && (
            <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-neutral-900 text-white text-xs px-2.5 py-1 rounded shadow-md whitespace-nowrap animate-bounce">
              Link copied!
            </span>
          )}
        </button>
      </div>

      {/* Inline Toolbar */}
      <div className="flex items-center justify-between py-3.5 border-y border-border/60 my-12">
        <div className="flex items-center gap-4">
          <button
            onClick={handleLike}
            disabled={likeLoading || hasClapped}
            className={`flex items-center gap-2 text-sm transition-colors py-1.5 px-3 rounded-full border bg-background cursor-pointer ${
              hasClapped
                ? 'text-emerald-600 border-emerald-200 bg-emerald-50 dark:text-emerald-400 dark:border-emerald-950/30'
                : 'text-muted-foreground hover:text-primary hover:bg-accent border-border/80'
            }`}
          >
            <HandsClapping size={18} weight={hasClapped ? 'fill' : 'regular'} className="transition-transform duration-200 active:scale-125" />
            <span className="font-medium font-mono">{likes}</span>
          </button>
          
          <button
            onClick={scrollToComments}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors py-1.5 px-3 rounded-full hover:bg-accent cursor-pointer"
          >
            <ChatCircleIcon size={18} />
            <span className="font-medium">{commentCount} Responses</span>
          </button>
        </div>
        
        <button
          onClick={handleShare}
          className="relative p-2 rounded-full hover:bg-accent text-muted-foreground hover:text-foreground cursor-pointer"
        >
          <ShareNetworkIcon size={18} />
          {copied && (
            <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-neutral-950 text-white text-xs px-2.5 py-1 rounded shadow-md whitespace-nowrap animate-bounce">
              Link copied!
            </span>
          )}
        </button>
      </div>
    </>
  )
}
