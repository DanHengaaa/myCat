const express = require('express');
const router = express.Router();
const catCtrl = require('../controllers/catController');
const { requireAdmin } = require('../middleware/auth');

// 公开接口
router.get('/', catCtrl.getAll);
router.get('/:id', catCtrl.getById);

// 管理员接口
router.post('/', requireAdmin, catCtrl.create);
router.put('/:id', requireAdmin, catCtrl.update);
router.delete('/:id', requireAdmin, catCtrl.remove);

// 猫咪-点位关联（管理员）
router.post('/:id/locations', requireAdmin, catCtrl.addLocation);
router.delete('/:id/locations/:locationId', requireAdmin, catCtrl.removeLocation);

module.exports = router;