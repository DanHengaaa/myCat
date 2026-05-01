const express = require('express');
const router = express.Router();
const lbCtrl = require('../controllers/leaderboardController');

router.get('/cats', lbCtrl.catLeaderboard);
router.get('/users', lbCtrl.userLeaderboard);

module.exports = router;