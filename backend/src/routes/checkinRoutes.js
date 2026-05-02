const express = require('express');
const router = express.Router();
const checkinCtrl = require('../controllers/checkinController');
const { requireUser, requireAdmin } = require('../middleware/auth');

// 用户打卡
router.post('/', requireUser, checkinCtrl.create);

// 查询打卡记录（公开）
router.get('/', checkinCtrl.list);

// 今日打卡（需登录，放在 /:id 之前避免被当成 id）
router.get('/today', requireUser, checkinCtrl.todayWithCoords);

router.delete('/:id', requireUser, checkinCtrl.deleteOwn);  // 放在 /:id/review 之前

// 管理员审核
router.put('/:id/review', requireAdmin, checkinCtrl.review);

// 轨迹（公开）
router.get('/trajectory/:catId', checkinCtrl.trajectory);

module.exports = router;