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
  const city = searchParams.get('city')
  const country = searchParams.get('country')
  const minBedrooms = searchParams.get('minBedrooms')
  const maxGuests = searchParams.get('maxGuests')
  const type = searchParams.get('type')

  // Get IDs of properties user already swiped on
  const swipedPropertyIds = await prisma.swipe.findMany({
    where: { userId: (session.user as any).id },
    select: { propertyId: true },
  })

  const excludeIds = swipedPropertyIds.map(s => s.propertyId)

  const properties = await prisma.property.findMany({
    where: {
      userId: { not: (session.user as any).id },
      isActive: true,
      id: { notIn: excludeIds },
      ...(city && { city: { contains: city } }),
      ...(country && { country: { contains: country } }),
      ...(minBedrooms && { bedrooms: { gte: parseInt(minBedrooms) } }),
      ...(maxGuests && { maxGuests: { gte: parseInt(maxGuests) } }),
      ...(type && { type }),
    },
    include: {
      user: { select: { name: true, avatar: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 20,
  })

  const formatted = properties.map(p => ({
    ...p,
    amenities: JSON.parse(p.amenities),
    images: JSON.parse(p.images),
  }))

  return NextResponse.json(formatted)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const {
      title, description, type, address, city, country,
      bedrooms, bathrooms, maxGuests, amenities, images,
    } = body

    if (!title || !city || !country) {
      return NextResponse.json(
        { error: 'Title, city and country are required' },
        { status: 400 }
      )
    }

    const property = await prisma.property.create({
      data: {
        title,
        description: description || '',
        type: type || 'apartment',
        address: address || '',
        city,
        country,
        bedrooms: bedrooms || 1,
        bathrooms: bathrooms || 1,
        maxGuests: maxGuests || 2,
        amenities: JSON.stringify(amenities || []),
        images: JSON.stringify(images || []),
        userId: (session.user as any).id,
      },
    })

    return NextResponse.json(property)
  } catch (error) {
    console.error('Create property error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
