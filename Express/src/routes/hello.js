const express = require('express');
const router = express.Router();

const statusCodes = require('../config/statusCodes');

// Hello World接口（保留之前的功能）
router.get('/', (req, res) => {
  res.json({
    message: 'Hello World!',
    timestamp: new Date().toISOString(),
    status: 'success'
  });
});

// 带参数的Hello接口
router.get('/:name', (req, res) => {
  const { name } = req.params;
  res.json({
    message: `Hello, ${name}!`,
    timestamp: new Date().toISOString(),
    status: 'success'
  });
});

// POST方式的Hello接口
router.post('/', (req, res) => {
  const { name = 'World' } = req.body;
  res.json({
    message: `Hello, ${name}!`,
    method: 'POST',
    timestamp: new Date().toISOString(),
    status: 'success'
  });
});

module.exports = router;
