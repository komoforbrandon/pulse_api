import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { db } from '../src/db.js'

const seedPath = fileURLToPath(new URL('../db/seed.sql', import.meta.url))
const seed = readFileSync(seedPath, 'utf-8')

await db.query(seed)

console.log('✅ Database seeded.')

await db.end();