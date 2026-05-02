const express = require('express');
const router = express.Router();
const catCtrl = require('../controllers/catController');
const { requireUser, requireAdmin } = require('../middleware/auth');

// 公开接口
router.get('/', catCtrl.getAll);
router.get('/admin/pending', requireAdmin, catCtrl.getPending);  // 必须在 /:id 之前
router.get('/:id', catCtrl.getById);

// 普通用户可提交
router.post('/', requireUser, catCtrl.create);

// 管理员接口
router.put('/:id', requireAdmin, catCtrl.update);
router.delete('/:id', requireAdmin, catCtrl.remove);
router.put('/:id/review', requireAdmin, catCtrl.review);

router.post('/:id/locations', requireAdmin, catCtrl.addLocation);
router.delete('/:id/locations/:locationId', requireAdmin, catCtrl.removeLocation);

module.exports = router;