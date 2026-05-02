const pool = require('../config/db');

exports.getUserAchievements = async (userId) => {
  const sql = `
    SELECT c.id AS cat_id, c.name, c.color, c.main_photo_url,
           COUNT(ch.id)::int AS checkin_count,
           CASE WHEN COUNT(ch.id) > 0 THEN true ELSE false END AS collected
    FROM cats c
    LEFT JOIN checkins ch ON c.id = ch.cat_id AND ch.user_id = $1
    WHERE c.status = 'approved'
    GROUP BY c.id
    ORDER BY collected DESC, checkin_count DESC
  `;
  const { rows } = await pool.query(sql, [userId]);
  const totalCats = rows.length;
  const collectedCount = rows.filter(r => r.collected).length;
  const allCollected = totalCats > 0 && collectedCount === totalCats;

  return {
    totalCats,
    collectedCount,
    allCollected,
    cats: rows,
  };
};