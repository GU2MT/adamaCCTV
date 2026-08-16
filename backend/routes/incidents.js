const express = require('express');
const router = express.Router();
const IncidentsController = require('../controllers/incidentsController');
const authenticate = require('../middleware/authenticate');

router.post('/report', authenticate, IncidentsController.reportIncident);
router.get('/', authenticate, IncidentsController.listIncidents);

module.exports = router;
