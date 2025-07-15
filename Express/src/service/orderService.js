// src/services/orderService.js - 订单业务逻辑服务层
// 注意：这里使用内存存储，实际项目中应该连接数据库

let orders = [
  {
    id: 1,
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    customerPhone: '+1234567890',
    items: [
      { productId: 1, productName: 'iPhone 14', quantity: 1, price: 999.99 },
      { productId: 2, productName: 'AirPods Pro', quantity: 1, price: 249.99 }
    ],
    totalAmount: 1249.98,
    status: 'confirmed',
    shippingAddress: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    },
    notes: 'Please handle with care',
    createdAt: new Date('2024-01-15T10:30:00Z'),
    updatedAt: new Date('2024-01-15T14:20:00Z')
  },
  {
    id: 2,
    customerName: 'Jane Smith',
    customerEmail: 'jane@example.com',
    customerPhone: '+1234567891',
    items: [
      { productId: 3, productName: 'MacBook Pro', quantity: 1, price: 2399.99 }
    ],
    totalAmount: 2399.99,
    status: 'processing',
    shippingAddress: {
      street: '456 Oak Ave',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90210',
      country: 'USA'
    },
    notes: '',
    createdAt: new Date('2024-01-16T09:15:00Z'),
    updatedAt: new Date('2024-01-16T09:15:00Z')
  }
];

let nextOrderId = 3;

const orderService = {
  // 获取所有订单
  getAllOrders: async ({ page = 1, limit = 10, status } = {}) => {
    let filteredOrders = [...orders];
    
    // 按状态筛选
    if (status) {
      filteredOrders = filteredOrders.filter(order => order.status === status);
    }
    
    // 排序（最新的在前）
    filteredOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    // 分页
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedOrders = filteredOrders.slice(startIndex, endIndex);
    
    return {
      orders: paginatedOrders,
      total: filteredOrders.length
    };
  },

  // 创建订单
  createOrder: async (orderData) => {
    // 数据验证
    if (!orderData.customerName || !orderData.items || !orderData.totalAmount) {
      throw new Error('Missing required fields');
    }

    // 验证商品项目
    if (!Array.isArray(orderData.items) || orderData.items.length === 0) {
      throw new Error('Items must be a non-empty array');
    }

    // 验证每个商品项目
    for (const item of orderData.items) {
      if (!item.productName || !item.quantity || !item.price) {
        throw new Error('Each item must have productName, quantity, and price');
      }
      if (item.quantity <= 0 || item.price <= 0) {
        throw new Error('Quantity and price must be greater than 0');
      }
    }

    // 计算总金额验证
    const calculatedTotal = orderData.items.reduce((sum, item) => {
      return sum + (item.quantity * item.price);
    }, 0);

    if (Math.abs(calculatedTotal - orderData.totalAmount) > 0.01) {
      throw new Error('Total amount does not match calculated total');
    }

    const newOrder = {
      id: nextOrderId++,
      customerName: orderData.customerName,
      customerEmail: orderData.customerEmail || '',
      customerPhone: orderData.customerPhone || '',
      items: orderData.items.map(item => ({
        productId: item.productId || Date.now() + Math.random(),
        productName: item.productName,
        quantity: item.quantity,
        price: item.price
      })),
      totalAmount: orderData.totalAmount,
      status: 'pending',
      shippingAddress: orderData.shippingAddress || {},
      notes: orderData.notes || '',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    orders.push(newOrder);
    return newOrder;
  },

  // 根据ID获取订单
  getOrderById: async (orderId) => {
    return orders.find(order => order.id === orderId);
  },

  // 更新订单
  updateOrder: async (orderId, updateData) => {
    const orderIndex = orders.findIndex(order => order.id === orderId);
    
    if (orderIndex === -1) {
      return null;
    }

    // 验证更新数据
    if (updateData.items && Array.isArray(updateData.items)) {
      for (const item of updateData.items) {
        if (!item.productName || !item.quantity || !item.price) {
          throw new Error('Each item must have productName, quantity, and price');
        }
      }
    }

    const existingOrder = orders[orderIndex];
    const updatedOrder = {
      ...existingOrder,
      ...updateData,
      id: orderId, // 确保ID不被覆盖
      updatedAt: new Date()
    };

    orders[orderIndex] = updatedOrder;
    return updatedOrder;
  },

  // 删除订单
  deleteOrder: async (orderId) => {
    const orderIndex = orders.findIndex(order => order.id === orderId);
    
    if (orderIndex === -1) {
      return false;
    }

    orders.splice(orderIndex, 1);
    return true;
  },

  // 获取订单状态
  getOrderStatus: async (orderId) => {
    const order = orders.find(order => order.id === orderId);
    return order ? order.status : null;
  },

  // 更新订单状态
  updateOrderStatus: async (orderId, status) => {
    const orderIndex = orders.findIndex(order => order.id === orderId);
    
    if (orderIndex === -1) {
      return false;
    }

    orders[orderIndex].status = status;
    orders[orderIndex].updatedAt = new Date();
    return true;
  },

  // 获取订单统计
  getOrderStats: async () => {
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    
    const statusCounts = orders.reduce((counts, order) => {
      counts[order.status] = (counts[order.status] || 0) + 1;
      return counts;
    }, {});

    const recentOrders = orders
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

    return {
      totalOrders,
      totalRevenue: Math.round(totalRevenue * 100) / 100, // 保留两位小数
      statusDistribution: statusCounts,
      recentOrders: recentOrders.map(order => ({
        id: order.id,
        customerName: order.customerName,
        totalAmount: order.totalAmount,
        status: order.status,
        createdAt: order.createdAt
      }))
    };
  }
};

module.exports = orderService;