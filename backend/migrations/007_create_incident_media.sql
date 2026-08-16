-- 007_create_incident_media.sql
-- Media associated with incidents (uploads, evidence clips, snapshots)

CREATE TABLE IF NOT EXISTS incident_media (
  media_id SERIAL PRIMARY KEY,
  incident_id INT NOT NULL REFERENCES incidents(incident_id) ON DELETE CASCADE,
  media_type VARCHAR(30) NOT NULL CHECK (media_type IN ('IMAGE','VIDEO','SNAPSHOT','THUMBNAIL')),
  uri TEXT NOT NULL,
  metadata JSONB,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_incident_media_incident ON incident_media (incident_id);
