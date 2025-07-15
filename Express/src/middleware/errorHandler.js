// src/middleware/errorHandler.js - 错误处理中间件
const errorHandler = (err, req, res, next) => {
  console.error('🚨 ###Error occurred:', err);

  // 默认错误信息
  let error = {
    success: false,
    error: 'Internal Server Error',
    message: 'Something went wrong!',
    timestamp: new Date().toISOString()
  };

  // 根据错误类型定制响应
  if (err.name === 'ValidationError') {
    error.error = 'Validation Error';
    error.message = err.message;
    return res.status(400).json(error);
  }

  if (err.name === 'CastError') {
    error.error = 'Invalid ID format';
    error.message = 'The provided ID is not valid';
    return res.status(400).json(error);
  }

  if (err.code === 11000) {
    error.error = 'Duplicate field value';
    error.message = 'This resource already exists';
    return res.status(400).json(error);
  }

  // CORS 错误
  if (err.message && err.message.includes('CORS')) {
    error.error = 'CORS Error';
    error.message = err.message;
    return res.status(403).json(error);
  }

  // JWT 错误
  if (err.name === 'JsonWebTokenError') {
    error.error = 'Invalid Token';
    error.message = 'Authentication token is invalid';
    return res.status(401).json(error);
  }

  if (err.name === 'TokenExpiredError') {
    error.error = 'Token Expired';
    error.message = 'Authentication token has expired';
    return res.status(401).json(error);
  }

  // 开发环境显示详细错误信息
  if (process.env.NODE_ENV === 'development') {
    error.stack = err.stack;
    error.details = err;
  }

  // 生产环境隐藏敏感信息
  if (process.env.NODE_ENV === 'production') {
    delete error.stack;
    delete error.details;
  }

  res.status(err.statusCode || 500).json(error);
};

module.exports = errorHandler;
