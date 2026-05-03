const { body, param, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: errors.array()[0].msg,
      errors: errors.array(),
    });
  }
  next();
};

const userValidator = {
  validateRegister: [
    body('username').notEmpty().escape().withMessage('Vui lòng nhập tên người dùng'),
    body('email').isEmail().escape().withMessage('Email không hợp lệ'),
    body('password').isLength({ min: 6 }).escape().withMessage('Mật khẩu ít nhất 6 ký tự'),
    handleValidationErrors,
  ],

  validateLogin: [
    body('email').notEmpty().escape().withMessage('Vui lòng nhập Email'),
    body('password').notEmpty().escape().withMessage('Vui lòng nhập Mật khẩu'),
    handleValidationErrors,
  ],

  validateId: [
    param('id').isInt().withMessage('ID phải là số nguyên'),
    handleValidationErrors,
  ],

  validateUpdate: [
    param('id').isInt().withMessage('ID phải là số nguyên'),
    body('email').optional().isEmail().escape().withMessage('Email không hợp lệ'),
    body('username').optional().notEmpty().escape().withMessage('Tên đăng nhập không được để trống'),
    body('password').optional().isLength({ min: 6 }).escape().withMessage('Mật khẩu ít nhất 6 ký tự'),
    body('role').optional().isIn(['ADMIN', 'USER']).escape().withMessage('Role không hợp lệ'),
    body('isActive').optional().isBoolean().escape().withMessage('Trạng thái phải là true hoặc false'),
    handleValidationErrors,
  ],
};

module.exports = userValidator;
