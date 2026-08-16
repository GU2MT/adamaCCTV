-- 006_create_incidents.sql
-- Incident reports table (events reported by citizens or operators)

CREATE TABLE IF NOT EXISTS incidents (
  incident_id SERIAL PRIMARY KEY,
  reporter_id INT REFERENCES users(user_id) ON DELETE SET NULL,
  incident_type VARCHAR(100) NOT NULL,
  description TEXT,
  incident_time TIMESTAMP WITH TIME ZONE NOT NULL,
  location GEOMETRY(Point, 4326),
  status VARCHAR(30) NOT NULL DEFAULT 'NEW' CHECK (status IN ('NEW','UNDER_INVESTIGATION','RESOLVED','DISMISSED')),
  reported_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Spatial index for incident lookups
CREATE INDEX IF NOT EXISTS idx_incidents_location ON incidents USING GIST (location);

-- Index on incident_time for time-range queries
CREATE INDEX IF NOT EXISTS idx_incidents_time ON incidents (incident_time);
