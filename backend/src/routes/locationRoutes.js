const express = require('express');
const router = express.Router();
const locCtrl = require('../controllers/locationController');
const { requireAdmin } = require('../middleware/auth');

router.get('/', locCtrl.getAll);
router.get('/:id', locCtrl.getById);
router.post('/', requireAdmin, locCtrl.create);
router.put('/:id', requireAdmin, locCtrl.update);
router.delete('/:id', requireAdmin, locCtrl.remove);

module.exports = router;