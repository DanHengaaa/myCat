const pool = require('../config/db');

exports.createUser = async ({ username, passwordHash, nickname, email }) => {
  const sql = `
    INSERT INTO users (username, password_hash, nickname, email, role)
    VALUES ($1, $2, $3, $4, 'user')
    RETURNING id, username, nickname, email, role, created_at
  `;
  const { rows } = await pool.query(sql, [username, passwordHash, nickname, email]);
  return rows[0];
};

exports.findByUsername = async (username) => {
  const sql = `SELECT * FROM users WHERE username = $1`;
  const { rows } = await pool.query(sql, [username]);
  return rows[0];
};