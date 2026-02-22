import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = (session.user as any).id

  const matches = await prisma.match.findMany({
    where: {
      OR: [
        { userAId: userId },
        { userBId: userId },
      ],
      status: 'active',
    },
    include: {
      userA: { select: { id: true, name: true, avatar: true } },
      userB: { select: { id: true, name: true, avatar: true } },
      propertyA: true,
      propertyB: true,
      messages: {
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
    orderBy: { updatedAt: 'desc' },
  })

  const formatted = matches.map(match => {
    const isUserA = match.userAId === userId
    return {
      id: match.id,
      otherUser: isUserA ? match.userB : match.userA,
      myProperty: {
        ...( isUserA ? match.propertyA : match.propertyB),
        images: JSON.parse(isUserA ? match.propertyA.images : match.propertyB.images),
      },
      otherProperty: {
        ...(isUserA ? match.propertyB : match.propertyA),
        images: JSON.parse(isUserA ? match.propertyB.images : match.propertyA.images),
      },
      lastMessage: match.messages[0] || null,
      createdAt: match.createdAt,
    }
  })

  return NextResponse.json(formatted)
}
