const commentModel = require('../models/commentModel');

exports.create = async (req, res) => {
  try {
    const { target_type, target_id, content, photo_url } = req.body;
    if (!['cat', 'checkin'].includes(target_type)) {
      return res.status(400).json({ code: 400, message: 'target_type 必须为 cat 或 checkin' });
    }
    const comment = await commentModel.create({
      userId: req.user.id,
      targetType: target_type,
      targetId: target_id,
      content,
      photoUrl: photo_url || null,
    });
    res.status(201).json({ code: 201, message: '评论成功', data: comment });
  } catch (err) {
    console.error('发表评论出错:', err);
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
};

exports.list = async (req, res) => {
  try {
    const { target_type, target_id, page, limit } = req.query;
    if (!target_type || !target_id) {
      return res.status(400).json({ code: 400, message: '缺少 target_type 或 target_id' });
    }
    const result = await commentModel.findByTarget({
      targetType: target_type,
      targetId: parseInt(target_id),
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 20,
    });
    res.json({ code: 200, data: result });
  } catch (err) {
    console.error('获取评论出错:', err);
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
};

// 登录用户可删除自己的评论，管理员可删除任意评论
exports.remove = async (req, res) => {
  try {
    const comment = await commentModel.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ code: 404, message: '评论不存在' });
    }
    // 仅作者本人或管理员可以删除
    if (comment.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ code: 403, message: '无权删除此评论' });
    }
    await commentModel.remove(req.params.id);
    res.json({ code: 200, message: '评论已删除' });
  } catch (err) {
    console.error('删除评论出错:', err);
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
};