// 权限中间件
const jwt = require('jsonwebtoken');

/**
 * 要求用户已登录
 * 将解析出的 token 数据注入 req.user
 */
exports.requireUser = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ code: 401, message: '未提供认证令牌' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;   // { id, username, role, iat, exp }
    next();
  } catch (err) {
    return res.status(401).json({ code: 401, message: '令牌无效或已过期' });
  }
};

/**
 * 要求用户是管理员（在 requireUser 之后调用）
 */
exports.requireAdmin = (req, res, next) => {
  // 先确保已登录
  exports.requireUser(req, res, () => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ code: 403, message: '需要管理员权限' });
    }
    next();
  });
};