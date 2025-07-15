// 跨域请求配置
const allowedOrigins = {
  development: ['http://localhost:3000'],
  production: ['https://your-frontend.com ', 'https://admin.yourapp.com '],
};

const corsOptions = {
  origin: (origin, callback) => {
    const env = process.env.NODE_ENV || 'development'; // 获取当前的环境, development or production
    const whitelist = allowedOrigins[env]; 

    if (!origin || whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['X-Custom-Header'],
};

module.exports = corsOptions;