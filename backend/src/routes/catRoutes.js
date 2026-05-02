const express = require('express');
const router = express.Router();
const catCtrl = require('../controllers/catController');
const { requireUser, requireAdmin } = require('../middleware/auth');

// 公开
router.get('/', catCtrl.getAll);
router.get('/admin/pending', requireAdmin, catCtrl.getPending);          // 待审核创建
router.get('/admin/pending-edits', requireAdmin, catCtrl.getPendingEdits); // 待审核编辑
router.get('/:id', catCtrl.getById);

// 登录用户
router.post('/', requireUser, catCtrl.create);
router.put('/:id/edit-request', requireUser, catCtrl.submitEditRequest);  // 编辑请求

// 管理员
router.put('/:id', requireAdmin, catCtrl.update);
router.delete('/:id', requireAdmin, catCtrl.remove);
router.put('/:id/review', requireAdmin, catCtrl.review);                 // 审核创建
router.put('/:id/review-edit', requireAdmin, catCtrl.reviewEditRequest);  // 审核编辑

router.post('/:id/locations', requireAdmin, catCtrl.addLocation);
router.delete('/:id/locations/:locationId', requireAdmin, catCtrl.removeLocation);

module.exports = router;