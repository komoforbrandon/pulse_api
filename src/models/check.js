import { db } from "../db.js";
import QueryStream from 'pg-query-stream';

export async function check({ monitor_id, after = 0, limit = 20 }) {
  const cursor = (after === 0 || !after) ? 2147483647 : after;

  const { rows } = await db.query(
    `SELECT id, monitor_id, checked_at, ok, status_code
        FROM checks
        WHERE monitor_id = $1 AND id < $2
        ORDER BY id DESC
        LIMIT $3`,
    [monitor_id, cursor, limit],
  );
  return rows;
}
