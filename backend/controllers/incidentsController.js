const Incidents = require('../models/incidents');
const Cameras = require('../models/cctv_cameras');

const reportIncident = async (req, res) => {
  try {
    const { incident_type, description, incident_time, location } = req.body;
    const reporter_id = req.user.user_id;

    if (!incident_time || !location || typeof location.latitude !== 'number' || typeof location.longitude !== 'number') {
      return res.status(400).json({ error: 'incident_time and numeric location required' });
    }

    const incident = await Incidents.createIncident({ reporter_id, incident_type, description, incident_time, location });

    const nearby = await Cameras.findCamerasNear({ latitude: location.latitude, longitude: location.longitude, radiusMeters: 500 });

    res.status(201).json({ incident, nearby_cameras: nearby });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
const listIncidents = async (req, res) => {
  try {
    const incidents = await Incidents.findAllIncidents();
    res.json({ incidents });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
module.exports = {
  reportIncident,
  listIncidents,
};