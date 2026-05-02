const pool = require('../config/db');

/**
 * 创建猫咪档案（默认状态为 pending）
 */
exports.create = async (catData) => {
  const { name, gender, color, personality_tags, health_status, neutered, description, main_photo_url, userId } = catData;
  const sql = `
    INSERT INTO cats (name, gender, color, personality_tags, health_status, neutered, description, main_photo_url, status, submitted_by)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending', $9)
    RETURNING *
  `;
  const { rows } = await pool.query(sql, [
    name,
    gender || null,
    color || null,
    personality_tags || [],
    health_status || null,
    neutered || false,
    description || null,
    main_photo_url || null,
    userId || null
  ]);
  return rows[0];
};

/**
 * 分页查询已通过的猫咪列表
 */
exports.findAll = async (filters = {}) => {
  const page = parseInt(filters.page) || 1;
  const limit = parseInt(filters.limit) || 10;
  const offset = (page - 1) * limit;
  const conditions = ['status = \'approved\''];
  const values = [];
  let paramIndex = 1;

  if (filters.gender) {
    conditions.push(`gender = $${paramIndex++}`);
    values.push(filters.gender);
  }
  if (filters.neutered !== undefined) {
    conditions.push(`neutered = $${paramIndex++}`);
    values.push(filters.neutered === 'true' || filters.neutered === true);
  }

  const whereClause = 'WHERE ' + conditions.join(' AND ');

  const countSql = `SELECT COUNT(*) FROM cats ${whereClause}`;
  const { rows: countRows } = await pool.query(countSql, values);
  const total = parseInt(countRows[0].count);

  const dataSql = `
    SELECT * FROM cats
    ${whereClause}
    ORDER BY id DESC
    LIMIT $${paramIndex++} OFFSET $${paramIndex++}
  `;
  const dataValues = [...values, limit, offset];
  const { rows } = await pool.query(dataSql, dataValues);

  return { total, page, limit, cats: rows };
};

/**
 * 根据 ID 获取猫咪详情（仅已通过）
 */
exports.findById = async (id) => {
  const catSql = `SELECT * FROM cats WHERE id = $1 AND status = 'approved'`;
  const { rows: catRows } = await pool.query(catSql, [id]);
  if (catRows.length === 0) return null;
  const cat = catRows[0];

  const locSql = `
    SELECT l.id, l.name, l.latitude, l.longitude, l.description
    FROM locations l
    JOIN cat_locations cl ON cl.location_id = l.id
    WHERE cl.cat_id = $1
  `;
  const { rows: locRows } = await pool.query(locSql, [id]);
  cat.locations = locRows;

  return cat;
};

/**
 * 更新猫咪信息
 */
exports.update = async (id, catData) => {
  const fields = [];
  const values = [];
  let idx = 1;

  for (const key of ['name', 'gender', 'color', 'personality_tags', 'health_status', 'neutered', 'description', 'main_photo_url']) {
    if (catData[key] !== undefined) {
      fields.push(`${key} = $${idx}`);
      values.push(catData[key]);
      idx++;
    }
  }
  if (fields.length === 0) return null;

  fields.push(`updated_at = CURRENT_TIMESTAMP`);
  values.push(id);
  const sql = `
    UPDATE cats SET ${fields.join(', ')}
    WHERE id = $${idx}
    RETURNING *
  `;
  const { rows } = await pool.query(sql, values);
  return rows[0];
};

/**
 * 删除猫咪
 */
exports.remove = async (id) => {
  const sql = `DELETE FROM cats WHERE id = $1 RETURNING *`;
  const { rows } = await pool.query(sql, [id]);
  return rows[0];
};

/**
 * 添加常驻点位
 */
exports.addLocation = async (catId, locationId) => {
  const sql = `
    INSERT INTO cat_locations (cat_id, location_id)
    VALUES ($1, $2)
    ON CONFLICT DO NOTHING
    RETURNING *
  `;
  const { rows } = await pool.query(sql, [catId, locationId]);
  return rows[0];
};

/**
 * 移除常驻点位
 */
exports.removeLocation = async (catId, locationId) => {
  const sql = `
    DELETE FROM cat_locations
    WHERE cat_id = $1 AND location_id = $2
    RETURNING *
  `;
  const { rows } = await pool.query(sql, [catId, locationId]);
  return rows[0];
};

// ========== 新增：审核与待审核列表 ==========

/**
 * 审核猫咪（管理员）
 */
exports.review = async (id, status) => {
  const sql = `UPDATE cats SET status = $1 WHERE id = $2 RETURNING *`;
  const { rows } = await pool.query(sql, [status, id]);
  return rows[0];
};

/**
 * 获取待审核猫咪列表（管理员）
 */
exports.findPending = async () => {
  const sql = `
    SELECT c.*, u.username, u.nickname
    FROM cats c
    LEFT JOIN users u ON c.submitted_by = u.id
    WHERE c.status = 'pending'
    ORDER BY c.created_at DESC
  `;
  const { rows } = await pool.query(sql);
  return rows;
};