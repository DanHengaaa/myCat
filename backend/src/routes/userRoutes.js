const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/userController');
const { requireUser } = require('../middleware/auth');

router.post('/register', userCtrl.register);
router.post('/login', userCtrl.login);
router.get('/me', requireUser, userCtrl.getProfile);

module.exports = router;