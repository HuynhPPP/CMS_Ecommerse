const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET || 'mysecretkey', (err, user) => {
      if (err) {
        return res.status(403).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
      }
      req.user = user; // Lưu thông tin user (id, role) vào request
      next();
    });
  } else {
    return res.status(401).json({ message: 'Không tìm thấy Token xác thực' });
  }
};

const verifyAdmin = (req, res, next) => {
  // Tạm thời bỏ qua xác thực Admin cho Dashboard nội bộ
  // Sau này cần bật lại, thay bằng đoạn code verifyToken()
  next();
};

module.exports = {
  verifyToken,
  verifyAdmin,
};
