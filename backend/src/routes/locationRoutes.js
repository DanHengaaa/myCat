const express = require('express');
const router = express.Router();
const locCtrl = require('../controllers/locationController');
const { requireUser, requireAdmin } = require('../middleware/auth');

// 公开接口
router.get('/', locCtrl.getAll);
router.get('/:id', locCtrl.getById);

// 登录用户可提交点位
router.post('/', requireUser, locCtrl.create);

// 管理员专属
router.put('/:id', requireAdmin, locCtrl.update);
router.delete('/:id', requireAdmin, locCtrl.remove);
router.put('/:id/review', requireAdmin, locCtrl.review);

// 管理员查看待审核列表
router.get('/admin/pending', requireAdmin, locCtrl.getPending);

module.exports = router;