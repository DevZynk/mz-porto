'use client'

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="text-center space-y-4 px-6">
        <p className="text-muted-foreground">Failed to load projects</p>
        <button
          onClick={reset}
          className="text-sm font-semibold text-primary underline cursor-pointer"
        >
          Try again
        </button>
      </div>
    </div>
  )
}
