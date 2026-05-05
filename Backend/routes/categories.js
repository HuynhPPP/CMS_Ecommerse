const express = require('express');
const CategoriesControllers = require('../controllers/categories');
const { verifyAdmin } = require('../middlewares/auth');
const router = express.Router();

const categoryValidator = require('../middlewares/categoryValidator');

router.post('/', verifyAdmin, categoryValidator.validateCategory, CategoriesControllers.createCategory);

router.get('/', CategoriesControllers.getCategories);

router.get('/:id', categoryValidator.validateId, CategoriesControllers.getCategoryById);

router.put('/:id', verifyAdmin, categoryValidator.validateId, categoryValidator.validateCategory, CategoriesControllers.updateCategory);

router.delete('/:id', verifyAdmin, categoryValidator.validateId, CategoriesControllers.deleteCategory);

module.exports = router;
