const checkinModel = require('../models/checkinModel');

/**
 * 用户打卡
 * POST /api/checkins
 */
exports.create = async (req, res) => {
  try {
    const { type, cat_id, location_id, photo_url, note } = req.body;
    if (!type || !['sighting', 'feeding'].includes(type)) {
      return res.status(400).json({ code: 400, message: '打卡类型无效，必须为 sighting 或 feeding' });
    }

    const checkin = await checkinModel.create({
      userId: req.user.id,          // 来自 auth 中间件
      type,
      catId: cat_id,
      locationId: location_id,
      photoUrl: photo_url,
      note
    });

    res.status(201).json({ code: 201, message: '打卡成功', data: checkin });
  } catch (err) {
    console.error('创建打卡记录出错:', err);
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
};

/**
 * 查询打卡记录（支持按猫咪、用户、类型、状态筛选）
 * GET /api/checkins?cat_id=1&type=sighting&status=approved&page=1&limit=10
 */
exports.list = async (req, res) => {
  try {
    const result = await checkinModel.findMany(req.query);
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