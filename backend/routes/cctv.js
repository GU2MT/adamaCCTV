const express = require('express');
const router = express.Router();

const CctvController = require('../controllers/cctvController');
const authenticate = require('../middleware/authenticate');

console.log('Controller:', CctvController);
console.log('registerCamera:', typeof CctvController.registerCamera);
console.log('nearbyCameras:', typeof CctvController.nearbyCameras);
console.log('authenticate:', typeof authenticate);

router.post('/register', authenticate, CctvController.registerCamera);
router.get('/nearby', authenticate, CctvController.nearbyCameras);
router.get('/my', authenticate, CctvController.myCameras);
router.get('/pending', authenticate, CctvController.pendingCameras);
router.patch('/:camera_id/verify', authenticate, CctvController.verifyCamera);
router.get('/map', authenticate, CctvController.allCamerasForMap);
module.exports = router;