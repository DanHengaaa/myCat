const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/userController');
const { requireUser } = require('../middleware/auth');

router.post('/register', userCtrl.register);
router.post('/login', userCtrl.login);

// 需要登录
router.get('/me', requireUser, userCtrl.getProfile);
router.put('/me', requireUser, userCtrl.updateProfile);   // ← 新增

module.exports = router;