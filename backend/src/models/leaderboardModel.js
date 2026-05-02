const pool = require('../config/db');   // ← 最关键的一行，之前漏了

/**
 * 猫咪排行榜：只统计已通过审核的猫
 */
exports.getCatLeaderboard = async (limit = 10) => {
  const sql = `
    SELECT c.id AS cat_id, c.name, c.color, c.main_photo_url,
           COUNT(ch.id)::int AS checkin_count
    FROM cats c
    LEFT JOIN checkins ch ON c.id = ch.cat_id
    WHERE c.status = 'approved'
    GROUP BY c.id
    ORDER BY checkin_count DESC
    LIMIT $1
  `;
  const { rows } = await pool.query(sql, [limit]);
  return rows;
};

/**
 * 用户排行榜：可按类型过滤
 * 参数顺序：(type, limit)
 */
exports.getUserLeaderboard = async (type = 'all', limit = 10) => {
  let sql = `
    SELECT u.id AS user_id, u.username, u.nickname,
           COUNT(ch.id)::int AS checkin_count
    FROM users u
    LEFT JOIN checkins ch ON u.id = ch.user_id
  `;
  const values = [];
  if (type !== 'all') {
    sql += ` WHERE ch.type = $1`;
    values.push(type);
  }
  sql += ` GROUP BY u.id ORDER BY checkin_count DESC LIMIT $${values.length + 1}`;
  values.push(limit);
  const { rows } = await pool.query(sql, values);
  return rows;
};