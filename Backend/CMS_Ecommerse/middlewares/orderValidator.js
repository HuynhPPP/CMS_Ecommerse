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

const orderValidator = {
  validateCreateOrder: [
    body('userId').isInt().escape().withMessage('Vui lòng chọn tài khoản'),
    body('totalAmount').isFloat({ min: 0 }).escape().withMessage('Tổng tiền không hợp lệ'),
    body('items').isArray({ min: 1 }).withMessage('Danh sách sản phẩm không được để trống'),
    body('items.*.productVariantId').isInt().escape().withMessage('ID biến thể sản phẩm phải là số nguyên'),
    body('items.*.quantity').isInt({ min: 1 }).escape().withMessage('Số lượng sản phẩm phải ít nhất là 1'),
    body('items.*.price').isFloat({ min: 0 }).escape().withMessage('Giá sản phẩm không hợp lệ'),

    // Address validation (check either in addressData or root)
    body('phone').optional().notEmpty().escape().withMessage('Vui lòng nhập Số điện thoại'),
    body('email').optional().isEmail().escape().withMessage('Email không hợp lệ'),

    handleValidationErrors,
  ],

  validateUpdateStatus: [
    param('id').isInt().escape().withMessage('ID đơn hàng phải là số nguyên'),
    body('status').notEmpty().escape().withMessage('Trạng thái không được để trống'),
    handleValidationErrors,
  ],

  validateId: [
    param('id').isInt().escape().withMessage('ID đơn hàng phải là số nguyên'),
    handleValidationErrors,
  ],

  validateUserId: [
    param('userId').isInt().escape().withMessage('User ID phải là số nguyên'),
    handleValidationErrors,
  ],
};

module.exports = orderValidator;
