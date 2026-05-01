const achievementModel = require('../models/achievementModel');

exports.getAchievements = async (req, res) => {
  try {
    const data = await achievementModel.getUserAchievements(req.user.id);
    res.json({ code: 200, data });
  } catch (err) {
    console.error('获取成就数据出错:', err);
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
};