import { db } from "../db.js";
import { logger } from "../lib/logger.js";

export async function schedulerModel() {
  const { rows } = await db.query(
    `SELECT m.id, m.url, m.expected_status, m.interval_seconds
      FROM monitors m
      LEFT JOIN LATERAL (
        SELECT checked_at 
        FROM checks 
        WHERE monitor_id = m.id 
        ORDER BY checked_at DESC 
        LIMIT 1
      ) c ON true
      WHERE m.is_active = true
        AND (c.checked_at IS NULL OR c.checked_at <= NOW() - (m.interval_seconds || ' seconds')::INTERVAL);
    `,
  );

  return rows;
}

export async function addCheck({
  monitor_id,
  ok,
  status_code,
  latency_ms,
  error,
}) {
  const client = await db.connect();
  try {
    await client.query("BEGIN;");
    await client.query(
      `INSERT INTO checks (monitor_id, ok, status_code, latency_ms, error) 
       VALUES ($1, $2, $3, $4, $5)`,
      [monitor_id, ok, status_code, latency_ms, error],
    );

    const incidentQuery = `
      SELECT id FROM incidents
      WHERE monitor_id = $1 AND resolved_at IS NULL
      FOR UPDATE;`;

    const { rows: openIncidents } = await client.query(incidentQuery, [
      monitor_id,
    ]);

    const hasOpenIncident = openIncidents.length > 0;
    if (!ok && !hasOpenIncident) {
      const causeMessage =
        error || `Expected status code mismatch (Status: ${status_code})`;

      await client.query(
        `INSERT INTO incidents (monitor_id, cause) VALUES ($1, $2)`,
        [monitor_id, causeMessage],
      );
      logger.info(
        `[Transaction] 🚨 Incident OPENED for Monitor ID ${monitor_id}`,
      );
    } else if (ok && hasOpenIncident) {
      await client.query(
        `UPDATE incidents
        SET resolved_at = NOW()
        WHERE monitor_id = $1 AND resolved_at IS NULL`,
        [monitor_id],
      );
      logger.info(
        `[Transaction] ✅ Incident RESOLVED for Monitor ID ${monitor_id}`,
      );
    }

    await client.query("COMMIT;");
  } catch (err) {
    await client.query("ROLLBACK;");
    logger.error(`[Transaction Error] Rolling back check save for Monitor ID ${monitor_id}: ${err.message}`);
    throw err;
  } finally {
    client.release();
  }
}
