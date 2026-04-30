const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

exports.register = async (req, res) => {
  try {
    const { username, password, nickname, email } = req.body;
    if (!username || !password) {
      return res.status(400).json({ code: 400, message: '用户名和密码不能为空' });
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await userModel.createUser({ username, passwordHash: hashed, nickname, email });

    res.status(201).json({ code: 201, message: '注册成功', data: user });
  } catch (err) {
    if (err.code === '23505') {  // PostgreSQL 唯一约束冲突
      return res.status(400).json({ code: 400, message: '用户名已存在' });
    }
    console.error(err);
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await userModel.findByUsername(username);
    if (!user) {
      return res.status(401).json({ code: 401, message: '用户名或密码错误' });
    }
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ code: 401, message: '用户名或密码错误' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      code: 200,
      message: '登录成功',
      data: {
        token,
        user: { id: user.id, username: user.username, role: user.role }
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
};

exports.getProfile = async (req, res) => {
  // 已通过 auth 中间件，req.user 中包含 id
  const user = await userModel.findByUsername(req.user.username);
  if (!user) return res.status(404).json({ code: 404, message: '用户不存在' });
  const { password_hash, ...safeUser } = user;
  res.json({ code: 200, data: safeUser });
};