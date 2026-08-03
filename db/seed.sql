-- CLEAR EXISTING SEED DATA (Optional, run safely in dev)
TRUNCATE TABLE operators, monitors, checks, incidents RESTART IDENTITY CASCADE;

-- 1. SEED OPERATORS
-- Both operators share the same raw password string: "password123"
INSERT INTO operators (email, password_hash, created_at) VALUES
('kbrand@gmail.com', '$2b$10$mellpYbgMi76ecNPDYwojeiRJfw.zg6.PsVY4MNc/eNObzb0U3zBG', NOW() - INTERVAL '2 days'),
('admin@pulse.io', '$2a$10$7Z2hPClD5SPhS.9gM4uO6ex7O/V43M9R660P2uG.YV.fPsm8WnS6C', NOW() - INTERVAL '2 days');

-- 2. SEED MONITORS
-- Tie monitors directly to Operator 1 (ID 1) and Operator 2 (ID 2)
INSERT INTO monitors (operator_id, name, url, interval_seconds, expected_status, is_active, created_at) VALUES
(1, 'Production API Gateway', 'https://example.com', 30, 200, true, NOW() - INTERVAL '30 hours'),
(1, 'Marketing Landing Page', 'https://example.com', 60, 200, true, NOW() - INTERVAL '30 hours'),
(2, 'Internal Auth Service', 'https://internal.net', 60, 200, false, NOW() - INTERVAL '30 hours');

-- 3. SEED TIME-SERIES CHECKS (Over a 24-hour timeline window)
-- Monitor 1 (Production API Gateway): Healthy, low latency, all operational
INSERT INTO checks (monitor_id, checked_at, ok, status_code, latency_ms, error) VALUES
(1, NOW() - INTERVAL '24 hours', true, 200, 45, NULL),
(1, NOW() - INTERVAL '20 hours', true, 200, 52, NULL),
(1, NOW() - INTERVAL '16 hours', true, 200, 41, NULL),
(1, NOW() - INTERVAL '12 hours', true, 200, 68, NULL),
(1, NOW() - INTERVAL '8 hours',  true, 200, 39, NULL),
(1, NOW() - INTERVAL '4 hours',  true, 200, 55, NULL),
(1, NOW() - INTERVAL '1 hour',   true, 200, 48, NULL),
(1, NOW() - INTERVAL '5 mins',   true, 200, 42, NULL);

-- Monitor 2 (Marketing Landing Page): Suffered an outage 4 hours ago, recovered 2 hours later
INSERT INTO checks (monitor_id, checked_at, ok, status_code, latency_ms, error) VALUES
(2, NOW() - INTERVAL '24 hours', true, 200, 120, NULL),
(2, NOW() - INTERVAL '20 hours', true, 200, 115, NULL),
(2, NOW() - INTERVAL '16 hours', true, 200, 132, NULL),
(2, NOW() - INTERVAL '12 hours', true, 200, 108, NULL),
-- Outage begins here:
(2, NOW() - INTERVAL '4 hours',  false, 503, 5000, 'Service Unavailable'),
(2, NOW() - INTERVAL '3 hours',  false, NULL, 0, 'Error: Connection Timeout'),
-- Recovery begins here:
(2, NOW() - INTERVAL '2 hours',  true, 200, 145, NULL),
(2, NOW() - INTERVAL '1 hour',   true, 200, 110, NULL),
(2, NOW() - INTERVAL '10 mins',  true, 200, 95, NULL);

-- Monitor 3 (Internal Auth Service): Currently broken, open active incident right now
INSERT INTO checks (monitor_id, checked_at, ok, status_code, latency_ms, error) VALUES
(3, NOW() - INTERVAL '24 hours', true, 200, 15, NULL),
(3, NOW() - INTERVAL '18 hours', true, 200, 18, NULL),
-- App crashed 2 hours ago and remains down:
(3, NOW() - INTERVAL '2 hours',  false, 500, 240, 'Internal Server Error'),
(3, NOW() - INTERVAL '1 hour',   false, 500, 195, 'Internal Server Error'),
(3, NOW() - INTERVAL '15 mins',  false, 500, 210, 'Internal Server Error');

-- 4. SEED INCIDENTS (Matches the check outage logs)
INSERT INTO incidents (monitor_id, started_at, resolved_at, cause) VALUES
-- Incident for Monitor 2: Started 4 hours ago, resolved 2 hours ago
(2, NOW() - INTERVAL '4 hours', NOW() - INTERVAL '2 hours', 'Website returned status 503 Service Unavailable'),

-- Active Incident for Monitor 3: Started 2 hours ago, resolved_at is NULL (remains active!)
(3, NOW() - INTERVAL '2 hours', NULL, 'Website returned status 500 Internal Server Error');
