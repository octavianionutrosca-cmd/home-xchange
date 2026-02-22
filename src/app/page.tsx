'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Home, ArrowRight, Heart, MessageCircle, Globe, Shield, Sparkles } from 'lucide-react'

export default function LandingPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session) router.push('/swipe')
  }, [session, router])

  if (status === 'loading') return null

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
        <div className="max-w-6xl mx-auto px-6 py-20 md:py-32">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-12 h-12 gradient-primary rounded-2xl flex items-center justify-center">
                <Home className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                HomeSwap
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Schimba casa,{' '}
              <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                descopera lumea
              </span>
            </h1>

            <p className="text-lg text-gray-600 mb-8 max-w-lg">
              Gaseste casa perfecta pentru vacanta ta prin swipe. Simplu ca pe Tinder,
              dar pentru case. Cand doi proprietari se plac reciproc - e un match!
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/auth/signup"
                className="gradient-primary text-white px-8 py-4 rounded-2xl font-semibold text-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
              >
                Incepe gratuit
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/auth/signin"
                className="bg-white text-gray-700 px-8 py-4 rounded-2xl font-semibold text-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                Am deja cont
              </Link>
            </div>
          </div>

          {/* Decorative cards */}
          <div className="hidden lg:block absolute right-10 top-20 w-72">
            <div className="relative">
              <div className="w-64 h-80 rounded-3xl overflow-hidden shadow-2xl transform rotate-6">
                <img
                  src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500&h=700&fit=crop"
                  alt=""
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent text-white">
                  <p className="font-bold">Apartament Paris</p>
                  <p className="text-sm text-white/80">2 dormitoare</p>
                </div>
              </div>
              <div className="absolute -bottom-10 -left-16 w-64 h-80 rounded-3xl overflow-hidden shadow-2xl transform -rotate-6">
                <img
                  src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500&h=700&fit=crop"
                  alt=""
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent text-white">
                  <p className="font-bold">Vila Barcelona</p>
                  <p className="text-sm text-white/80">3 dormitoare</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Cum functioneaza?</h2>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Home className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">1. Adauga casa ta</h3>
            <p className="text-gray-500">
              Creeaza un profil pentru proprietatea ta cu poze, descriere si facilitati.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">2. Da swipe</h3>
            <p className="text-gray-500">
              Exploreaza casele altor utilizatori. Swipe dreapta daca iti place, stanga daca nu.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">3. Match & Chat</h3>
            <p className="text-gray-500">
              Cand amandoi dati like, aveti match! Discutati detaliile schimbului prin chat.
            </p>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">De ce HomeSwap?</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Globe, title: 'Destinatii globale', desc: 'Case disponibile in toata lumea, de la Paris la Tokyo.' },
              { icon: Shield, title: 'Sigur si verificat', desc: 'Utilizatori verificati si sistem de review-uri pentru incredere.' },
              { icon: Sparkles, title: 'Gratuit', desc: 'Nicio taxa de intermediere. Schimbul este direct intre proprietari.' },
              { icon: Heart, title: 'Sistem de match', desc: 'Ca pe Tinder - schimbul are loc doar cand ambele parti sunt de acord.' },
              { icon: MessageCircle, title: 'Chat integrat', desc: 'Comunicare directa cu match-urile tale pentru a organiza schimbul.' },
              { icon: Home, title: 'Casa ta, regulile tale', desc: 'Seteaza disponibilitatea, numarul de oaspeti si regulile tale.' },
            ].map((feature, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <feature.icon className="w-8 h-8 text-red-500 mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                <p className="text-sm text-gray-500">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-6xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Gata sa descoperi case noi?
        </h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          Creeaza un cont gratuit si incepe sa explorezi case din toata lumea.
        </p>
        <Link
          href="/auth/signup"
          className="gradient-primary text-white px-8 py-4 rounded-2xl font-semibold text-lg inline-flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          Incepe acum
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 gradient-primary rounded-xl flex items-center justify-center">
              <Home className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
              HomeSwap
            </span>
          </div>
          <p className="text-sm text-gray-400">© 2026 HomeSwap. Toate drepturile rezervate.</p>
        </div>
      </footer>
    </div>
  )
}
