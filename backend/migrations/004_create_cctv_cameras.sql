-- 004_create_cctv_cameras.sql
-- CCTV cameras table with spatial location and metadata

CREATE TABLE IF NOT EXISTS cctv_cameras (
  camera_id SERIAL PRIMARY KEY,
  owner_id INT REFERENCES users(user_id) ON DELETE SET NULL,
  camera_type VARCHAR(20) CHECK (camera_type IN ('PUBLIC','PRIVATE')),
  establishment_name VARCHAR(200),
  address_kebele VARCHAR(200),
  address_text TEXT,
  ip_address VARCHAR(64),
  camera_model VARCHAR(128),
  coverage_direction VARCHAR(100),
  installation_date DATE,
  status VARCHAR(30) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING','VERIFIED','REJECTED','DECOMMISSIONED')),
  location GEOMETRY(Point, 4326),
  registered_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Spatial index for fast proximity queries
CREATE INDEX IF NOT EXISTS idx_cctv_cameras_location ON cctv_cameras USING GIST (location);

-- Helpful index on status to filter verified cameras
CREATE INDEX IF NOT EXISTS idx_cctv_cameras_status ON cctv_cameras (status);
