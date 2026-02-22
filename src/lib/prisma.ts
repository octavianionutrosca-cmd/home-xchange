import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

function getDatabaseUrl(): string {
  if (process.env.VERCEL) {
    const tmpDb = '/tmp/dev.db'
    if (!fs.existsSync(tmpDb)) {
      const srcDb = path.join(process.cwd(), 'prisma', 'dev.db')
      if (fs.existsSync(srcDb)) {
        fs.copyFileSync(srcDb, tmpDb)
        const journalSrc = srcDb + '-journal'
        if (fs.existsSync(journalSrc)) {
          fs.copyFileSync(journalSrc, tmpDb + '-journal')
        }
      }
    }
    return 'file:/tmp/dev.db'
  }
  return process.env.DATABASE_URL || 'file:./dev.db'
}

function createPrismaClient(): PrismaClient {
  return new PrismaClient({
    datasources: {
      db: {
        url: getDatabaseUrl(),
      },
    },
  })
}

export const prisma = globalForPrisma.prisma || createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma
