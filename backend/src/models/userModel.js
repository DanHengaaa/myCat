const pool = require('../config/db');

/**
 * 创建新用户（注册）
 * @param {Object} param0
 * @param {string} param0.username
 * @param {string} param0.passwordHash
 * @param {string} param0.nickname
 * @param {string} param0.email
 * @returns {Promise<Object>} 新建的用户信息（不含密码）
 */
exports.createUser = async ({ username, passwordHash, nickname, email }) => {
  const sql = `
    INSERT INTO users (username, password_hash, nickname, email, role)
    VALUES ($1, $2, $3, $4, 'user')
    RETURNING id, username, nickname, email, role, created_at
  `;
  const { rows } = await pool.query(sql, [username, passwordHash, nickname, email]);
  return rows[0];
};

/**
 * 根据用户名查找用户（用于登录验证）
 * @param {string} username
 * @returns {Promise<Object|null>}
 */
exports.findByUsername = async (username) => {
  const sql = `SELECT * FROM users WHERE username = $1`;
  const { rows } = await pool.query(sql, [username]);
  return rows[0] || null;
};