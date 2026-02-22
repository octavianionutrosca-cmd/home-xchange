'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Send, Loader2, Home } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'

interface Message {
  id: string
  content: string
  createdAt: string
  sender: { id: string; name: string; avatar: string | null }
}

export default function ChatRoomPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const matchId = params.matchId as string

  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [matchInfo, setMatchInfo] = useState<any>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/signin')
  }, [status, router])

  // Load match info
  useEffect(() => {
    if (!session) return
    fetch('/api/matches')
      .then(res => res.json())
      .then(data => {
        const match = data.find((m: any) => m.id === matchId)
        if (match) setMatchInfo(match)
      })
  }, [session, matchId])

  // Load messages
  useEffect(() => {
    if (!session) return
    const loadMessages = () => {
      fetch(`/api/messages?matchId=${matchId}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setMessages(data)
          setLoading(false)
        })
        .catch(() => setLoading(false))
    }
    loadMessages()
    const interval = setInterval(loadMessages, 3000) // Poll every 3 seconds
    return () => clearInterval(interval)
  }, [session, matchId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || sending) return

    setSending(true)
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matchId, content: newMessage.trim() }),
      })
      const msg = await res.json()
      if (msg.id) {
        setMessages(prev => [...prev, msg])
        setNewMessage('')
      }
    } catch (err) {
      console.error('Send error:', err)
    } finally {
      setSending(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <Loader2 className="w-8 h-8 animate-spin text-red-500" />
      </div>
    )
  }

  const userId = (session?.user as any)?.id

  return (
    <div className="max-w-2xl mx-auto flex flex-col h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)]">
      {/* Chat header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 bg-white">
        <Link href="/matches" className="text-gray-400 hover:text-gray-600">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        {matchInfo && (
          <>
            <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
              {matchInfo.otherUser.avatar && (
                <img src={matchInfo.otherUser.avatar} alt="" className="w-full h-full object-cover" />
              )}
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">{matchInfo.otherUser.name}</h2>
              <p className="text-xs text-gray-400">
                {matchInfo.otherProperty.city} — {matchInfo.otherProperty.title}
              </p>
            </div>
          </>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scrollbar-hide">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-3">
              <Home className="w-8 h-8 text-red-300" />
            </div>
            <p className="text-gray-400 text-sm">
              Incepe conversatia! Vorbiti despre schimbul de case.
            </p>
          </div>
        )}

        {messages.map(msg => {
          const isMe = msg.sender.id === userId
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] ${isMe ? 'order-2' : 'order-1'}`}>
                <div
                  className={`px-4 py-2.5 rounded-2xl ${
                    isMe
                      ? 'bg-red-500 text-white rounded-br-md'
                      : 'bg-gray-100 text-gray-900 rounded-bl-md'
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                </div>
                <p className={`text-[10px] text-gray-400 mt-1 ${isMe ? 'text-right' : 'text-left'}`}>
                  {format(new Date(msg.createdAt), 'HH:mm')}
                </p>
              </div>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSend}
        className="px-4 py-3 border-t border-gray-100 bg-white mb-16 md:mb-0"
      >
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            placeholder="Scrie un mesaj..."
            className="flex-1 px-4 py-3 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20"
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || sending}
            className="w-11 h-11 gradient-primary rounded-xl flex items-center justify-center text-white hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  )
}
