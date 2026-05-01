const express = require('express');
const router = express.Router();
const achievementCtrl = require('../controllers/achievementController');
const { requireUser } = require('../middleware/auth');

router.get('/me', requireUser, achievementCtrl.getAchievements);

module.exports = router;