-- 008_create_incident_camera_matches.sql
-- Matches between incidents and cameras (computed when an incident is reported)

CREATE TABLE IF NOT EXISTS incident_camera_matches (
  match_id SERIAL PRIMARY KEY,
  incident_id INT NOT NULL REFERENCES incidents(incident_id) ON DELETE CASCADE,
  camera_id INT NOT NULL REFERENCES cctv_cameras(camera_id) ON DELETE CASCADE,
  distance_meters DOUBLE PRECISION, -- store computed distance at match time
  matched_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  note TEXT
);

CREATE INDEX IF NOT EXISTS idx_matches_incident ON incident_camera_matches (incident_id);
CREATE INDEX IF NOT EXISTS idx_matches_camera ON incident_camera_matches (camera_id);

-- Prevent duplicate exact matches for the same incident & camera (but allow repeated matches over time)
CREATE UNIQUE INDEX IF NOT EXISTS uq_matches_incident_camera ON incident_camera_matches (incident_id, camera_id, matched_at);
