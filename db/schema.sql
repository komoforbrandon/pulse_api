CREATE TABLE
    IF NOT EXISTS monitors (
        id SERIAL PRIMARY KEY,
        name VARCHAR(120) NOT NULL,
        url TEXT NOT NULL,
        interval_seconds INT NOT NULL DEFAULT 60 CHECK (interval_seconds BETWEEN 10 AND 3600),
        expected_status INT NOT NULL DEFAULT 200,
        is_active BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMP NOT NULL DEFAULT NOW ()
    );

CREATE TABLE
    IF NOT EXISTS checks (
        id SERIAL PRIMARY KEY,
        monitor_id INT NOT NULL REFERENCES monitors (id) ON DELETE CASCADE,
        checked_at TIMESTAMPTZ NOT NULL DEFAULT NOW (),
        ok BOOLEAN NOT NULL,
        status_code INT,
        latency_ms INT,
        error TEXT
    );

CREATE INDEX IF NOT EXISTS idx_checks_monitor_time ON checks (monitor_id, checked_at DESC);
CREATE INDEX IF NOT EXISTS idx_checks_pagination ON checks (monitor_id, id DESC);

CREATE TABLE
    IF NOT EXISTS incidents (
        id SERIAL PRIMARY KEY,
        monitor_id INT NOT NULL REFERENCES monitors (id) ON DELETE CASCADE,
        started_at TIMESTAMPTZ NOT NULL DEFAULT NOW (),
        resolved_at TIMESTAMPTZ,
        cause TEXT
    );

CREATE UNIQUE INDEX IF NOT EXISTS idx_one_active_incident_per_monitor ON incidents (monitor_id) WHERE resolved_at IS NULL;