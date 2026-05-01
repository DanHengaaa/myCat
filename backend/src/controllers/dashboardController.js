const dashboardModel = require('../models/dashboardModel');

exports.getStats = async (req, res) => {
  try {
    const stats = await dashboardModel.getStats();
    res.json({ code: 200, data: stats });
  } catch (err) {
    console.error('获取看板数据出错:', err);
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
};