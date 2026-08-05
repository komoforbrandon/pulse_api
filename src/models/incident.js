import { db } from "../db.js";

export async function list({ after = 1, limit = 20 }) {
  const { rows } = await db.query(
    `SELECT id, monitor_id,started_at, resolved_at, cause
        FROM incidents WHERE id > $1 ORDER BY id ASC LIMIT $2`,
    [after, limit],
  );

  return rows;
}

export async function listMonitorIncidents({monitor_id, after=1, limit=20}){
    const { rows } = await db.query(
        `SELECT id, monitor_id,started_at, resolved_at, cause
        FROM incidents 
        WHERE monitor_id =$1 AND id > $2 
        ORDER BY id ASC 
        LIMIT $3`,
        [monitor_id, after, limit]
    )

  return rows;
}