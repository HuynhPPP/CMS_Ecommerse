const express = require('express');
const categoriesRouter = require('./categories');
const productsRouter = require('./products');

const router = express.Router();

// Mount routes
router.use(categoriesRouter);
router.use('/api/products', productsRouter);

module.exports = router;
