const pool = require('../config/db');

exports.create = async ({ userId, type, catId, locationId, photoUrl, note }) => {
  const sql = `
    INSERT INTO checkins (user_id, type, cat_id, location_id, photo_url, note, status)
    VALUES ($1, $2, $3, $4, $5, $6, 'pending')
    RETURNING *
  `;
  const { rows } = await pool.query(sql, [
    userId, type, catId || null, locationId || null, photoUrl || null, note || null
  ]);
  return rows[0];
};

exports.findMany = async ({ catId, userId, type, status, page = 1, limit = 20 }) => {
  const conditions = [];
  const values = [];
  let idx = 1;

  if (catId) {
    conditions.push(`ch.cat_id = $${idx++}`);
    values.push(catId);
  }
  if (userId) {
    conditions.push(`ch.user_id = $${idx++}`);
    values.push(userId);
  }
  if (type) {
    conditions.push(`ch.type = $${idx++}`);
    values.push(type);
  }
  if (status) {
    conditions.push(`ch.status = $${idx++}`);
    values.push(status);
  }

  const where = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';
  const offset = (page - 1) * limit;

  const countSql = `SELECT COUNT(*) FROM checkins ch ${where}`;
  const { rows: countRows } = await pool.query(countSql, values);
  const total = parseInt(countRows[0].count);

  // 关键修改：增加 LEFT JOIN locations 获取地点名称
  const dataSql = `
    SELECT ch.*,
           u.username, u.nickname AS user_nickname,
           c.name AS cat_name,
           l.name AS location_name
    FROM checkins ch
    LEFT JOIN users u ON ch.user_id = u.id
    LEFT JOIN cats c ON ch.cat_id = c.id
    LEFT JOIN locations l ON ch.location_id = l.id
    ${where}
    ORDER BY ch.created_at DESC
    LIMIT $${idx++} OFFSET $${idx++}
  `;
  const dataValues = [...values, limit, offset];
  const { rows } = await pool.query(dataSql, dataValues);

  return { total, page, limit, checkins: rows };
};

exports.review = async (id, status, reviewerId) => {
  const sql = `
    UPDATE checkins SET status = $1, reviewer_id = $2, reviewed_at = CURRENT_TIMESTAMP
    WHERE id = $3 RETURNING *
  `;
  const { rows } = await pool.query(sql, [status, reviewerId, id]);
  return rows[0];
};

exports.getTrajectory = async (catId) => {
  const sql = `
    SELECT ch.created_at, l.latitude, l.longitude
    FROM checkins ch
    JOIN locations l ON ch.location_id = l.id
    WHERE ch.cat_id = $1 AND ch.status = 'approved'
    ORDER BY ch.created_at ASC
  `;
  const { rows } = await pool.query(sql, [catId]);
  return rows;
};