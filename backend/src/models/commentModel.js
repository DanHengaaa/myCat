const pool = require('../config/db');

exports.create = async ({ userId, targetType, targetId, content, photoUrl }) => {
  const sql = `
    INSERT INTO comments (user_id, target_type, target_id, content, photo_url)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `;
  const { rows } = await pool.query(sql, [userId, targetType, targetId, content, photoUrl || null]);
  return rows[0];
};

exports.findByTarget = async ({ targetType, targetId, page = 1, limit = 20 }) => {
  const offset = (page - 1) * limit;
  
  const countSql = `SELECT COUNT(*) FROM comments WHERE target_type = $1 AND target_id = $2`;
  const { rows: countRows } = await pool.query(countSql, [targetType, targetId]);
  const total = parseInt(countRows[0].count);

  const dataSql = `
    SELECT c.*, u.username, u.nickname AS user_nickname, u.avatar_url
    FROM comments c
    JOIN users u ON c.user_id = u.id
    WHERE c.target_type = $1 AND c.target_id = $2
    ORDER BY c.created_at DESC
    LIMIT $3 OFFSET $4
  `;
  const { rows } = await pool.query(dataSql, [targetType, targetId, limit, offset]);
  return { total, page, limit, comments: rows };
};

exports.remove = async (commentId) => {
  const sql = `DELETE FROM comments WHERE id = $1 RETURNING *`;
  const { rows } = await pool.query(sql, [commentId]);
  return rows[0];
};

exports.findById = async (commentId) => {
  const sql = `SELECT * FROM comments WHERE id = $1`;
  const { rows } = await pool.query(sql, [commentId]);
  return rows[0];
};