const express = require('express');
const categoriesRouter = require('./categories');
const productsRouter = require('./products');
const usersRouter = require('./users');
const uploadRouter = require('./upload');

const router = express.Router();

// Mount routes
router.use('/categories', categoriesRouter);
router.use('/products', productsRouter);
router.use('/users', usersRouter);
router.use('/upload', uploadRouter);

module.exports = router;
