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

const categoryValidator = {
  validateCategory: [
    body('name').notEmpty().escape().withMessage('Tên danh mục không được để trống'),
    body('slug').notEmpty().escape().withMessage('Slug không được để trống'),
    body('isActive').optional().isBoolean().escape().withMessage('Trạng thái phải là true hoặc false'),
    handleValidationErrors,
  ],

  validateId: [
    param('id').isInt().withMessage('ID phải là số nguyên'),
    handleValidationErrors,
  ],
};

module.exports = categoryValidator;
