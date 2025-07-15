// server.js - 应用入口文件
require('dotenv').config(); // 加载 .env 配置到 process.env
const express = require('express');
const cors = require('cors');
// const path = require('path');

//
const corsOptions = require('./src/config/corsOptions'); // 跨域配置
const statusCodes = require('./src/config/statusCodes'); // 状态码配置

// 导入自定义中间件
const logger = require('./src/middleware/logger');
const errorHandler = require('./src/middleware/errorHandler');

// 导入路由
const basicRoutes = require('./src/routes/basic');
const helloRoutes = require('./src/routes/hello');
const orderRoutes = require('./src/routes/order');

const app = express();
const PORT = process.env.PORT || 3000;

// 基础中间件
app.use(cors(corsOptions)); // 允许跨域请求, 跨域规则可配置
app.use(express.json()); // 解析 JSON 格式的请求体
app.use(express.urlencoded({ extended: true })); // 解析 URL 编码的请求体

// 自定义中间件
// app.use(logger); // 自定义日志
// app.use(errorHandler); // 自定义全局错误处理

// 路由配置
app.use('/', basicRoutes); // 以'/'开头的路由都交由basicRoutes处理
app.use('/api/hello', helloRoutes); // Hello World相关路由
app.use('/api/order', orderRoutes); // 订单相关路由
// 404路由, 放在最后
app.use('*', (req, res) => {
  res.status(statusCodes.NOT_FOUND).json({
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.originalUrl}`,
    timestamp: new Date().toISOString()
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

module.exports = app;
