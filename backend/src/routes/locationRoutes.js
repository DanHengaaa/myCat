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
// 请求删除点位（登录用户）
router.put('/:id/request-delete', requireUser, locCtrl.requestDelete);
// 管理员获取待删除列表
router.get('/admin/pending-deletes', requireAdmin, locCtrl.getPendingDeletes);
// 管理员审核删除
router.put('/:id/review-delete', requireAdmin, locCtrl.reviewDeleteRequest);



module.exports = router;



