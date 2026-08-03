import { db } from '../db.js'; 

export async function uptime({ monitor_id, windowString }) { 
  const interval_map = { 
    '1h': '1 hour', 
    '24h': '24 hours', 
    '7d': '7 days' 
  };
  
  const sqlInterval = interval_map[windowString] || '24 hours'; 

  const query = `
    SELECT 
      COALESCE(
        ROUND(
          (COUNT(CASE WHEN ok = true THEN 1 END) * 100.0 / NULLIF(COUNT(*), 0)), 
          2
        ), 
        0.00
      ) AS uptime_percentage,
      
      COALESCE(ROUND(AVG(latency_ms), 2), 0) AS avg_latency_ms,
      
      COALESCE(
        percentile_cont(0.95) WITHIN GROUP (ORDER BY latency_ms::numeric), 
        0
      ) AS p95_latency_ms
    FROM checks 
    WHERE monitor_id = $1 
      AND checked_at >= NOW() - CAST($2 AS INTERVAL);
  `;

  const { rows } = await db.query(query, [monitor_id, sqlInterval]); 
  
  return rows[0] ?? null; 
}
