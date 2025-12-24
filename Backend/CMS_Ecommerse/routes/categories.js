const express = require('express');
const CategoriesControllers = require('../controllers/categories');
const router = express.Router();

// create category
router.post('/api/categories', CategoriesControllers.createCategory);

// get categories
router.get('/api/categories', CategoriesControllers.getCategories);

module.exports = router;
