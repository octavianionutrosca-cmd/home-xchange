import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const matchId = searchParams.get('matchId')

  if (!matchId) {
    return NextResponse.json({ error: 'matchId is required' }, { status: 400 })
  }

  const userId = (session.user as any).id

  // Verify user is part of this match
  const match = await prisma.match.findFirst({
    where: {
      id: matchId,
      OR: [{ userAId: userId }, { userBId: userId }],
    },
  })

  if (!match) {
    return NextResponse.json({ error: 'Match not found' }, { status: 404 })
  }

  const messages = await prisma.message.findMany({
    where: { matchId },
    include: {
      sender: { select: { id: true, name: true, avatar: true } },
    },
    orderBy: { createdAt: 'asc' },
  })

  // Mark unread messages as read
  await prisma.message.updateMany({
    where: {
      matchId,
      senderId: { not: userId },
      read: false,
    },
    data: { read: true },
  })

  return NextResponse.json(messages)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { matchId, content } = await req.json()
    const userId = (session.user as any).id

    if (!matchId || !content) {
      return NextResponse.json(
        { error: 'matchId and content are required' },
        { status: 400 }
      )
    }

    // Verify user is part of this match
    const match = await prisma.match.findFirst({
      where: {
        id: matchId,
        OR: [{ userAId: userId }, { userBId: userId }],
      },
    })

    if (!match) {
      return NextResponse.json({ error: 'Match not found' }, { status: 404 })
    }

    const message = await prisma.message.create({
      data: {
        content,
        senderId: userId,
        matchId,
      },
      include: {
        sender: { select: { id: true, name: true, avatar: true } },
      },
    })

    // Update match updatedAt
    await prisma.match.update({
      where: { id: matchId },
      data: { updatedAt: new Date() },
    })

    return NextResponse.json(message)
  } catch (error) {
    console.error('Send message error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
