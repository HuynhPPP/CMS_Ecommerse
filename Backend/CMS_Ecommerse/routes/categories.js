const express = require('express');
const CategoriesControllers = require('../controllers/categories');
const { verifyAdmin } = require('../middlewares/auth');
const router = express.Router();

router.post('/', verifyAdmin, CategoriesControllers.createCategory);

router.get('/', CategoriesControllers.getCategories);

router.get('/:id', CategoriesControllers.getCategoryById);

router.put('/:id', verifyAdmin, CategoriesControllers.updateCategory);

router.delete('/:id', verifyAdmin, CategoriesControllers.deleteCategory);

module.exports = router;
