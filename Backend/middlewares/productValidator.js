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

const productValidator = {
  validateProduct: [
    body('name').notEmpty().escape().withMessage('Vui lòng nhập Tên sản phẩm'),
    body('categoryId').isInt().escape().withMessage('Vui lòng nhập Danh mục'),
    body('colors').optional().isArray().escape().withMessage('Vui lòng nhập Màu sắc'),
    body('description').optional().isString().escape().withMessage('Vui lòng nhập Mô tả'),
    handleValidationErrors,
  ],

  validateId: [
    param('id').isInt().escape().withMessage('Vui lòng nhập ID'),
    handleValidationErrors,
  ],
};

module.exports = productValidator;
