-- 005_create_camera_media.sql
-- Media (images/videos) associated with cameras (e.g., snapshots, thumbnails)

CREATE TABLE IF NOT EXISTS camera_media (
  media_id SERIAL PRIMARY KEY,
  camera_id INT NOT NULL REFERENCES cctv_cameras(camera_id) ON DELETE CASCADE,
  media_type VARCHAR(30) NOT NULL CHECK (media_type IN ('IMAGE','VIDEO','SNAPSHOT','THUMBNAIL')),
  uri TEXT NOT NULL, -- could be S3 URL or local path
  metadata JSONB, -- optional: codec, resolution, timestamp, etc.
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_camera_media_camera ON camera_media (camera_id);
