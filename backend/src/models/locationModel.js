const pool = require('../config/db');

exports.create = async ({ name, latitude, longitude, description }) => {
  const sql = `
    INSERT INTO locations (name, latitude, longitude, description)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `;
  const { rows } = await pool.query(sql, [name, latitude, longitude, description || null]);
  return rows[0];
};

exports.findAll = async () => {
  const sql = `
    SELECT l.*, COUNT(cl.cat_id)::int AS cat_count
    FROM locations l
    LEFT JOIN cat_locations cl ON cl.location_id = l.id
    GROUP BY l.id
    ORDER BY l.id
  `;
  const { rows } = await pool.query(sql);
  return rows;
};

exports.findById = async (id) => {
  const locSql = `SELECT * FROM locations WHERE id = $1`;
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

exports.remove = async (id) => {
  const sql = `DELETE FROM locations WHERE id = $1 RETURNING *`;
  const { rows } = await pool.query(sql, [id]);
  return rows[0];
};