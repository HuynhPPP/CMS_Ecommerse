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

const cartValidator = {
  validateAddToCart: [
    body('userId').isInt().escape().withMessage('Vui lòng chọn tài khoản'),
    body('productId').isInt().escape().withMessage('Vui lòng chọn sản phẩm'),
    body('quantity').isInt({ min: 1 }).escape().withMessage('Số lượng phải là số nguyên dương'),
    handleValidationErrors,
  ],

  validateGetCart: [
    param('userId').isInt().escape().withMessage('Vui lòng chọn tài khoản'),
    handleValidationErrors,
  ],

  validateDeleteItem: [
    body('cartItemId').isInt().escape().withMessage('Cart Item ID phải là số nguyên'),
    handleValidationErrors,
  ],

  validateClearCart: [
    body('userId').isInt().escape().withMessage('Vui lòng chọn tài khoản'),
    handleValidationErrors,
  ],
};

module.exports = cartValidator;
