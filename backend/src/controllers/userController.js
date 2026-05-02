const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

/**
 * 用户注册
 * POST /api/users/register
 */
exports.register = async (req, res) => {
  try {
    const { username, password, nickname, email } = req.body;

    // 简单校验
    if (!username || !password) {
      return res.status(400).json({ code: 400, message: '用户名和密码不能为空' });
    }

    // 密码加密
    const passwordHash = await bcrypt.hash(password, 10);

    // 写入数据库
    const newUser = await userModel.createUser({
      username,
      passwordHash,
      nickname: nickname || username,
      email: email || null
    });

    res.status(201).json({
      code: 201,
      message: '注册成功',
      data: newUser
    });
  } catch (err) {
    // 唯一约束冲突（用户名已存在）
    if (err.code === '23505') {
      return res.status(400).json({ code: 400, message: '用户名已存在' });
    }
    console.error('注册错误:', err);
    res.status(500).json({ code: 500, message: '服务器内部错误' });
  }
};

/**
 * 用户登录
 * POST /api/users/login
 */
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ code: 400, message: '用户名和密码不能为空' });
    }

    // 查找用户
    const user = await userModel.findByUsername(username);
    if (!user) {
      return res.status(401).json({ code: 401, message: '用户名或密码错误' });
    }

    // 校验密码
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ code: 401, message: '用户名或密码错误' });
    }

    // 生成 JWT（7 天有效期）
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // 返回 token 和用户基本信息（不返回密码）
    res.json({
      code: 200,
      message: '登录成功',
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          nickname: user.nickname,
          email: user.email,
          role: user.role,
          avatar_url: user.avatar_url
        }
      }
    });
  } catch (err) {
    console.error('登录错误:', err);
    res.status(500).json({ code: 500, message: '服务器内部错误' });
  }
};

/**
 * 获取当前登录用户的个人信息
 * GET /api/users/me  (需要认证)
 */
exports.getProfile = async (req, res) => {
  try {
    // req.user 由 auth 中间件注入
    const user = await userModel.findByUsername(req.user.username);
    if (!user) {
      return res.status(404).json({ code: 404, message: '用户不存在' });
    }

    // 剔除密码字段
    const { password_hash, ...safeUser } = user;
    res.json({ code: 200, data: safeUser });
  } catch (err) {
    console.error('获取个人信息错误:', err);
    res.status(500).json({ code: 500, message: '服务器内部错误' });
  }
};

/**
 * 更新当前用户个人信息
 * PUT /api/users/me
 */
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { nickname, email, oldPassword, newPassword } = req.body;

    const updateData = {};
    if (nickname !== undefined) updateData.nickname = nickname;
    if (email !== undefined) updateData.email = email;

    // 如果要修改密码
    if (newPassword) {
      if (!oldPassword) {
        return res.status(400).json({ code: 400, message: '修改密码需要提供旧密码' });
      }
      const user = await userModel.findByUsername(req.user.username);
      const valid = await bcrypt.compare(oldPassword, user.password_hash);
      if (!valid) {
        return res.status(400).json({ code: 400, message: '旧密码错误' });
      }
      const hashed = await bcrypt.hash(newPassword, 10);
      updateData.passwordHash = hashed;
    }

    const updatedUser = await userModel.updateProfile(userId, updateData);
    if (!updatedUser) {
      return res.status(400).json({ code: 400, message: '没有可更新的字段' });
    }

    res.json({ code: 200, message: '信息更新成功', data: updatedUser });
  } catch (err) {
    console.error('更新个人信息出错:', err);
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
};