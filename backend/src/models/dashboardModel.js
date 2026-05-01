const pool = require('../config/db');

/**
 * 获取所有看板统计数据
 */
exports.getStats = async () => {
  const result = {};

  // 流浪猫总数
  const { rows: catRows } = await pool.query('SELECT COUNT(*)::int AS total FROM cats');
  result.totalCats = catRows[0].total;

  // 点位总数
  const { rows: locRows } = await pool.query('SELECT COUNT(*)::int AS total FROM locations');
  result.totalLocations = locRows[0].total;

  // 打卡总数
  const { rows: checkinRows } = await pool.query('SELECT COUNT(*)::int AS total FROM checkins');
  result.totalCheckins = checkinRows[0].total;

  // 最近一周投喂次数（type = 'feeding'）
  const { rows: feedRows } = await pool.query(
    `SELECT COUNT(*)::int AS total FROM checkins WHERE type = 'feeding' AND created_at >= NOW() - INTERVAL '7 days'`
  );
  result.feedingCountLastWeek = feedRows[0].total;

  // 热门猫咪 TOP5（按打卡次数）
  const { rows: topCats } = await pool.query(`
    SELECT c.id AS cat_id, c.name, COUNT(ch.id)::int AS checkin_count
    FROM cats c
    LEFT JOIN checkins ch ON c.id = ch.cat_id
    GROUP BY c.id
    ORDER BY checkin_count DESC
    LIMIT 5
  `);
  result.topCats = topCats;

  // 热门点位 TOP5（按打卡次数）
  const { rows: topLocations } = await pool.query(`
    SELECT l.id AS location_id, l.name, COUNT(ch.id)::int AS checkin_count
    FROM locations l
    LEFT JOIN checkins ch ON l.id = ch.location_id
    GROUP BY l.id
    ORDER BY checkin_count DESC
    LIMIT 5
  `);
  result.topLocations = topLocations;

  // 活跃用户数（最近30天内有打卡记录的用户）
  const { rows: activeRows } = await pool.query(
    `SELECT COUNT(DISTINCT user_id)::int AS total FROM checkins WHERE created_at >= NOW() - INTERVAL '30 days'`
  );
  result.activeUsers = activeRows[0].total;

  return result;
};