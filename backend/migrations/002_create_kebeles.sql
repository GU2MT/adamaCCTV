-- 002_create_kebeles.sql
-- Administrative kebele (neighborhood) polygons / basic reference table

CREATE TABLE IF NOT EXISTS kebeles (
  kebele_id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  code VARCHAR(50), -- optional local code
  boundary GEOMETRY(Polygon, 4326),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Spatial index for boundary lookups
CREATE INDEX IF NOT EXISTS idx_kebeles_boundary ON kebeles USING GIST (boundary);
