'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Heart, MessageCircle, MapPin, Loader2, Home } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ro } from 'date-fns/locale'

export default function MatchesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [matches, setMatches] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/signin')
  }, [status, router])

  useEffect(() => {
    if (!session) return
    fetch('/api/matches')
      .then(res => res.json())
      .then(data => {
        setMatches(data)
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
      <div className="py-4">
        <h1 className="text-2xl font-bold text-gray-900">Match-uri</h1>
        <p className="text-sm text-gray-500 mt-1">{matches.length} match-uri active</p>
      </div>

      {matches.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-4">
            <Heart className="w-10 h-10 text-red-300" />
          </div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Niciun match inca</h2>
          <p className="text-gray-400 max-w-xs mb-6">
            Continua sa dai swipe pentru a gasi case care iti plac. Cand doi utilizatori se plac reciproc, aveti match!
          </p>
          <Link
            href="/swipe"
            className="gradient-primary text-white px-6 py-3 rounded-xl font-medium hover:opacity-90 transition-opacity"
          >
            Incepe sa dai swipe
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {matches.map(match => (
            <Link
              key={match.id}
              href={`/chat/${match.id}`}
              className="block bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex gap-4">
                {/* Property images */}
                <div className="flex -space-x-3">
                  <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-white shadow-sm">
                    <img
                      src={match.otherProperty.images[0]}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-white shadow-sm">
                    <img
                      src={match.myProperty.images[0]}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {match.otherUser.name}
                    </h3>
                    <span className="text-xs text-gray-400">
                      {formatDistanceToNow(new Date(match.createdAt), { addSuffix: true, locale: ro })}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-500 mt-0.5">
                    <MapPin className="w-3.5 h-3.5" />
                    <span className="truncate">{match.otherProperty.city}, {match.otherProperty.country}</span>
                  </div>
                  <p className="text-sm text-gray-400 mt-1 truncate">
                    {match.lastMessage
                      ? match.lastMessage.content
                      : 'Niciun mesaj inca - spune salut!'}
                  </p>
                </div>

                {/* Chat icon */}
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-red-50 text-red-500 flex items-center justify-center">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
