-- 001_enable_postgis.sql
-- Enable PostGIS extensions required for spatial data and helpers

CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS postgis_topology;

-- Helpful config: ensure the public schema exists (usually present)
CREATE SCHEMA IF NOT EXISTS public;

-- Optional: helper function to ensure SRID 4326 usage (left as comment)
-- SELECT UpdateGeometrySRID('public', 'cctv_cameras', 'location', 4326);
