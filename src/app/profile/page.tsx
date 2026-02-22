'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  User, MapPin, Home, Plus, Settings, LogOut, Loader2,
  Bed, Bath, ChevronRight, Star
} from 'lucide-react'

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [properties, setProperties] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/signin')
  }, [status, router])

  useEffect(() => {
    if (!session) return
    fetch('/api/properties/my')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setProperties(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [session])

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <Loader2 className="w-8 h-8 animate-spin text-red-500" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 pb-24 md:pb-8">
      {/* Profile header */}
      <div className="bg-white rounded-2xl p-6 mt-4 shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
            {session?.user?.image ? (
              <img src={session.user.image} alt="" className="w-full h-full object-cover" />
            ) : (
              <User className="w-10 h-10 text-gray-400" />
            )}
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{session?.user?.name}</h1>
            <p className="text-sm text-gray-500">{session?.user?.email}</p>
          </div>
        </div>
      </div>

      {/* My properties */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Proprietatile mele</h2>
          <Link
            href="/properties/add"
            className="gradient-primary text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-1.5 hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            Adauga
          </Link>
        </div>

        {properties.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Home className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="font-semibold text-gray-700 mb-1">Nicio proprietate inca</h3>
            <p className="text-sm text-gray-400 mb-4">
              Adauga prima ta proprietate pentru a incepe sa faci schimburi.
            </p>
            <Link
              href="/properties/add"
              className="gradient-primary text-white px-6 py-2.5 rounded-xl text-sm font-medium inline-flex items-center gap-2 hover:opacity-90"
            >
              <Plus className="w-4 h-4" />
              Adauga proprietate
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {properties.map(property => (
              <div
                key={property.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex"
              >
                <div className="w-28 h-28 flex-shrink-0">
                  <img
                    src={JSON.parse(property.images)[0]}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 p-3">
                  <h3 className="font-semibold text-gray-900 text-sm">{property.title}</h3>
                  <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                    <MapPin className="w-3 h-3" />
                    {property.city}, {property.country}
                  </div>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Bed className="w-3 h-3" /> {property.bedrooms}
                    </span>
                    <span className="flex items-center gap-1">
                      <Bath className="w-3 h-3" /> {property.bathrooms}
                    </span>
                    {property.rating > 0 && (
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-400" /> {property.rating}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="w-full px-4 py-3.5 text-left text-sm text-red-500 hover:bg-red-50 flex items-center gap-3 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Deconectare
        </button>
      </div>
    </div>
  )
}
