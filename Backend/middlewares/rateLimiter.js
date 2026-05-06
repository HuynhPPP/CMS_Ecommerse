const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 5000, // Tối đa 2000 request mỗi cửa sổ 15 phút cho mỗi IP
  message: {
    message: 'Quá nhiều yêu cầu từ IP này, vui lòng thử lại sau 15 phút',
  },
  standardHeaders: true, // Trả về thông tin giới hạn trong `RateLimit-*` headers
  legacyHeaders: false, // Tắt `X-RateLimit-*` headers
});

// Giới hạn khắt khe hơn cho login và register
const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 giờ
  max: 20, // Tối đa 20 lần thử cho mỗi IP mỗi giờ
  message: {
    message: 'Quá nhiều lần thử đăng nhập/đăng ký, vui lòng thử lại sau 1 giờ',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  apiLimiter,
  authLimiter,
};
