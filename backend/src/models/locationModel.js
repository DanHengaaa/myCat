const pool = require('../config/db');

/**
 * 创建点位（提交后为 pending 状态）
 */
exports.create = async ({ name, latitude, longitude, description, userId }) => {
  const sql = `
    INSERT INTO locations (name, latitude, longitude, description, status, submitted_by)
    VALUES ($1, $2, $3, $4, 'pending', $5)
    RETURNING *
  `;
  const { rows } = await pool.query(sql, [name, latitude, longitude, description || null, userId]);
  return rows[0];
};

/**
 * 获取所有**已通过**的点位（含关联猫咪数量）
 */
exports.findAll = async () => {
  const sql = `
    SELECT l.*, COUNT(cl.cat_id)::int AS cat_count
    FROM locations l
    LEFT JOIN cat_locations cl ON cl.location_id = l.id
    WHERE l.status = 'approved'
    GROUP BY l.id
    ORDER BY l.id
  `;
  const { rows } = await pool.query(sql);
  return rows;
};

/**
 * 根据 ID 获取点位详情（仅已通过的点位，含常驻猫咪列表）
 */
exports.findById = async (id) => {
  const locSql = `SELECT * FROM locations WHERE id = $1 AND status = 'approved'`;
  const { rows: locRows } = await pool.query(locSql, [id]);
  if (locRows.length === 0) return null;
  const location = locRows[0];

  const catsSql = `
    SELECT c.id, c.name, c.gender, c.color, c.main_photo_url
    FROM cats c
    JOIN cat_locations cl ON cl.cat_id = c.id
    WHERE cl.location_id = $1
  `;
  const { rows: catsRows } = await pool.query(catsSql, [id]);
  location.cats = catsRows;

  return location;
};

/**
 * 更新点位信息（管理员或提交者）
 */
exports.update = async (id, { name, latitude, longitude, description }) => {
  const fields = [];
  const values = [];
  let idx = 1;

  if (name !== undefined) { fields.push(`name = $${idx++}`); values.push(name); }
  if (latitude !== undefined) { fields.push(`latitude = $${idx++}`); values.push(latitude); }
  if (longitude !== undefined) { fields.push(`longitude = $${idx++}`); values.push(longitude); }
  if (description !== undefined) { fields.push(`description = $${idx++}`); values.push(description); }

  if (fields.length === 0) return null;

  values.push(id);
  const sql = `UPDATE locations SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`;
  const { rows } = await pool.query(sql, values);
  return rows[0];
};

/**
 * 删除点位
 */
exports.remove = async (id) => {
  const sql = `DELETE FROM locations WHERE id = $1 RETURNING *`;
  const { rows } = await pool.query(sql, [id]);
  return rows[0];
};

/**
 * 审核点位（管理员）
 */
exports.review = async (id, status) => {
  const sql = `UPDATE locations SET status = $1 WHERE id = $2 RETURNING *`;
  const { rows } = await pool.query(sql, [status, id]);
  return rows[0];
};

/**
 * 获取待审核点位（管理员）
 */
exports.findPending = async () => {
  const sql = `
    SELECT l.*, u.username, u.nickname
    FROM locations l
    LEFT JOIN users u ON l.submitted_by = u.id
    WHERE l.status = 'pending'
    ORDER BY l.created_at DESC
  `;
  const { rows } = await pool.query(sql);
  return rows;
};