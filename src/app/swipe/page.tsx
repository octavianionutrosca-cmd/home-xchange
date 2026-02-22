'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import SwipeCard from '@/components/SwipeCard'
import SwipeButtons from '@/components/SwipeButtons'
import MatchModal from '@/components/MatchModal'
import FilterBar from '@/components/FilterBar'
import { Loader2, Home, RefreshCw } from 'lucide-react'

interface Filters {
  city: string
  country: string
  minBedrooms: string
  maxGuests: string
  type: string
}

export default function SwipePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [properties, setProperties] = useState<any[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [matchData, setMatchData] = useState<any>(null)
  const [showMatch, setShowMatch] = useState(false)
  const [filters, setFilters] = useState<Filters>({
    city: '', country: '', minBedrooms: '', maxGuests: '', type: '',
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  const fetchProperties = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, val]) => {
        if (val) params.set(key, val)
      })
      const res = await fetch(`/api/properties?${params}`)
      const data = await res.json()
      setProperties(data)
      setCurrentIndex(0)
    } catch (err) {
      console.error('Failed to fetch properties:', err)
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    if (session) fetchProperties()
  }, [session, fetchProperties])

  const handleSwipe = async (direction: 'like' | 'pass') => {
    const property = properties[currentIndex]
    if (!property) return

    try {
      const res = await fetch('/api/swipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ propertyId: property.id, direction }),
      })

      const data = await res.json()

      if (data.match) {
        setMatchData(data.match)
        setShowMatch(true)
      }
    } catch (err) {
      console.error('Swipe error:', err)
    }

    setCurrentIndex(prev => prev + 1)
  }

  const handleFilterApply = (newFilters: Filters) => {
    setFilters(newFilters)
  }

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <Loader2 className="w-8 h-8 animate-spin text-red-500" />
      </div>
    )
  }

  const remaining = properties.slice(currentIndex)
  const noMoreProperties = remaining.length === 0

  return (
    <div className="max-w-lg mx-auto px-4 pb-24 md:pb-8">
      {/* Header */}
      <div className="flex items-center justify-between py-4">
        <h1 className="text-2xl font-bold text-gray-900">Descopera</h1>
        <FilterBar onApply={handleFilterApply} currentFilters={filters} />
      </div>

      {/* Cards */}
      <div className="relative h-[65vh] max-h-[600px]">
        {noMoreProperties ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Home className="w-10 h-10 text-gray-300" />
            </div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Nu mai sunt proprietati
            </h2>
            <p className="text-gray-400 mb-6 max-w-xs">
              Ai vazut toate casele disponibile. Incearca sa modifici filtrele sau revino mai tarziu.
            </p>
            <button
              onClick={() => fetchProperties()}
              className="gradient-primary text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 hover:opacity-90 transition-opacity"
            >
              <RefreshCw className="w-5 h-5" />
              Reincarca
            </button>
          </div>
        ) : (
          remaining.slice(0, 3).map((property, i) => (
            <SwipeCard
              key={property.id}
              property={property}
              onSwipe={handleSwipe}
              isTop={i === 0}
            />
          ))
        )}
      </div>

      {/* Buttons */}
      {!noMoreProperties && (
        <SwipeButtons onSwipe={handleSwipe} />
      )}

      {/* Match Modal */}
      <MatchModal
        isOpen={showMatch}
        onClose={() => setShowMatch(false)}
        matchData={matchData}
      />
    </div>
  )
}
