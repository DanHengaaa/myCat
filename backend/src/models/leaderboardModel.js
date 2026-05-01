const pool = require('../config/db');

/**
 * 猫咪排行榜：按打卡次数降序
 */
exports.getCatLeaderboard = async (limit = 10) => {
  const sql = `
    SELECT c.id AS cat_id, c.name, c.color, c.main_photo_url,
           COUNT(ch.id)::int AS checkin_count
    FROM cats c
    LEFT JOIN checkins ch ON c.id = ch.cat_id
    GROUP BY c.id
    ORDER BY checkin_count DESC
    LIMIT $1
  `;
  const { rows } = await pool.query(sql, [limit]);
  return rows;
};

/**
 * 用户排行榜：按打卡/投喂次数降序（可指定类型）
 * @param {string} type - 'sighting', 'feeding', 或 'all'
 */
exports.getUserLeaderboard = async (limit = 10, type = 'all') => {
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