import { cn } from '@/lib/utils'
import React from 'react'

export default function Container({ id, children, className }: { id: string, children: React.ReactNode, className?: string }) {
  return (
    <div id={id} className={cn("w-full mx-auto px-4 md:px-6", className)}>
      {children}
    </div>
  )
}
