const catModel = require('../models/catModel');

/**
 * 获取猫咪列表 (公开)
 * GET /api/cats?page=1&limit=10&gender=母&neutered=true
 */
exports.getAll = async (req, res) => {
  try {
    const result = await catModel.findAll(req.query);
    res.json({ code: 200, data: result });
  } catch (err) {
    console.error('获取猫咪列表出错:', err);
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
};

/**
 * 获取猫咪详情 (公开)
 * GET /api/cats/:id
 */
exports.getById = async (req, res) => {
  try {
    const cat = await catModel.findById(req.params.id);
    if (!cat) {
      return res.status(404).json({ code: 404, message: '猫咪不存在' });
    }
    res.json({ code: 200, data: cat });
  } catch (err) {
    console.error('获取猫咪详情出错:', err);
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
};

/**
 * 创建猫咪档案 (管理员)
 * POST /api/cats
 */
exports.create = async (req, res) => {
  try {
    const catData = { ...req.body, userId: req.user.id }; // 将提交者ID传入
    const cat = await catModel.create(catData);
    res.status(201).json({ code: 201, message: '猫咪档案已提交，等待管理员审核', data: cat });
  } catch (err) {
    console.error('创建猫咪出错:', err);
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
};

/**
 * 更新猫咪信息 (管理员)
 * PUT /api/cats/:id
 */
exports.update = async (req, res) => {
  try {
    const cat = await catModel.update(req.params.id, req.body);
    if (!cat) {
      return res.status(400).json({ code: 400, message: '没有可更新的字段或猫咪不存在' });
    }
    res.json({ code: 200, message: '猫咪信息已更新', data: cat });
  } catch (err) {
    console.error('更新猫咪出错:', err);
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
};

/**
 * 删除猫咪 (管理员)
 * DELETE /api/cats/:id
 */
exports.remove = async (req, res) => {
  try {
    const cat = await catModel.remove(req.params.id);
    if (!cat) {
      return res.status(404).json({ code: 404, message: '猫咪不存在' });
    }
    res.json({ code: 200, message: '猫咪已删除' });
  } catch (err) {
    console.error('删除猫咪出错:', err);
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
};

/**
 * 添加常驻点位 (管理员)
 * POST /api/cats/:id/locations
 */
exports.addLocation = async (req, res) => {
  try {
    const { location_id } = req.body;
    if (!location_id) {
      return res.status(400).json({ code: 400, message: '缺少 location_id' });
    }
    const result = await catModel.addLocation(req.params.id, location_id);
    res.status(201).json({ code: 201, message: '点位关联成功', data: result });
  } catch (err) {
    console.error('添加点位出错:', err);
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
};

/**
 * 移除常驻点位 (管理员)
 * DELETE /api/cats/:id/locations/:locationId
 */
exports.removeLocation = async (req, res) => {
  try {
    const result = await catModel.removeLocation(req.params.id, req.params.locationId);
    if (!result) {
      return res.status(404).json({ code: 404, message: '该关联不存在' });
    }
    res.json({ code: 200, message: '点位关联已移除' });
  } catch (err) {
    console.error('移除点位出错:', err);
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
};

exports.review = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ code: 400, message: '审核状态无效' });
    }
    const cat = await catModel.review(req.params.id, status);
    if (!cat) return res.status(404).json({ code: 404, message: '猫咪不存在' });
    res.json({ code: 200, message: '审核完成', data: cat });
  } catch (err) { /* ... */ }
};

// ... 原有的 getAll, getById, create, update, remove, addLocation, removeLocation 保持不变

/**
 * 审核猫咪（管理员）
 */
exports.review = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ code: 400, message: '审核状态无效，必须为 approved 或 rejected' });
    }
    const cat = await catModel.review(req.params.id, status);
    if (!cat) {
      return res.status(404).json({ code: 404, message: '猫咪不存在' });
    }
    res.json({ code: 200, message: '审核完成', data: cat });
  } catch (err) {
    console.error('审核猫咪出错:', err);
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
};

/**
 * 获取待审核猫咪列表（管理员）
 */
exports.getPending = async (req, res) => {
  try {
    const cats = await catModel.findPending();
    res.json({ code: 200, data: cats });
  } catch (err) {
    console.error('获取待审核猫咪出错:', err);
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
};