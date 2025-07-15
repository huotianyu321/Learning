// src/routes/order.js - 订单相关路由
const express = require('express');
const router = express.Router();
const orderController = require('../controller/orderController');

// 中间件：验证订单ID格式
const validateOrderId = (req, res, next) => {
  const { id } = req.params;
  if (id && !/^\d+$/.test(id)) {
    return res.status(400).json({
      error: 'Invalid order ID',
      message: 'Order ID must be a number',
      timestamp: new Date().toISOString()
    });
  }
  next();
};

// 中间件：验证订单数据
const validateOrderData = (req, res, next) => {
  const { customerName, items, totalAmount } = req.body;
  
  const errors = [];
  
  if (!customerName || customerName.trim().length === 0) {
    errors.push('Customer name is required');
  }
  
  if (!items || !Array.isArray(items) || items.length === 0) {
    errors.push('Items array is required and cannot be empty');
  }
  
  if (totalAmount === undefined || totalAmount === null || totalAmount <= 0) {
    errors.push('Total amount must be greater than 0');
  }
  
  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Validation failed',
      messages: errors,
      timestamp: new Date().toISOString()
    });
  }
  
  next();
};

// 路由定义
router.get('/', orderController.getAllOrders);
router.post('/', validateOrderData, orderController.createOrder);
router.get('/:id', validateOrderId, orderController.getOrderById);
router.put('/:id', validateOrderId, validateOrderData, orderController.updateOrder);
router.delete('/:id', validateOrderId, orderController.deleteOrder);

// 订单状态相关路由
router.get('/:id/status', validateOrderId, orderController.getOrderStatus);
router.patch('/:id/status', validateOrderId, orderController.updateOrderStatus);

// 订单统计路由
router.get('/stats/summary', orderController.getOrderStats);

module.exports = router;