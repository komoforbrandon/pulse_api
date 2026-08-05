import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { db } from '../src/db.js'

const schemaPath = fileURLToPath(new URL('../db/schema.sql', import.meta.url))
const schema = readFileSync(schemaPath, 'utf8')

await db.query(schema)

console.log('✅ Migration complete (tables are ready).');

await db.end();