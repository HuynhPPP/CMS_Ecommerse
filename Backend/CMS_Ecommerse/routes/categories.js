const express = require('express');
const CategoriesControllers = require('../controllers/categories');
const router = express.Router();

// create category
router.post('/api/categories', CategoriesControllers.createCategory);

// get categories
router.get('/api/categories', CategoriesControllers.getCategories);

// get category by id
router.get('/api/categories/:id', CategoriesControllers.getCategoryById);

// update category
router.put('/api/categories/:id', CategoriesControllers.updateCategory);

// delete category
router.delete('/api/categories/:id', CategoriesControllers.deleteCategory);

module.exports = router;
