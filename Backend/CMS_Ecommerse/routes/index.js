const express = require('express');
const categoriesRouter = require('./categories');
const productsRouter = require('./products');
const usersRouter = require('./users');
const uploadRouter = require('./upload');

const router = express.Router();

// Mount routes
router.use(categoriesRouter);
router.use('/api/products', productsRouter);
router.use(usersRouter);
router.use(uploadRouter);

module.exports = router;
