// src/middleware/logger.js - 日志中间件
const logger = (req, res, next) => {
  console.log('#### logger start');
  const start = Date.now();
  const timestamp = new Date().toISOString();

  // 记录请求信息
  console.log(`📝 [${timestamp}] ${req.method} ${req.originalUrl} - IP: ${req.ip}`);

  // 记录请求体（仅在开发环境）
  if (process.env.NODE_ENV === 'development' && req.body && Object.keys(req.body).length > 0) {
    console.log('📋 Request Body:', JSON.stringify(req.body, null, 2));
  }

  // 监听响应完成
  res.on('finish', () => {
    const duration = Date.now() - start;
    const statusColor = res.statusCode >= 400 ? '🔴' : res.statusCode >= 300 ? '🟡' : '🟢';

    console.log(`${statusColor} [${timestamp}] ${res.statusCode} ${req.method} ${req.originalUrl} - ${duration}ms`);

    console.log('#### logger end');
  });

  next();
};

module.exports = logger;
