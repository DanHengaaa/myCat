const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();

// 确保 uploads 目录存在
const uploadDir = path.join(__dirname, '..', '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 配置 multer：限制文件类型和大小
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('仅支持 JPG、PNG、GIF、WebP 格式'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// POST /api/upload（管理员才能上传）
router.post('/', requireAdmin, (req, res) => {
  upload.single('photo')(req, res, (err) => {
    if (err) {
      if (err.message === '仅支持 JPG、PNG、GIF、WebP 格式') {
        return res.status(400).json({ code: 400, message: err.message });
      }
      return res.status(500).json({ code: 500, message: '上传失败' });
    }
    if (!req.file) {
      return res.status(400).json({ code: 400, message: '请选择图片' });
    }
    // 返回可访问的图片路径（相对路径，需要配置静态资源）
    const url = `/uploads/${req.file.filename}`;
    res.json({ code: 200, data: { url } });
  });
});

module.exports = router;