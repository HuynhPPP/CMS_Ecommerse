const express = require('express');
const categoriesRouter = require('./categories');
const productsRouter = require('./products');
const phycoCategoriesRouter = require('./phycoCategories');
const phycoProductsRouter = require('./phycoProducts');
const phycoOrdersRouter = require('./phycoOrders');

const router = express.Router();

// Mount routes
router.use(categoriesRouter);
router.use('/api/products', productsRouter);

// Mount Phyco routes
router.use(phycoCategoriesRouter);
router.use(phycoProductsRouter);
router.use(phycoOrdersRouter);

module.exports = router;
