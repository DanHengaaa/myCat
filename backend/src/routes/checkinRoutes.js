const express = require('express');
const router = express.Router();
const checkinCtrl = require('../controllers/checkinController');
const { requireUser, requireAdmin } = require('../middleware/auth');

// 用户打卡
router.post('/', requireUser, checkinCtrl.create);

// 查询打卡记录（公开）
router.get('/', checkinCtrl.list);

// 热力图数据（公开，放在 /:id 之前）
router.get('/heatmap', checkinCtrl.heatmap);

// 今日打卡（需登录，放在 /:id 之前）
router.get('/today', requireUser, checkinCtrl.todayWithCoords);

// 管理员审核
router.put('/:id/review', requireAdmin, checkinCtrl.review);

// 轨迹（公开）
router.get('/trajectory/:catId', checkinCtrl.trajectory);

// 用户删除自己的打卡
router.delete('/:id', requireUser, checkinCtrl.deleteOwn);

module.exports = router;