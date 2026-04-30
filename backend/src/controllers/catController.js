exports.getAllCats = (req, res) => {
  res.json({ message: '猫猫列表（即将从数据库获取）' });
};

exports.createCat = (req, res) => {
  res.status(201).json({ message: '猫咪档案已创建' });
};

exports.getCatById = (req, res) => {
  res.json({ message: `猫咪 ${req.params.id} 的详情` });
};