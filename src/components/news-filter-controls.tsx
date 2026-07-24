'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useTransition, useEffect } from 'react'

type Option = {
  id: string | number
  title: string
}

type Props = {
  categories: Option[]
  services: Option[]
  locale: string
}

export default function NewsFilterControls({ categories, services, locale }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const [q, setQ] = useState(searchParams.get('q') || '')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all')
  const [selectedService, setSelectedService] = useState(searchParams.get('service') || 'all')
  const [selectedSort, setSelectedSort] = useState(searchParams.get('sort') || 'newest')

  // Keep state in sync with URL when back/forward navigation occurs
  useEffect(() => {
    setQ(searchParams.get('q') || '')
    setSelectedCategory(searchParams.get('category') || 'all')
    setSelectedService(searchParams.get('service') || 'all')
    setSelectedSort(searchParams.get('sort') || 'newest')
  }, [searchParams])

  const applyFilters = (newQ = q, newCat = selectedCategory, newServ = selectedService, newSort = selectedSort) => {
    const params = new URLSearchParams()
    if (newQ) params.set('q', newQ)
    if (newCat && newCat !== 'all') params.set('category', newCat)
    if (newServ && newServ !== 'all') params.set('service', newServ)
    if (newSort && newSort !== 'newest') params.set('sort', newSort)

    startTransition(() => {
      router.push(`/${locale}/news?${params.toString()}`)
    })
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    applyFilters()
  }

  return (
    <div className="bg-accent/20 p-5 rounded-2xl border border-border/60 mb-8 space-y-4">
      
      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="flex gap-2">
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={locale === 'id' ? 'Cari judul atau isi artikel...' : 'Search article title or content...'}
          className="flex-1 text-sm bg-background border rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
        />
        <button
          type="submit"
          disabled={isPending}
          className="text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90 px-5 py-2 rounded-lg cursor-pointer transition-opacity"
        >
          {locale === 'id' ? 'Cari' : 'Search'}
        </button>
      </form>

      {/* Dropdowns */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Category Selector */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-muted-foreground">Category</label>
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value)
              applyFilters(q, e.target.value, selectedService, selectedSort)
            }}
            className="text-sm bg-background border border-border rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-primary cursor-pointer"
          >
            <option value="all">{locale === 'id' ? 'Semua Kategori' : 'All Categories'}</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>

        {/* Service Selector */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-muted-foreground">Related Service</label>
          <select
            value={selectedService}
            onChange={(e) => {
              setSelectedService(e.target.value)
              applyFilters(q, selectedCategory, e.target.value, selectedSort)
            }}
            className="text-sm bg-background border border-border rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-primary cursor-pointer"
          >
            <option value="all">{locale === 'id' ? 'Semua Layanan' : 'All Services'}</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Selector */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-muted-foreground">Sort By</label>
          <select
            value={selectedSort}
            onChange={(e) => {
              setSelectedSort(e.target.value)
              applyFilters(q, selectedCategory, selectedService, e.target.value)
            }}
            className="text-sm bg-background border border-border rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-primary cursor-pointer"
          >
            <option value="newest">{locale === 'id' ? 'Terbaru' : 'Newest'}</option>
            <option value="oldest">{locale === 'id' ? 'Terlama' : 'Oldest'}</option>
            <option value="popular">{locale === 'id' ? 'Terpopuler (Claps)' : 'Most Popular (Claps)'}</option>
          </select>
        </div>
      </div>

      {isPending && (
        <p className="text-[10px] text-muted-foreground animate-pulse text-right">
          {locale === 'id' ? 'Memperbarui hasil...' : 'Updating results...'}
        </p>
      )}
    </div>
  )
}
