import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { propertyId, direction } = await req.json()
    const userId = (session.user as any).id

    if (!propertyId || !direction) {
      return NextResponse.json(
        { error: 'propertyId and direction are required' },
        { status: 400 }
      )
    }

    // Get the property and its owner
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      include: { user: true },
    })

    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 })
    }

    // Create swipe
    const swipe = await prisma.swipe.create({
      data: {
        userId,
        targetUserId: property.userId,
        propertyId,
        direction,
      },
    })

    // Check for match: did the other user also like one of my properties?
    let match = null
    if (direction === 'like') {
      // Get my properties
      const myProperties = await prisma.property.findMany({
        where: { userId },
        select: { id: true },
      })
      const myPropertyIds = myProperties.map(p => p.id)

      // Check if the property owner liked any of my properties
      const reciprocalSwipe = await prisma.swipe.findFirst({
        where: {
          userId: property.userId,
          propertyId: { in: myPropertyIds },
          direction: 'like',
        },
      })

      if (reciprocalSwipe) {
        // Check if match already exists
        const existingMatch = await prisma.match.findFirst({
          where: {
            OR: [
              { userAId: userId, userBId: property.userId },
              { userAId: property.userId, userBId: userId },
            ],
          },
        })

        if (!existingMatch) {
          match = await prisma.match.create({
            data: {
              userAId: userId,
              userBId: property.userId,
              propertyAId: reciprocalSwipe.propertyId,
              propertyBId: propertyId,
            },
            include: {
              userA: { select: { name: true, avatar: true } },
              userB: { select: { name: true, avatar: true } },
              propertyA: true,
              propertyB: true,
            },
          })
        }
      }
    }

    const result: any = { swipe }

    if (match) {
      const isUserA = match.userAId === userId
      result.match = {
        matchId: match.id,
        otherUser: isUserA
          ? { name: match.userB.name, avatar: match.userB.avatar }
          : { name: match.userA.name, avatar: match.userA.avatar },
        otherProperty: {
          title: isUserA ? match.propertyB.title : match.propertyA.title,
          images: JSON.parse(isUserA ? match.propertyB.images : match.propertyA.images),
        },
        myProperty: {
          title: isUserA ? match.propertyA.title : match.propertyB.title,
          images: JSON.parse(isUserA ? match.propertyA.images : match.propertyB.images),
        },
      }
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Swipe error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
