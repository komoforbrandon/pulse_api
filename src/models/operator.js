import { db } from "../db.js";

export async function create({email, password_hash}) {
  try {
     const {rows} = await db.query(
     `INSERT INTO operators (email, password_hash)
     VALUES ($1, $2)
     RETURNING id, email, created_at`,
     [email, password_hash],
     );
     return rows[0];
  } catch(err) {
    if (err.code === '23505') {
      throw new Error('duplicate', {cause: err});
    }
    throw err;
  }
}

export async function findByEmail(email) {
  const { rows } = await db.query(
    `SELECT id, email, password_hash, created_at FROM operators WHERE email = $1`,
    [email],
  );
  return rows[0] ?? null;
}