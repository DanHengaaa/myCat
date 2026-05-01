const express = require('express');
const router = express.Router();
const checkinCtrl = require('../controllers/checkinController');
const { requireUser, requireAdmin } = require('../middleware/auth');

// 认证用户
router.post('/', requireUser, checkinCtrl.create);

// 查询（公开，但查看 pending 可能需要管理员权限，简单起见先全部公开）
router.get('/', checkinCtrl.list);

// 管理员审核
router.put('/:id/review', requireAdmin, checkinCtrl.review);

// 轨迹（公开）
router.get('/trajectory/:catId', checkinCtrl.trajectory);

module.exports = router;