const checkinModel = require('../models/checkinModel');
const pool = require('../config/db');

/**
 * 用户打卡
 * POST /api/checkins
 */
exports.create = async (req, res) => {
  try {
    const { type, cat_id, location_id, photo_url, note, latitude, longitude } = req.body;
    if (!type || !['sighting', 'feeding'].includes(type)) {
      return res.status(400).json({ code: 400, message: '打卡类型无效' });
    }
    const checkin = await checkinModel.create({
      userId: req.user.id,
      type,
      catId: cat_id,
      locationId: location_id,
      photoUrl: photo_url,
      note,
      latitude,
      longitude,
    });
    res.status(201).json({ code: 201, message: '打卡成功', data: checkin });
  } catch (err) {
    console.error('创建打卡记录出错:', err);
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
};

exports.list = async (req, res) => {
  try {
    const { cat_id, user_id, type, status, page, limit, date } = req.query;
    const result = await checkinModel.findMany({
      catId: cat_id,
      userId: user_id,
      type,
      status,
      page,
      limit,
      date,
    });
    res.json({ code: 200, data: result });
  } catch (err) {
    console.error('查询打卡记录出错:', err);
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
};



/**
 * 审核打卡（管理员）
 * PUT /api/checkins/:id/review
 */
exports.review = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ code: 400, message: '审核状态无效，必须为 approved 或 rejected' });
    }

    const updated = await checkinModel.review(req.params.id, status, req.user.id);
    if (!updated) {
      return res.status(404).json({ code: 404, message: '打卡记录不存在' });
    }
    res.json({ code: 200, message: '审核完成', data: updated });
  } catch (err) {
    console.error('审核打卡出错:', err);
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
};

/**
 * 获取猫咪轨迹（公开）
 * GET /api/checkins/trajectory/:catId
 */
exports.trajectory = async (req, res) => {
  try {
    const points = await checkinModel.getTrajectory(req.params.catId);
    res.json({ code: 200, data: { cat_id: req.params.catId, points } });
  } catch (err) {
    console.error('获取轨迹出错:', err);
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
};

exports.todayWithCoords = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const sql = `
  SELECT ch.*, u.nickname AS user_nickname, c.name AS cat_name,
         COALESCE(ch.latitude, l.latitude) AS latitude,
         COALESCE(ch.longitude, l.longitude) AS longitude,
         c.main_photo_url AS cat_photo
  FROM checkins ch
  LEFT JOIN users u ON ch.user_id = u.id
  LEFT JOIN cats c ON ch.cat_id = c.id
  LEFT JOIN locations l ON ch.location_id = l.id
  WHERE ch.created_at::date = $1
  ORDER BY ch.created_at DESC
`;
    const { rows } = await pool.query(sql, [today]);
    res.json({ code: 200, data: rows });
  } catch (err) {
    console.error('获取今日打卡出错:', err);
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
};

exports.deleteOwn = async (req, res) => {
  try {
    // 先查找打卡记录，确保是本人
    const checkin = await checkinModel.findById(req.params.id); // 需要先有 findById
    if (!checkin) return res.status(404).json({ code: 404, message: '打卡记录不存在' });
    if (checkin.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ code: 403, message: '无权删除' });
    }
    await checkinModel.remove(req.params.id);
    res.json({ code: 200, message: '已删除' });
  } catch (err) {
    console.error('删除打卡记录出错:', err);
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
};

exports.heatmap = async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const sql = `
      SELECT ch.latitude, ch.longitude
      FROM checkins ch
      JOIN locations l ON ch.location_id = l.id
      WHERE ch.latitude IS NOT NULL AND ch.longitude IS NOT NULL
        AND ch.created_at >= NOW() - INTERVAL '${days} days'
      UNION ALL
      SELECT ch.latitude, ch.longitude
      FROM checkins ch
      WHERE ch.location_id IS NULL
        AND ch.latitude IS NOT NULL AND ch.longitude IS NOT NULL
        AND ch.created_at >= NOW() - INTERVAL '${days} days'
    `;
    const { rows } = await pool.query(sql);
    // 返回格式：[[lat, lng, intensity], ...]
    const points = rows.map(row => [row.latitude, row.longitude, 1]); // 强度固定为1，也可根据 type 加权
    res.json({ code: 200, data: points });
  } catch (err) {
    console.error('获取热力数据失败:', err);
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
};