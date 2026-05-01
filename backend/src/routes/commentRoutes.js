const express = require('express');
const router = express.Router();
const commentCtrl = require('../controllers/commentController');
const { requireUser, requireAdmin } = require('../middleware/auth');

router.post('/', requireUser, commentCtrl.create);
router.get('/', commentCtrl.list);
router.delete('/:id', requireAdmin, commentCtrl.remove);

module.exports = router;