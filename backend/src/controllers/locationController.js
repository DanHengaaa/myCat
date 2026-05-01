const locationModel = require('../models/locationModel');

exports.getAll = async (req, res) => {
  try {
    const locations = await locationModel.findAll();
    res.json({ code: 200, data: locations });
  } catch (err) {
    console.error('获取点位列表出错:', err);
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
};

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

exports.create = async (req, res) => {
  try {
    const { name, latitude, longitude, description } = req.body;
    if (!name || latitude === undefined || longitude === undefined) {
      return res.status(400).json({ code: 400, message: '缺少必填字段：name, latitude, longitude' });
    }
    const location = await locationModel.create({ name, latitude, longitude, description });
    res.status(201).json({ code: 201, message: '点位创建成功', data: location });
  } catch (err) {
    console.error('创建点位出错:', err);
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
};

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