const locationModel = require('../models/locationModel');

/**
 * 获取所有已通过的点位 (公开)
 */
exports.getAll = async (req, res) => {
  try {
    const locations = await locationModel.findAll();
    res.json({ code: 200, data: locations });
  } catch (err) {
    console.error('获取点位列表出错:', err);
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
};

/**
 * 获取点位详情 (公开)
 */
exports.getById = async (req, res) => {
  try {
    const location = await locationModel.findById(req.params.id);
    if (!location) {
      return res.status(404).json({ code: 404, message: '点位不存在' });
    }
    res.json({ code: 200, data: location });
  } catch (err) {
    console.error('获取点位详情出错:', err);
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
};

/**
 * 创建点位（任何登录用户）
 */
exports.create = async (req, res) => {
  try {
    const { name, latitude, longitude, description } = req.body;
    if (!name || latitude === undefined || longitude === undefined) {
      return res.status(400).json({ code: 400, message: '缺少必填字段：name, latitude, longitude' });
    }
    const location = await locationModel.create({
      name,
      latitude,
      longitude,
      description,
      userId: req.user.id
    });
    res.status(201).json({ code: 201, message: '点位已提交，等待管理员审核', data: location });
  } catch (err) {
    console.error('创建点位出错:', err);
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
};

/**
 * 更新点位（管理员）
 */
exports.update = async (req, res) => {
  try {
    const location = await locationModel.update(req.params.id, req.body);
    if (!location) {
      return res.status(400).json({ code: 400, message: '没有可更新的字段或点位不存在' });
    }
    res.json({ code: 200, message: '点位已更新', data: location });
  } catch (err) {
    console.error('更新点位出错:', err);
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
};

/**
 * 删除点位（管理员）
 */
exports.remove = async (req, res) => {
  try {
    const location = await locationModel.remove(req.params.id);
    if (!location) {
      return res.status(404).json({ code: 404, message: '点位不存在' });
    }
    res.json({ code: 200, message: '点位已删除' });
  } catch (err) {
    console.error('删除点位出错:', err);
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
};

/**
 * 审核点位（管理员）
 */
exports.review = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ code: 400, message: '审核状态无效，必须为 approved 或 rejected' });
    }
    const updated = await locationModel.review(req.params.id, status);
    if (!updated) return res.status(404).json({ code: 404, message: '点位不存在' });
    res.json({ code: 200, message: '审核完成', data: updated });
  } catch (err) {
    console.error('审核点位出错:', err);
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
};

/**
 * 获取待审核点位列表（管理员）
 */
exports.getPending = async (req, res) => {
  try {
    const pending = await locationModel.findPending();
    res.json({ code: 200, data: pending });
  } catch (err) {
    console.error('获取待审核点位出错:', err);
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
};

exports.requestDelete = async (req, res) => {
  try {
    const location = await locationModel.requestDelete(req.params.id);
    if (!location) return res.status(404).json({ code: 404, message: '点位不存在' });
    res.json({ code: 200, message: '删除请求已提交' });
  } catch (err) {
    console.error('请求删除点位出错:', err);
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
};

exports.getPendingDeletes = async (req, res) => {
  try {
    const locations = await locationModel.findPendingDeletes();
    res.json({ code: 200, data: locations });
  } catch (err) {
    console.error('获取待删除点位出错:', err);
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
};

exports.reviewDeleteRequest = async (req, res) => {
  try {
    const { action } = req.body;
    if (!['approve', 'reject'].includes(action)) {
      return res.status(400).json({ code: 400, message: '无效操作' });
    }
    const result = await locationModel.reviewDeleteRequest(req.params.id, action);
    res.json({ code: 200, message: action === 'approve' ? '已删除' : '已取消删除请求', data: result.location });
  } catch (err) {
    console.error('审核删除点位出错:', err);
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
};