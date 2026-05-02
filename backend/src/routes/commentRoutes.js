const express = require('express');
const router = express.Router();
const commentCtrl = require('../controllers/commentController');
const { requireUser } = require('../middleware/auth');

// 所有操作都需要登录
router.post('/', requireUser, commentCtrl.create);
router.get('/', commentCtrl.list);               // 公开
router.delete('/:id', requireUser, commentCtrl.remove);   // 改为普通用户可删除

module.exports = router;