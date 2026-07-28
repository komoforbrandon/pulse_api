import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { db } from '../src/db.js'

const seedPath = fileURLToPath(new URL('../db/seed.sql', import.meta.url))
const schemaPath = fileURLToPath(new URL('../db/schema.sql', import.meta.url))

const seed = readFileSync(seedPath, 'utf-8')
const schema = readFileSync(schemaPath, 'utf8')

await db.query(schema)
await db.query(seed)

console.log("✅ Database reset(dropped, recreated, and seeded).");

await db.end();