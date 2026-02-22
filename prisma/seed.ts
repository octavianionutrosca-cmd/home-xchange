import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const users = [
  { name: 'Maria Ionescu', email: 'maria@demo.com', password: 'demo123', location: 'Bucuresti, Romania' },
  { name: 'Jean Dupont', email: 'jean@demo.com', password: 'demo123', location: 'Paris, Franta' },
  { name: 'Sofia Garcia', email: 'sofia@demo.com', password: 'demo123', location: 'Barcelona, Spania' },
  { name: 'Marco Rossi', email: 'marco@demo.com', password: 'demo123', location: 'Roma, Italia' },
  { name: 'Emma Schmidt', email: 'emma@demo.com', password: 'demo123', location: 'Berlin, Germania' },
  { name: 'Alex Popescu', email: 'alex@demo.com', password: 'demo123', location: 'Cluj-Napoca, Romania' },
]

const properties = [
  {
    title: 'Apartament modern in centrul Bucurestiului',
    description: 'Apartament spatios cu 2 dormitoare, complet mobilat, la 5 minute de metrou. Vedere panoramica asupra orasului.',
    type: 'apartment',
    address: 'Bd. Unirii 45',
    city: 'Bucuresti',
    country: 'Romania',
    bedrooms: 2,
    bathrooms: 1,
    maxGuests: 4,
    amenities: JSON.stringify(['wifi', 'ac', 'tv', 'kitchen']),
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop',
    ]),
    rating: 4.8,
    reviewCount: 12,
    userIndex: 0,
  },
  {
    title: 'Loft artistic in Montmartre',
    description: 'Loft fermecator cu vedere la Sacré-Coeur. Decorat cu stil artistic, perfect pentru cupluri romantice.',
    type: 'apartment',
    address: 'Rue Lepic 23',
    city: 'Paris',
    country: 'Franta',
    bedrooms: 1,
    bathrooms: 1,
    maxGuests: 2,
    amenities: JSON.stringify(['wifi', 'kitchen', 'tv']),
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800&h=600&fit=crop',
    ]),
    rating: 4.9,
    reviewCount: 24,
    userIndex: 1,
  },
  {
    title: 'Vila cu piscina in Barcelona',
    description: 'Vila superba cu piscina privata si gradina tropicala. La 10 minute de plaja. Ideala pentru familii.',
    type: 'villa',
    address: 'Carrer de Mallorca 120',
    city: 'Barcelona',
    country: 'Spania',
    bedrooms: 4,
    bathrooms: 3,
    maxGuests: 8,
    amenities: JSON.stringify(['wifi', 'pool', 'parking', 'kitchen', 'ac', 'tv', 'pets']),
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
    ]),
    rating: 4.7,
    reviewCount: 18,
    userIndex: 2,
  },
  {
    title: 'Penthouse cu terasa in Roma',
    description: 'Penthouse elegant cu terasa privata si vedere la Colosseum. Loc perfect pentru a descoperi Roma.',
    type: 'apartment',
    address: 'Via del Corso 88',
    city: 'Roma',
    country: 'Italia',
    bedrooms: 3,
    bathrooms: 2,
    maxGuests: 6,
    amenities: JSON.stringify(['wifi', 'ac', 'tv', 'kitchen', 'parking']),
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600566753086-00f18f6b6637?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop',
    ]),
    rating: 4.6,
    reviewCount: 9,
    userIndex: 3,
  },
  {
    title: 'Loft industrial in Berlin',
    description: 'Loft industrial convertit cu tavane inalte si peretii din caramida aparenta. In inima Kreuzberg.',
    type: 'apartment',
    address: 'Oranienstraße 34',
    city: 'Berlin',
    country: 'Germania',
    bedrooms: 2,
    bathrooms: 1,
    maxGuests: 4,
    amenities: JSON.stringify(['wifi', 'kitchen', 'tv', 'gym']),
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&h=600&fit=crop',
    ]),
    rating: 4.5,
    reviewCount: 15,
    userIndex: 4,
  },
  {
    title: 'Casa traditionala in Cluj-Napoca',
    description: 'Casa renovata in centrul istoric, cu gradina interioara. Aproape de toate atractiile turistice.',
    type: 'house',
    address: 'Str. Memorandumului 12',
    city: 'Cluj-Napoca',
    country: 'Romania',
    bedrooms: 3,
    bathrooms: 2,
    maxGuests: 6,
    amenities: JSON.stringify(['wifi', 'parking', 'kitchen', 'tv', 'pets']),
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop',
    ]),
    rating: 4.4,
    reviewCount: 7,
    userIndex: 5,
  },
  {
    title: 'Studio cozy langa Tour Eiffel',
    description: 'Studio compact dar elegant, la doar 5 minute de Turnul Eiffel. Perfect pentru city break romantic.',
    type: 'studio',
    address: 'Avenue de la Bourdonnais 15',
    city: 'Paris',
    country: 'Franta',
    bedrooms: 1,
    bathrooms: 1,
    maxGuests: 2,
    amenities: JSON.stringify(['wifi', 'ac', 'tv', 'kitchen']),
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop',
    ]),
    rating: 4.3,
    reviewCount: 31,
    userIndex: 1,
  },
  {
    title: 'Vila cu gradina in Toscana',
    description: 'Vila idilica inconjurata de dealuri, cu gradina de lavanda si piscina. Experienta toscana autentica.',
    type: 'villa',
    address: 'Via delle Rose 5',
    city: 'Florenta',
    country: 'Italia',
    bedrooms: 5,
    bathrooms: 3,
    maxGuests: 10,
    amenities: JSON.stringify(['wifi', 'pool', 'parking', 'kitchen', 'ac', 'tv', 'pets', 'gym']),
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
    ]),
    rating: 5.0,
    reviewCount: 42,
    userIndex: 3,
  },
]

async function main() {
  console.log('Seeding database...')

  // Clean existing data
  await prisma.message.deleteMany()
  await prisma.match.deleteMany()
  await prisma.swipe.deleteMany()
  await prisma.availability.deleteMany()
  await prisma.review.deleteMany()
  await prisma.property.deleteMany()
  await prisma.user.deleteMany()

  // Create users
  const createdUsers = []
  for (const u of users) {
    const hashedPassword = await bcrypt.hash(u.password, 12)
    const user = await prisma.user.create({
      data: {
        name: u.name,
        email: u.email,
        password: hashedPassword,
        location: u.location,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(u.name)}`,
      },
    })
    createdUsers.push(user)
    console.log(`  Created user: ${user.name}`)
  }

  // Create properties
  for (const p of properties) {
    const { userIndex, ...data } = p
    const property = await prisma.property.create({
      data: {
        ...data,
        userId: createdUsers[userIndex].id,
      },
    })

    // Add some availability
    await prisma.availability.create({
      data: {
        propertyId: property.id,
        startDate: new Date('2026-03-01'),
        endDate: new Date('2026-04-30'),
      },
    })
    await prisma.availability.create({
      data: {
        propertyId: property.id,
        startDate: new Date('2026-07-01'),
        endDate: new Date('2026-08-31'),
      },
    })

    console.log(`  Created property: ${property.title}`)
  }

  // Create some mutual swipes (for demo matches)
  // Maria likes Jean's property, Jean likes Maria's property -> Match!
  const mariaProperty = await prisma.property.findFirst({ where: { userId: createdUsers[0].id } })
  const jeanProperty = await prisma.property.findFirst({ where: { userId: createdUsers[1].id } })

  if (mariaProperty && jeanProperty) {
    await prisma.swipe.create({
      data: {
        userId: createdUsers[0].id,
        targetUserId: createdUsers[1].id,
        propertyId: jeanProperty.id,
        direction: 'like',
      },
    })
    await prisma.swipe.create({
      data: {
        userId: createdUsers[1].id,
        targetUserId: createdUsers[0].id,
        propertyId: mariaProperty.id,
        direction: 'like',
      },
    })

    const match = await prisma.match.create({
      data: {
        userAId: createdUsers[0].id,
        userBId: createdUsers[1].id,
        propertyAId: mariaProperty.id,
        propertyBId: jeanProperty.id,
      },
    })

    // Add demo messages
    await prisma.message.createMany({
      data: [
        { matchId: match.id, senderId: createdUsers[1].id, content: 'Salut Maria! Imi place foarte mult apartamentul tau din Bucuresti. Cand ar fi disponibil?' },
        { matchId: match.id, senderId: createdUsers[0].id, content: 'Salut Jean! Mersi! E disponibil in martie si aprilie. Loft-ul tau din Paris arata superb!' },
        { matchId: match.id, senderId: createdUsers[1].id, content: 'Perfect! Eu as fi disponibil in martie. Putem face schimb 2 saptamani?' },
      ],
    })

    console.log('  Created demo match: Maria <-> Jean')
  }

  console.log('\nSeeding complete!')
  console.log('\nDemo accounts (password: demo123):')
  users.forEach(u => console.log(`  ${u.email}`))
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
