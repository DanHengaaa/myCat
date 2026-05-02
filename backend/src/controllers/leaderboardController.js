const leaderboardModel = require('../models/leaderboardModel');

exports.catLeaderboard = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const data = await leaderboardModel.getCatLeaderboard(limit);
    res.json({ code: 200, data });
  } catch (err) {
    console.error('猫咪排行榜出错:', err);
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
};

exports.userLeaderboard = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const type = req.query.type || 'all';   // all, sighting, feeding
    const data = await leaderboardModel.getUserLeaderboard(type, limit);
    res.json({ code: 200, data });
  } catch (err) {
    console.error('用户排行榜出错:', err);
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
};