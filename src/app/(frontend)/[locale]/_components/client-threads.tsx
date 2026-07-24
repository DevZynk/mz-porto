'use client'
import dynamic from 'next/dynamic'

const ThreadsInner = dynamic(() => import('@/components/animation/ogl'), { ssr: false })

export default function ClientThreads(props: {
  amplitude?: number
  distance?: number
  enableMouseInteraction?: boolean
}) {
  return <ThreadsInner {...props} />
}
