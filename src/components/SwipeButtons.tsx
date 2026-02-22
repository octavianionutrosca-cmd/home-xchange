'use client'

import { X, Heart, RotateCcw, Info } from 'lucide-react'

interface SwipeButtonsProps {
  onSwipe: (direction: 'like' | 'pass') => void
  onUndo?: () => void
  onInfo?: () => void
  canUndo?: boolean
}

export default function SwipeButtons({ onSwipe, onUndo, onInfo, canUndo }: SwipeButtonsProps) {
  return (
    <div className="flex items-center justify-center gap-4 py-6">
      {onUndo && (
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className="w-12 h-12 rounded-full bg-white border-2 border-yellow-400 text-yellow-400 flex items-center justify-center shadow-lg hover:scale-110 transition-transform disabled:opacity-30 disabled:hover:scale-100"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      )}

      <button
        onClick={() => onSwipe('pass')}
        className="w-16 h-16 rounded-full bg-white border-2 border-red-400 text-red-400 flex items-center justify-center shadow-lg hover:scale-110 hover:bg-red-50 transition-all active:scale-95"
      >
        <X className="w-8 h-8" />
      </button>

      {onInfo && (
        <button
          onClick={onInfo}
          className="w-12 h-12 rounded-full bg-white border-2 border-blue-400 text-blue-400 flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
        >
          <Info className="w-5 h-5" />
        </button>
      )}

      <button
        onClick={() => onSwipe('like')}
        className="w-16 h-16 rounded-full bg-white border-2 border-green-400 text-green-400 flex items-center justify-center shadow-lg hover:scale-110 hover:bg-green-50 transition-all active:scale-95"
      >
        <Heart className="w-8 h-8" />
      </button>
    </div>
  )
}
