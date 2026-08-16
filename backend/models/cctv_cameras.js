const db = require('../config/database');

const createCamera = async ({
  owner_id,
  camera_code,
  camera_name,
  ownership_type,
  camera_type,
  address,
  viewing_direction,
  location,
}) => {
  const result = await db.query(
    `INSERT INTO cctv_cameras
      (owner_id, camera_code, camera_name, ownership_type, camera_type, address, viewing_direction, location, status, verification_status)
     VALUES ($1, $2, $3, $4, $5, $6, $7, ST_SetSRID(ST_MakePoint($8, $9), 4326), 'ACTIVE', 'PENDING')
     RETURNING *`,
    [owner_id, camera_code, camera_name, ownership_type, camera_type, address, viewing_direction, location.longitude, location.latitude]
  );
  return result.rows[0];
};

const findCamerasNear = async ({ latitude, longitude, radiusMeters = 200 }) => {
  const res = await db.query(
    `SELECT camera_id, camera_name, address, verification_status,
            ST_Distance(location::geography, ST_SetSRID(ST_MakePoint($1, $2),4326)::geography) AS distance_meters
     FROM cctv_cameras
     WHERE verification_status = 'VERIFIED' AND ST_DWithin(location::geography, ST_SetSRID(ST_MakePoint($1, $2),4326)::geography, $3)
     ORDER BY distance_meters ASC`,
    [longitude, latitude, radiusMeters]
  );
  return res.rows;
};

const findCamerasByOwner = async (owner_id) => {
  const res = await db.query(
    `SELECT camera_id, camera_code, camera_name, ownership_type, camera_type,
            address, viewing_direction, status, verification_status, registered_at
     FROM cctv_cameras
     WHERE owner_id = $1
     ORDER BY registered_at DESC`,
    [owner_id]
  );
  return res.rows;
};

const verifyCamera = async (camera_id, decision) => {
  const status = decision === 'approve' ? 'VERIFIED' : 'REJECTED';
  const result = await db.query(
    `UPDATE cctv_cameras SET verification_status = $1 WHERE camera_id = $2 RETURNING *`,
    [status, camera_id]
  );
  return result.rows[0];
};

const findPendingCameras = async () => {
  const res = await db.query(
    `SELECT camera_id, camera_name, ownership_type, address, viewing_direction, registered_at
     FROM cctv_cameras
     WHERE verification_status = 'PENDING'
     ORDER BY registered_at ASC`
  );
  return res.rows;
};
const findAllForMap = async () => {
  const res = await db.query(
    `SELECT camera_id, camera_name, ownership_type, address, verification_status,
            ST_Y(location) AS latitude, ST_X(location) AS longitude
     FROM cctv_cameras
     WHERE location IS NOT NULL
     ORDER BY registered_at DESC`
  );
  return res.rows;
};
module.exports = {
  createCamera,
  findCamerasNear,
  findCamerasByOwner,
  verifyCamera,
  findPendingCameras,
  findAllForMap,
};