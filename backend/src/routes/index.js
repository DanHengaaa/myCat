const express = require('express');
const router = express.Router();

// 挂载各个模块的路由
router.use('/users', require('./userRoutes'));
router.use('/cats', require('./catRoutes'));   // 已有
 router.use('/locations', require('./locationRoutes'));
 router.use('/checkins', require('./checkinRoutes'));
 router.use('/comments', require('./commentRoutes'));
 router.use('/dashboard', require('./dashboardRoutes'));
 router.use('/leaderboard', require('./leaderboardRoutes'));
router.use('/achievements', require('./achievementRoutes'));

module.exports = router;