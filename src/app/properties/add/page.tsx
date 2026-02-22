'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import {
  Home, MapPin, Bed, Bath, Users, Camera, Plus, X,
  ArrowRight, Check, Wifi, Car, Waves, Utensils, Wind,
  Tv, Dog, Dumbbell
} from 'lucide-react'

const amenityOptions = [
  { id: 'wifi', label: 'WiFi', icon: Wifi },
  { id: 'parking', label: 'Parcare', icon: Car },
  { id: 'pool', label: 'Piscina', icon: Waves },
  { id: 'kitchen', label: 'Bucatarie', icon: Utensils },
  { id: 'ac', label: 'Aer conditionat', icon: Wind },
  { id: 'tv', label: 'TV', icon: Tv },
  { id: 'pets', label: 'Animale permise', icon: Dog },
  { id: 'gym', label: 'Sala fitness', icon: Dumbbell },
]

const propertyTypes = [
  { value: 'apartment', label: 'Apartament', emoji: '🏢' },
  { value: 'house', label: 'Casa', emoji: '🏠' },
  { value: 'villa', label: 'Vila', emoji: '🏡' },
  { value: 'studio', label: 'Studio', emoji: '🏬' },
]

const sampleImages = [
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop',
]

export default function AddPropertyPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'apartment',
    address: '',
    city: '',
    country: 'Romania',
    bedrooms: 1,
    bathrooms: 1,
    maxGuests: 2,
    amenities: [] as string[],
    images: [] as string[],
  })

  const toggleAmenity = (id: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(id)
        ? prev.amenities.filter(a => a !== id)
        : [...prev.amenities, id],
    }))
  }

  const toggleImage = (url: string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.includes(url)
        ? prev.images.filter(i => i !== url)
        : [...prev.images, url],
    }))
  }

  const handleSubmit = async () => {
    if (!formData.title || !formData.city) return
    setLoading(true)

    try {
      const res = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          images: formData.images.length > 0 ? formData.images : [sampleImages[0]],
        }),
      })

      if (res.ok) {
        router.push('/swipe')
      }
    } catch (err) {
      console.error('Create property error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto px-4 pb-24 md:pb-8">
      <div className="py-4">
        <h1 className="text-2xl font-bold text-gray-900">Adauga proprietate</h1>
        <p className="text-sm text-gray-500 mt-1">Pasul {step} din 3</p>
      </div>

      {/* Progress bar */}
      <div className="flex gap-2 mb-6">
        {[1, 2, 3].map(s => (
          <div
            key={s}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              s <= step ? 'gradient-primary' : 'bg-gray-200'
            }`}
          />
        ))}
      </div>

      {/* Step 1: Basic Info */}
      {step === 1 && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Titlu</label>
            <input
              type="text"
              value={formData.title}
              onChange={e => setFormData(f => ({ ...f, title: e.target.value }))}
              placeholder="ex: Apartament modern in centrul Bucurestiului"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Descriere</label>
            <textarea
              value={formData.description}
              onChange={e => setFormData(f => ({ ...f, description: e.target.value }))}
              placeholder="Descrie proprietatea ta..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tip proprietate</label>
            <div className="grid grid-cols-2 gap-2">
              {propertyTypes.map(t => (
                <button
                  key={t.value}
                  onClick={() => setFormData(f => ({ ...f, type: t.value }))}
                  className={`px-4 py-3 rounded-xl border-2 text-left transition-all ${
                    formData.type === t.value
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-xl">{t.emoji}</span>
                  <p className="text-sm font-medium mt-1">{t.label}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Oras</label>
              <input
                type="text"
                value={formData.city}
                onChange={e => setFormData(f => ({ ...f, city: e.target.value }))}
                placeholder="Bucuresti"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Tara</label>
              <input
                type="text"
                value={formData.country}
                onChange={e => setFormData(f => ({ ...f, country: e.target.value }))}
                placeholder="Romania"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Adresa</label>
            <input
              type="text"
              value={formData.address}
              onChange={e => setFormData(f => ({ ...f, address: e.target.value }))}
              placeholder="Strada, numar (optional)"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
            />
          </div>

          <button
            onClick={() => setStep(2)}
            disabled={!formData.title || !formData.city}
            className="w-full gradient-primary text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50"
          >
            Continua <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Step 2: Details */}
      {step === 2 && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-5">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                <Bed className="w-4 h-4 inline mr-1" /> Dormitoare
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFormData(f => ({ ...f, bedrooms: Math.max(1, f.bedrooms - 1) }))}
                  className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50"
                >-</button>
                <span className="font-semibold text-lg w-8 text-center">{formData.bedrooms}</span>
                <button
                  onClick={() => setFormData(f => ({ ...f, bedrooms: f.bedrooms + 1 }))}
                  className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50"
                >+</button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                <Bath className="w-4 h-4 inline mr-1" /> Bai
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFormData(f => ({ ...f, bathrooms: Math.max(1, f.bathrooms - 1) }))}
                  className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50"
                >-</button>
                <span className="font-semibold text-lg w-8 text-center">{formData.bathrooms}</span>
                <button
                  onClick={() => setFormData(f => ({ ...f, bathrooms: f.bathrooms + 1 }))}
                  className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50"
                >+</button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                <Users className="w-4 h-4 inline mr-1" /> Oaspeti
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFormData(f => ({ ...f, maxGuests: Math.max(1, f.maxGuests - 1) }))}
                  className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50"
                >-</button>
                <span className="font-semibold text-lg w-8 text-center">{formData.maxGuests}</span>
                <button
                  onClick={() => setFormData(f => ({ ...f, maxGuests: f.maxGuests + 1 }))}
                  className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50"
                >+</button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Facilitati</label>
            <div className="grid grid-cols-2 gap-2">
              {amenityOptions.map(a => (
                <button
                  key={a.id}
                  onClick={() => toggleAmenity(a.id)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all ${
                    formData.amenities.includes(a.id)
                      ? 'border-red-500 bg-red-50 text-red-600'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <a.icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{a.label}</span>
                  {formData.amenities.includes(a.id) && <Check className="w-4 h-4 ml-auto" />}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep(1)}
              className="flex-1 py-3 rounded-xl border border-gray-200 font-medium text-gray-600 hover:bg-gray-50"
            >
              Inapoi
            </button>
            <button
              onClick={() => setStep(3)}
              className="flex-1 gradient-primary text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:opacity-90"
            >
              Continua <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Photos */}
      {step === 3 && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Camera className="w-4 h-4 inline mr-1" /> Selecteaza poze (din galerie demo)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {sampleImages.map(url => (
                <button
                  key={url}
                  onClick={() => toggleImage(url)}
                  className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                    formData.images.includes(url)
                      ? 'border-red-500 ring-2 ring-red-500/20'
                      : 'border-gray-200'
                  }`}
                >
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  {formData.images.includes(url) && (
                    <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center">
                      <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                        <Check className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Selecteaza cel putin o poza. In productie vei putea incarca propriile tale poze.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep(2)}
              className="flex-1 py-3 rounded-xl border border-gray-200 font-medium text-gray-600 hover:bg-gray-50"
            >
              Inapoi
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 gradient-primary text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50"
            >
              {loading ? 'Se salveaza...' : 'Publica proprietatea'}
              {!loading && <Check className="w-5 h-5" />}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
