const CCTV = require('../models/cctv_cameras');

async function registerCamera(req, res) {
  try {
    const {
      camera_type,        // PUBLIC/PRIVATE from the form
      establishment_name,
      address_kebele,
      coverage_direction,
      latitude,
      longitude,
    } = req.body;

    const owner_id = req.user.user_id;
    const camera_code = `CAM-${Date.now()}`; // auto-generated, unique enough for now

    const camera = await CCTV.createCamera({
      owner_id,
      camera_code,
      camera_name: establishment_name,
      ownership_type: camera_type,     // form's PUBLIC/PRIVATE goes here
      camera_type: null,               // form doesn't collect this yet (dome/bullet/etc)
      address: address_kebele,
      viewing_direction: coverage_direction,
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

async function myCameras(req, res) {
  try {
    const owner_id = req.user.user_id;
    const cameras = await CCTV.findCamerasByOwner(owner_id);
    res.json({ cameras });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch your cameras' });
  }
}

async function pendingCameras(req, res) {
  try {
    if (req.user.role_id !== 1) {
      return res.status(403).json({ error: 'Admin access required' });
    }
    const cameras = await CCTV.findPendingCameras();
    res.json({ cameras });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch pending cameras' });
  }
}

async function verifyCamera(req, res) {
  try {
    if (req.user.role_id !== 1) {
      return res.status(403).json({ error: 'Admin access required' });
    }
    const { camera_id } = req.params;
    const { decision } = req.body; // 'approve' or 'reject'

    const camera = await CCTV.verifyCamera(camera_id, decision);
    if (!camera) {
      return res.status(404).json({ error: 'Camera not found' });
    }

    res.json({ message: `Camera ${decision}d`, camera });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to verify camera' });
  }
}
async function allCamerasForMap(req, res) {
  try {
    const cameras = await CCTV.findAllForMap();
    res.json({ cameras });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch camera map data' });
  }
}
module.exports = {
  registerCamera,
  nearbyCameras,
  myCameras,
  pendingCameras,
  verifyCamera,
  allCamerasForMap,
};