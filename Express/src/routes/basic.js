// src/routes/basic.js - 基础接口路由
const express = require('express');
const router = express.Router();

const statusCodes = require('../config/statusCodes');

// API信息接口
router.get('/', (req, res) => {
  res.json({
    name: 'Express.js API Server by tianyu.huo',
    version: '1.0.0',
    description: 'RESTful API with modular structure',
    endpoints: {
      basic: {
        'GET /': 'API information',
        'GET /health': 'Health check',
        'GET /status': 'Server status'
      },
      orders: {
        'GET /api/orders': 'Get all orders',
        'POST /api/orders': 'Create new order',
        'GET /api/orders/:id': 'Get order by ID',
        'PUT /api/orders/:id': 'Update order',
        'DELETE /api/orders/:id': 'Delete order'
      }
    },
    timestamp: new Date().toISOString()
  });
});

// 健康检查接口
router.get('/health', (req, res) => {
  const healthCheck = {
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    memory: process.memoryUsage(),
    environment: process.env.NODE_ENV || 'development',
    version: process.version
  };

  res.status(statusCodes.OK).json(healthCheck);
});

// 服务器状态接口
router.get('/status', (req, res) => {
  res.json({
    server: 'running',
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(process.uptime())} seconds`,
    environment: process.env.NODE_ENV || 'development',
    pid: process.pid
  });
});

module.exports = router;
