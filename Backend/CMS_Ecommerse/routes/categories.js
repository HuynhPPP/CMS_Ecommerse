const express = require('express');
const CategoriesControllers = require('../controllers/categories');
const router = express.Router();

// create category: /api/categories/
router.post('/', CategoriesControllers.createCategory);

// get categories: /api/categories/
router.get('/', CategoriesControllers.getCategories);

// get category by id: /api/categories/:id
router.get('/:id', CategoriesControllers.getCategoryById);

// update category: /api/categories/:id
router.put('/:id', CategoriesControllers.updateCategory);

// delete category: /api/categories/:id
router.delete('/:id', CategoriesControllers.deleteCategory);

module.exports = router;
