'use client'

import { useState, useRef } from 'react'
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion'
import { MapPin, Bed, Bath, Users, ChevronLeft, ChevronRight, Star } from 'lucide-react'

interface Property {
  id: string
  title: string
  description: string
  type: string
  city: string
  country: string
  bedrooms: number
  bathrooms: number
  maxGuests: number
  amenities: string[]
  images: string[]
  rating: number
  reviewCount: number
  user: {
    name: string
    avatar: string | null
  }
}

interface SwipeCardProps {
  property: Property
  onSwipe: (direction: 'like' | 'pass') => void
  isTop: boolean
}

export default function SwipeCard({ property, onSwipe, isTop }: SwipeCardProps) {
  const [currentImage, setCurrentImage] = useState(0)
  const [exitDirection, setExitDirection] = useState<'left' | 'right' | null>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  const x = useMotionValue(0)
  const rotate = useTransform(x, [-300, 0, 300], [-25, 0, 25])
  const likeOpacity = useTransform(x, [0, 100], [0, 1])
  const nopeOpacity = useTransform(x, [-100, 0], [1, 0])

  const handleDragEnd = (_: any, info: PanInfo) => {
    const threshold = 120
    if (info.offset.x > threshold) {
      setExitDirection('right')
      onSwipe('like')
    } else if (info.offset.x < -threshold) {
      setExitDirection('left')
      onSwipe('pass')
    }
  }

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentImage(prev => (prev + 1) % property.images.length)
  }

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentImage(prev => (prev - 1 + property.images.length) % property.images.length)
  }

  if (!isTop) {
    return (
      <div className="absolute inset-0 rounded-3xl overflow-hidden card-shadow scale-[0.95] opacity-60">
        <div
          className="w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${property.images[0]})` }}
        />
      </div>
    )
  }

  return (
    <motion.div
      ref={cardRef}
      className="absolute inset-0 rounded-3xl overflow-hidden card-shadow cursor-grab active:cursor-grabbing swipe-card"
      style={{ x, rotate }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9}
      onDragEnd={handleDragEnd}
      animate={
        exitDirection === 'right'
          ? { x: 500, rotate: 30, opacity: 0 }
          : exitDirection === 'left'
          ? { x: -500, rotate: -30, opacity: 0 }
          : {}
      }
      transition={{ duration: 0.4 }}
    >
      {/* Image */}
      <div className="relative w-full h-full">
        <div
          className="w-full h-full bg-cover bg-center transition-all duration-300"
          style={{ backgroundImage: `url(${property.images[currentImage]})` }}
        />

        {/* Image navigation dots */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {property.images.map((_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full transition-all ${
                i === currentImage ? 'w-6 bg-white' : 'w-1.5 bg-white/50'
              }`}
            />
          ))}
        </div>

        {/* Image navigation arrows */}
        {property.images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/20 text-white flex items-center justify-center hover:bg-black/40 transition-colors z-10"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/20 text-white flex items-center justify-center hover:bg-black/40 transition-colors z-10"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Like / Nope badges */}
        <motion.div
          className="badge-like"
          style={{ opacity: likeOpacity }}
        >
          LIKE
        </motion.div>
        <motion.div
          className="badge-nope"
          style={{ opacity: nopeOpacity }}
        >
          NOPE
        </motion.div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Property info */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          {/* Owner info */}
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-white/20 overflow-hidden">
              {property.user.avatar && (
                <img src={property.user.avatar} alt="" className="w-full h-full object-cover" />
              )}
            </div>
            <span className="text-sm text-white/80">{property.user.name}</span>
            {property.rating > 0 && (
              <div className="flex items-center gap-1 ml-auto bg-white/20 px-2 py-0.5 rounded-lg">
                <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                <span className="text-sm">{property.rating.toFixed(1)}</span>
              </div>
            )}
          </div>

          <h2 className="text-2xl font-bold mb-1">{property.title}</h2>

          <div className="flex items-center gap-1 text-white/80 mb-3">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{property.city}, {property.country}</span>
          </div>

          <p className="text-sm text-white/70 line-clamp-2 mb-4">{property.description}</p>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 bg-white/15 px-3 py-1.5 rounded-lg">
              <Bed className="w-4 h-4" />
              <span className="text-sm">{property.bedrooms} dormitoare</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/15 px-3 py-1.5 rounded-lg">
              <Bath className="w-4 h-4" />
              <span className="text-sm">{property.bathrooms} bai</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/15 px-3 py-1.5 rounded-lg">
              <Users className="w-4 h-4" />
              <span className="text-sm">{property.maxGuests} oaspeti</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
