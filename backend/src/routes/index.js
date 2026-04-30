const express = require('express');
const router = express.Router();

router.use('/cats', require('./catRoutes'));
router.use('/users', require('./userRoutes'));

module.exports = router;