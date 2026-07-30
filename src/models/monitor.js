import { db } from "../db.js";

export async function create({
  operator_id,
  name,
  url,
  interval_seconds,
  expected_status,
  is_active,
}) {
  try {
    const { rows } = await db.query(
      `INSERT INTO monitors (operator_id, name, url, interval_seconds, expected_status, is_active)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, operator_id, name, url, interval_seconds, expected_status, is_active, created_at`,
      [operator_id,name, url, interval_seconds, expected_status, is_active],
    );
    return rows[0] ?? null;
  } catch (err) {
    if (err.code === "23505") {
      throw new Error("duplicate", { cause: err });
    }
    throw err;
  }
}

export async function list({ after = 0, limit = 20 }) {
  const { rows } = await db.query(
      `SELECT id, name, url, interval_seconds, expected_status, is_active, created_at
      FROM monitors
      WHERE id > $1
      ORDER BY id ASC
      LIMIT $2`,
      [after, limit],
  );
  return rows;
}

export async function listById(id) {
  const { rows } = await db.query(
      `SELECT id, name, url, interval_seconds, expected_status, is_active, created_at
      FROM monitors
      WHERE id = $1`,
      [id],
  );
  return rows[0] ?? null;
}
