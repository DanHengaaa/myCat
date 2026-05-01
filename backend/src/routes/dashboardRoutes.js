const express = require('express');
const router = express.Router();
const dashboardCtrl = require('../controllers/dashboardController');
const { requireAdmin } = require('../middleware/auth');

router.get('/', requireAdmin, dashboardCtrl.getStats);

module.exports = router;