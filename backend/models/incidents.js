const db = require('../config/database');

const createIncident = async ({ reporter_id, incident_type, description, incident_time, location }) => {
  const result = await db.query(
    `INSERT INTO incidents (reporter_id, incident_type, description, incident_time, location)
     VALUES ($1, $2, $3, $4, ST_SetSRID(ST_MakePoint($5, $6), 4326))
     RETURNING *`,
    [reporter_id, incident_type, description, incident_time, location.longitude, location.latitude]
  );
  return result.rows[0];
};
const findAllIncidents = async () => {
  const res = await db.query(
    `SELECT incident_id, reporter_id, incident_type, description, incident_time, status,
            ST_Y(location) AS latitude, ST_X(location) AS longitude, reported_at
     FROM incidents
     ORDER BY reported_at DESC`
  );
  return res.rows;
};

module.exports = {
  createIncident,
  findAllIncidents,
};