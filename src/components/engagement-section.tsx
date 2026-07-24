'use client'

import { useState, useEffect } from 'react'
import { incrementLikes } from '@/app/actions/comment'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'
import { Button } from './ui/button'
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from './ui/input-group'
import {
  ChatCircleIcon,
  ShareNetworkIcon,
  HandsClappingIcon,
  ClipboardTextIcon,
  WhatsappLogoIcon,
  InstagramLogoIcon,
  XLogoIcon,
  LinkedinLogoIcon,
  ThreadsLogoIcon,
  CheckIcon,
} from '@phosphor-icons/react/dist/ssr'

type Props = {
  newsId: string | number
  locale: string
  initialLikes: number
  commentCount: number
}

export default function EngagementSection({ newsId, locale, initialLikes, commentCount }: Props) {
  const [copied, setCopied] = useState(false)
  const [likes, setLikes] = useState(initialLikes)
  const [likeLoading, setLikeLoading] = useState(false)
  const [hasClapped, setHasClapped] = useState(false)
  const [shareUrl, setShareUrl] = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setShareUrl(window.location.href)
    }
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const clapped = localStorage.getItem(`clapped_${newsId}`) === 'true'
      setHasClapped(clapped)
    }
  }, [newsId])

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
      localStorage.setItem(`clapped_${newsId}`, 'true')
    }

    try {
      const res = await incrementLikes(newsId, locale)
      if (res.success && res.likes !== undefined) {
        setLikes(res.likes)
      } else {
        setLikes((prev) => prev - 1)
        setHasClapped(false)
        if (typeof window !== 'undefined') {
          localStorage.removeItem(`clapped_${newsId}`)
        }
      }
    } catch (err) {
      setLikes((prev) => prev - 1)
      setHasClapped(false)
      if (typeof window !== 'undefined') {
        localStorage.removeItem(`clapped_${newsId}`)
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
      {/* Inline Toolbar (rendered at the bottom of the article text) */}
      <div className="flex sticky top-20 items-center justify-between py-3.5 rounded-xl bg-background/60 backdrop-blur-sm border-border/60 my-12">
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
            <HandsClappingIcon
              size={18}
              weight={hasClapped ? 'fill' : 'regular'}
              className="transition-transform duration-200 active:scale-125"
            />
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
        <Dialog>
          <DialogTrigger render={<Button variant="ghost" size="icon-lg" />}>
            <ShareNetworkIcon size={18} />
          </DialogTrigger>
          <DialogContent>
            <div className="flex flex-col gap-4">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-foreground">
                  {locale === 'id' ? 'Bagikan Artikel' : 'Share Article'}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {locale === 'id' 
                    ? 'Bagikan artikel ini ke media sosial Anda.' 
                    : 'Share this article with your social network.'}
                </p>
              </div>
      {/* Copy URL Input Group */}
              <div className="space-y-1.5 flex flex-col items-start w-full">
                <InputGroup className="h-9">
                  <InputGroupInput
                    type="text"
                    value={shareUrl}
                    readOnly
                    onClick={(e) => e.currentTarget.select()}
                  />
                  <InputGroupAddon align="inline-end" className="pr-1">
                    <InputGroupButton
                      size="icon-xs"
                      onClick={handleShare}
                      className="transition-colors"
                    >
                      {copied ? (
                        <CheckIcon size={14} className="text-emerald-500" />
                      ) : (
                        <ClipboardTextIcon size={14} />
                      )}
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
              </div>

              {/* Share Buttons Grid */}
              <div className="grid grid-cols-5 gap-3 py-2">
                {/* WhatsApp */}
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center gap-1.5 p-2 rounded-xl border border-border/60 hover:bg-accent hover:text-emerald-500 transition-all cursor-pointer text-muted-foreground"
                >
                  <div className="p-2 rounded-full bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/20">
                    <WhatsappLogoIcon size={18} weight="fill" />
                  </div>
                  <span className="text-[10px] font-medium font-sans">WhatsApp</span>
                </a>

                {/* X */}
                <a
                  href={`https://x.com/intent/tweet?url=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center gap-1.5 p-2 rounded-xl border border-border/60 hover:bg-accent hover:text-foreground transition-all cursor-pointer text-muted-foreground"
                >
                  <div className="p-2 rounded-full bg-foreground/10 text-foreground dark:bg-foreground/20">
                    <XLogoIcon size={18} weight="fill" />
                  </div>
                  <span className="text-[10px] font-medium font-sans">X</span>
                </a>

                {/* LinkedIn */}
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center gap-1.5 p-2 rounded-xl border border-border/60 hover:bg-accent hover:text-blue-600 transition-all cursor-pointer text-muted-foreground"
                >
                  <div className="p-2 rounded-full bg-blue-600/10 text-blue-600 dark:bg-blue-600/20">
                    <LinkedinLogoIcon size={18} weight="fill" />
                  </div>
                  <span className="text-[10px] font-medium font-sans">LinkedIn</span>
                </a>

                {/* Threads */}
                <a
                  href={`https://www.threads.net/intent/post?text=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center gap-1.5 p-2 rounded-xl border border-border/60 hover:bg-accent hover:text-foreground transition-all cursor-pointer text-muted-foreground"
                >
                  <div className="p-2 rounded-full bg-neutral-900/10 text-neutral-900 dark:bg-neutral-100/15 dark:text-neutral-100">
                    <ThreadsLogoIcon size={18} weight="fill" />
                  </div>
                  <span className="text-[10px] font-medium font-sans">Threads</span>
                </a>

                {/* Instagram (Copy Link) */}
                <button
                  onClick={handleShare}
                  className="flex flex-col items-center justify-center gap-1.5 p-2 rounded-xl border border-border/60 hover:bg-accent hover:text-pink-600 transition-all cursor-pointer text-muted-foreground"
                >
                  <div className="p-2 rounded-full bg-pink-600/10 text-pink-600 dark:bg-pink-600/20">
                    <InstagramLogoIcon size={18} weight="fill" />
                  </div>
                  <span className="text-[10px] font-medium font-sans">Instagram</span>
                </button>
              </div>

        
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}
