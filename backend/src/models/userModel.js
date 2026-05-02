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

/**
 * 更新用户个人信息
 */
exports.updateProfile = async (userId, { nickname, email, passwordHash }) => {
  const fields = [];
  const values = [];
  let idx = 1;

  if (nickname !== undefined) {
    fields.push(`nickname = $${idx++}`); values.push(nickname);
  }
  if (email !== undefined) {
    fields.push(`email = $${idx++}`); values.push(email);
  }
  if (passwordHash !== undefined) {
    fields.push(`password_hash = $${idx++}`); values.push(passwordHash);
  }

  if (fields.length === 0) return null;

  values.push(userId);
  const sql = `
    UPDATE users SET ${fields.join(', ')}
    WHERE id = $${idx}
    RETURNING id, username, nickname, email, role, avatar_url, created_at
  `;
  const { rows } = await pool.query(sql, values);
  return rows[0];
};