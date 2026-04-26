const express = require('express');
const categoriesRouter = require('./categories');
const productsRouter = require('./products');
const usersRouter = require('./users');
const uploadRouter = require('./upload');

const productsController = require('../controllers/products');

const router = express.Router();

// Mount routes
router.use('/categories', categoriesRouter);
router.use('/products', productsRouter);
router.use('/users', usersRouter);
router.use('/upload', uploadRouter);

// Related products
router.get('/related-products/:id', productsController.getRelatedProducts);

module.exports = router;
