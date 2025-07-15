// src/controllers/orderController.js - 订单业务逻辑控制器
const orderService = require('../service/orderService');

const orderController = {
  // 获取所有订单
  getAllOrders: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const status = req.query.status;

      const result = await orderService.getAllOrders({ page, limit, status });

      res.json({
        success: true,
        data: result.orders,
        pagination: {
          page,
          limit,
          total: result.total,
          totalPages: Math.ceil(result.total / limit)
        },
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: error.message,
        timestamp: new Date().toISOString()
      });
    }
  },

  // 创建新订单
  createOrder: async (req, res) => {
    try {
      const orderData = {
        customerName: req.body.customerName.trim(),
        customerEmail: req.body.customerEmail,
        customerPhone: req.body.customerPhone,
        items: req.body.items,
        totalAmount: parseFloat(req.body.totalAmount),
        shippingAddress: req.body.shippingAddress,
        notes: req.body.notes
      };

      const newOrder = await orderService.createOrder(orderData);

      res.status(201).json({
        success: true,
        message: 'Order created successfully',
        data: newOrder,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: 'Failed to create order',
        message: error.message,
        timestamp: new Date().toISOString()
      });
    }
  },

  // 根据ID获取订单
  getOrderById: async (req, res) => {
    try {
      const orderId = parseInt(req.params.id);
      const order = await orderService.getOrderById(orderId);

      if (!order) {
        return res.status(404).json({
          success: false,
          error: 'Order not found',
          message: `Order with ID ${orderId} does not exist`,
          timestamp: new Date().toISOString()
        });
      }

      res.json({
        success: true,
        data: order,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: error.message,
        timestamp: new Date().toISOString()
      });
    }
  },

  // 更新订单
  updateOrder: async (req, res) => {
    try {
      const orderId = parseInt(req.params.id);
      const updateData = {
        customerName: req.body.customerName?.trim(),
        customerEmail: req.body.customerEmail,
        customerPhone: req.body.customerPhone,
        items: req.body.items,
        totalAmount: parseFloat(req.body.totalAmount),
        shippingAddress: req.body.shippingAddress,
        notes: req.body.notes
      };

      const updatedOrder = await orderService.updateOrder(orderId, updateData);

      if (!updatedOrder) {
        return res.status(404).json({
          success: false,
          error: 'Order not found',
          message: `Order with ID ${orderId} does not exist`,
          timestamp: new Date().toISOString()
        });
      }

      res.json({
        success: true,
        message: 'Order updated successfully',
        data: updatedOrder,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: 'Failed to update order',
        message: error.message,
        timestamp: new Date().toISOString()
      });
    }
  },

  // 删除订单
  deleteOrder: async (req, res) => {
    try {
      const orderId = parseInt(req.params.id);
      const deleted = await orderService.deleteOrder(orderId);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          error: 'Order not found',
          message: `Order with ID ${orderId} does not exist`,
          timestamp: new Date().toISOString()
        });
      }

      res.json({
        success: true,
        message: 'Order deleted successfully',
        data: { id: orderId },
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to delete order',
        message: error.message,
        timestamp: new Date().toISOString()
      });
    }
  },

  // 获取订单状态
  getOrderStatus: async (req, res) => {
    try {
      const orderId = parseInt(req.params.id);
      const status = await orderService.getOrderStatus(orderId);

      if (!status) {
        return res.status(404).json({
          success: false,
          error: 'Order not found',
          timestamp: new Date().toISOString()
        });
      }

      res.json({
        success: true,
        data: { orderId, status },
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: error.message,
        timestamp: new Date().toISOString()
      });
    }
  },

  // 更新订单状态
  updateOrderStatus: async (req, res) => {
    try {
      const orderId = parseInt(req.params.id);
      const { status } = req.body;

      const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid status',
          message: `Status must be one of: ${validStatuses.join(', ')}`,
          timestamp: new Date().toISOString()
        });
      }

      const updated = await orderService.updateOrderStatus(orderId, status);

      if (!updated) {
        return res.status(404).json({
          success: false,
          error: 'Order not found',
          timestamp: new Date().toISOString()
        });
      }

      res.json({
        success: true,
        message: 'Order status updated successfully',
        data: { orderId, status },
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to update order status',
        message: error.message,
        timestamp: new Date().toISOString()
      });
    }
  },

  // 获取订单统计
  getOrderStats: async (req, res) => {
    try {
      const stats = await orderService.getOrderStats();

      res.json({
        success: true,
        data: stats,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to get order statistics',
        message: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }
};

module.exports = orderController;
