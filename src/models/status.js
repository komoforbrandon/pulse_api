import { db } from "../db.js";

export async function listUpMonitor() {
  const { rows } = await db.query(
    `SELECT id, name, url, interval_seconds, expected_status, is_active, created_at
      FROM monitors
      WHERE is_active = true
      ORDER BY id ASC`,
  );

  return rows;
}

export async function listActiveIncidents() {
  const { rows } = await db.query(
    `SELECT id, monitor_id,started_at, cause
        FROM incidents 
        WHERE resolved_at IS NULL
        ORDER BY id ASC`,
  );
  return rows;
}
