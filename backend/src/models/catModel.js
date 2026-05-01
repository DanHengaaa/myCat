// 猫咪数据库操作
const pool = require('../config/db');

/**
 * 创建猫咪档案
 */
exports.create = async (catData) => {
  const { name, gender, color, personality_tags, health_status, neutered, description, main_photo_url } = catData;
  const sql = `
    INSERT INTO cats (name, gender, color, personality_tags, health_status, neutered, description, main_photo_url)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
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
    main_photo_url || null
  ]);
  return rows[0];
};

/**
 * 分页查询猫咪列表（可选筛选）
 * @param {Object} filters - { page, limit, gender, neutered }
 */
exports.findAll = async (filters = {}) => {
  const page = parseInt(filters.page) || 1;
  const limit = parseInt(filters.limit) || 10;
  const offset = (page - 1) * limit;
  const conditions = [];
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

  const whereClause = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';

  // 查询总数
  const countSql = `SELECT COUNT(*) FROM cats ${whereClause}`;
  const { rows: countRows } = await pool.query(countSql, values);
  const total = parseInt(countRows[0].count);

  // 查询数据
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
 * 根据 ID 获取猫咪详情，同时返回常驻点位
 */
exports.findById = async (id) => {
  // 查询猫咪基本信息
  const catSql = `SELECT * FROM cats WHERE id = $1`;
  const { rows: catRows } = await pool.query(catSql, [id]);
  if (catRows.length === 0) return null;
  const cat = catRows[0];

  // 查询常驻点位
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
  if (fields.length === 0) return null; // 无可更新字段

  // 自动更新 updated_at
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
 * 删除猫咪（CASCADE 会自动删除关联的 cat_locations、打卡、评论等）
 */
exports.remove = async (id) => {
  const sql = `DELETE FROM cats WHERE id = $1 RETURNING *`;
  const { rows } = await pool.query(sql, [id]);
  return rows[0];
};

/**
 * 为猫咪添加常驻点位
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
 * 移除猫咪常驻点位
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