'use client'

import { useState } from 'react'
import { SlidersHorizontal, X, Search, MapPin } from 'lucide-react'

interface Filters {
  city: string
  country: string
  minBedrooms: string
  maxGuests: string
  type: string
}

interface FilterBarProps {
  onApply: (filters: Filters) => void
  currentFilters: Filters
}

const propertyTypes = [
  { value: '', label: 'Toate' },
  { value: 'apartment', label: 'Apartament' },
  { value: 'house', label: 'Casa' },
  { value: 'villa', label: 'Vila' },
  { value: 'studio', label: 'Studio' },
]

export default function FilterBar({ onApply, currentFilters }: FilterBarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [filters, setFilters] = useState<Filters>(currentFilters)

  const handleApply = () => {
    onApply(filters)
    setIsOpen(false)
  }

  const handleClear = () => {
    const cleared = { city: '', country: '', minBedrooms: '', maxGuests: '', type: '' }
    setFilters(cleared)
    onApply(cleared)
    setIsOpen(false)
  }

  const activeFilterCount = Object.values(currentFilters).filter(Boolean).length

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all ${
          activeFilterCount > 0
            ? 'border-red-200 bg-red-50 text-red-600'
            : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
        }`}
      >
        <SlidersHorizontal className="w-4 h-4" />
        <span className="text-sm font-medium">Filtre</span>
        {activeFilterCount > 0 && (
          <span className="w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
            {activeFilterCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute top-14 right-0 md:left-0 z-50 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Filtre</h3>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Oras</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={filters.city}
                    onChange={e => setFilters(f => ({ ...f, city: e.target.value }))}
                    placeholder="ex: Paris, Roma..."
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tara</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={filters.country}
                    onChange={e => setFilters(f => ({ ...f, country: e.target.value }))}
                    placeholder="ex: Franta, Italia..."
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tip proprietate</label>
                <div className="flex flex-wrap gap-2">
                  {propertyTypes.map(t => (
                    <button
                      key={t.value}
                      onClick={() => setFilters(f => ({ ...f, type: t.value }))}
                      className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                        filters.type === t.value
                          ? 'bg-red-500 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min. dormitoare</label>
                  <select
                    value={filters.minBedrooms}
                    onChange={e => setFilters(f => ({ ...f, minBedrooms: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                  >
                    <option value="">Oricâte</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                    <option value="4">4+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min. oaspeti</label>
                  <select
                    value={filters.maxGuests}
                    onChange={e => setFilters(f => ({ ...f, maxGuests: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                  >
                    <option value="">Oricâti</option>
                    <option value="2">2+</option>
                    <option value="4">4+</option>
                    <option value="6">6+</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleClear}
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                Sterge tot
              </button>
              <button
                onClick={handleApply}
                className="flex-1 gradient-primary text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:opacity-90"
              >
                Aplica
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
