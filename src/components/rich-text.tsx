import React from 'react'
import { ImageBox } from '@inoo-ch/payload-image-optimizer/client'

type LexicalNode = {
  type: string
  version: number
  children?: LexicalNode[]
  text?: string
  tag?: string
  listType?: 'bullet' | 'number'
  format?: number
  style?: string
  mode?: string
  value?: any
  fields?: any
}

function getVideoEmbedUrl(url: string): string | null {
  if (!url) return null

  // YouTube
  const ytMatch = url.match(
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/,
  )
  if (ytMatch) {
    return `https://www.youtube.com/embed/${ytMatch[1]}`
  }

  // Vimeo
  const vimeoMatch = url.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/)
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`
  }

  // General URL
  if (url.includes('embed') || url.includes('player.vimeo')) {
    return url
  }

  return null
}

function renderTextNode(node: LexicalNode, key: React.Key) {
  let text = node.text || ''
  if (!text) return null

  const format = node.format || 0
  const isBold = (format & 1) === 1
  const isItalic = (format & 2) === 2
  const isStrikethrough = (format & 4) === 4
  const isUnderline = (format & 8) === 8
  const isCode = (format & 16) === 16

  let element: React.ReactNode = text

  if (isBold) element = <strong>{element}</strong>
  if (isItalic) element = <em>{element}</em>
  if (isStrikethrough) element = <span className="line-through">{element}</span>
  if (isUnderline) element = <span className="underline">{element}</span>
  if (isCode)
    element = <code className="px-1.5 py-0.5 rounded bg-muted font-mono text-sm">{element}</code>

  return <React.Fragment key={key}>{element}</React.Fragment>
}

function renderNode(node: LexicalNode, index: number): React.ReactNode {
  if (node.type === 'text') {
    return renderTextNode(node, index)
  }

  const children = node.children ? node.children.map((child, i) => renderNode(child, i)) : null

  switch (node.type) {
    case 'paragraph':
      return (
        <p
          key={index}
          className="mb-6 font-serif text-[19px] leading-[32px] md:text-[20px] md:leading-[32px] text-neutral-800 dark:text-neutral-200 antialiased"
        >
          {children}
        </p>
      )
    case 'heading':
      const Tag = (node.tag || 'h2') as keyof React.JSX.IntrinsicElements
      let headingClass =
        'font-sans font-bold tracking-tight text-neutral-900 dark:text-neutral-50 mb-4 mt-8'
      if (node.tag === 'h1') headingClass += ' text-3xl md:text-4xl'
      else if (node.tag === 'h2') headingClass += ' text-2xl md:text-3xl'
      else if (node.tag === 'h3') headingClass += ' text-xl md:text-2xl'
      else headingClass += ' text-lg'

      return (
        <Tag key={index} className={headingClass}>
          {children}
        </Tag>
      )
    case 'quote':
      return (
        <blockquote
          key={index}
          className="border-l-3 border-neutral-900 dark:border-neutral-100 pl-5 font-serif italic text-xl md:text-2xl text-neutral-600 dark:text-neutral-300 my-8"
        >
          {children}
        </blockquote>
      )
    case 'list':
      if (node.listType === 'number') {
        return (
          <ol
            key={index}
            className="list-decimal pl-6 mb-6 space-y-2 font-serif text-[19px] leading-[32px] text-neutral-800 dark:text-neutral-200"
          >
            {children}
          </ol>
        )
      }
      return (
        <ul
          key={index}
          className="list-disc pl-6 mb-6 space-y-2 font-serif text-[19px] leading-[32px] text-neutral-800 dark:text-neutral-200"
        >
          {children}
        </ul>
      )
    case 'listitem':
      return (
        <li key={index} className="pl-1">
          {children}
        </li>
      )
    case 'code':
      return (
        <pre
          key={index}
          className="bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/80 dark:border-neutral-800 rounded-lg p-5 font-mono text-sm text-neutral-800 dark:text-neutral-200 my-6 overflow-x-auto leading-relaxed"
        >
          <code>{children}</code>
        </pre>
      )
    case 'upload':
      const uploadValue = node.value
      if (!uploadValue || !uploadValue.url) return null
      return (
        <div
          key={index}
          className="my-8 relative w-full aspect-video rounded-xl overflow-hidden border bg-muted"
        >
          <ImageBox
            unoptimized
            media={uploadValue.url}
            alt={uploadValue.alt || ''}
            fill
            sizes="(max-width: 1200px) 100vw, 800px"
            className="object-cover"
          />
        </div>
      )
    case 'block':
      const blockFields = node.fields
      if (!blockFields) return null

      if (blockFields.blockType === 'Code') {
        const codeText = blockFields.code || ''
        const language = blockFields.language || 'text'
        return (
          <pre
            key={index}
            className="bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/80 dark:border-neutral-800 rounded-lg p-5 font-mono text-sm text-neutral-800 dark:text-neutral-200 my-6 overflow-x-auto leading-relaxed"
          >
            <code className={`language-${language}`}>{codeText}</code>
          </pre>
        )
      }

      if (blockFields.blockType === 'VideoEmbed') {
        const embedUrl = getVideoEmbedUrl(blockFields.url || '')
        if (!embedUrl) return null
        return (
          <div
            key={index}
            className="my-8 w-full aspect-video rounded-xl overflow-hidden border bg-muted shadow-sm"
          >
            <iframe
              src={embedUrl}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        )
      }

      return null
    default:
      return children
  }
}

export default function RichText({ content }: { content: any }) {
  if (!content || !content.root || !content.root.children) return null

  return (
    <div className="prose prose-stone dark:prose-invert max-w-none">
      {content.root.children.map((child: LexicalNode, index: number) => renderNode(child, index))}
    </div>
  )
}
