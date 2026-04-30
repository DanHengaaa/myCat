require('dotenv').config();
require('./config/db');          // ← 加上这一行，启动时就会测试并连接数据库
const app = require('./app');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});