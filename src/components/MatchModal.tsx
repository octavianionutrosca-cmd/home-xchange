'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Heart, MessageCircle, X } from 'lucide-react'
import Link from 'next/link'

interface MatchModalProps {
  isOpen: boolean
  onClose: () => void
  matchData: {
    matchId: string
    otherUser: { name: string; avatar: string | null }
    otherProperty: { title: string; images: string[] }
    myProperty: { title: string; images: string[] }
  } | null
}

export default function MatchModal({ isOpen, onClose, matchData }: MatchModalProps) {
  if (!matchData) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: 'spring', damping: 15 }}
            className="bg-white rounded-3xl p-8 max-w-sm w-full text-center relative"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="w-20 h-20 gradient-primary rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <Heart className="w-10 h-10 text-white fill-white" />
            </motion.div>

            <h2 className="text-3xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent mb-2">
              E un Match!
            </h2>
            <p className="text-gray-500 mb-6">
              Tu si {matchData.otherUser.name} vreti sa faceti schimb de case!
            </p>

            {/* Property previews */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 rounded-xl overflow-hidden h-32">
                <img
                  src={matchData.myProperty.images[0]}
                  alt={matchData.myProperty.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-10 h-10 gradient-primary rounded-full flex items-center justify-center flex-shrink-0">
                <Heart className="w-5 h-5 text-white fill-white" />
              </div>
              <div className="flex-1 rounded-xl overflow-hidden h-32">
                <img
                  src={matchData.otherProperty.images[0]}
                  alt={matchData.otherProperty.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <Link
              href={`/chat/${matchData.matchId}`}
              className="gradient-primary text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
            >
              <MessageCircle className="w-5 h-5" />
              Trimite un mesaj
            </Link>

            <button
              onClick={onClose}
              className="mt-3 text-gray-400 text-sm hover:text-gray-600"
            >
              Continua sa dai swipe
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
