const express = require('express');
const categoriesRouter = require('./categories');
const productsRouter = require('./products');
const usersRouter = require('./users');

const router = express.Router();

// Mount routes
router.use(categoriesRouter);
router.use('/api/products', productsRouter);
router.use(usersRouter);

module.exports = router;
