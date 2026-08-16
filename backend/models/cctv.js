const CCTV = require('../models/cctv_cameras');

async function registerCamera(req, res) {
  try {
    const {
      camera_type,
      establishment_name,
      address_kebele,
      coverage_direction,
      latitude,
      longitude,
    } = req.body;

    const owner_id = req.user.user_id;

    const camera = await CCTV.createCamera({
      owner_id,
      camera_type,
      establishment_name,
      address_kebele,
      coverage_direction,
      location: { latitude, longitude },
    });

    res.status(201).json({
      message: 'CCTV registered successfully',
      camera,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to register CCTV' });
  }
}

async function nearbyCameras(req, res) {
  try {
    const { lat, lng, radius } = req.query;

    const cameras = await CCTV.findCamerasNear({
      latitude: parseFloat(lat),
      longitude: parseFloat(lng),
      radiusMeters: radius ? parseInt(radius) : 200,
    });

    res.json({ cameras });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch nearby cameras' });
  }
}

module.exports = {
  registerCamera,
  nearbyCameras,
};