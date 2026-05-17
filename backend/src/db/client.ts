import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../generated/prisma/client.js'
import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const { Pool } = pg

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 30000, // 30 seconds wait for connection
  max: 5, // Limit connections to prevent Postgres free tier pool exhaustion
  idleTimeoutMillis: 10000, // Close idle connections after 10s
})

const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

export default prisma