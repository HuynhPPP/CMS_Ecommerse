const express = require('express');
const categoriesRouter = require('./categories');
const productsRouter = require('./products');
const usersRouter = require('./users');
const uploadRouter = require('./upload');
const ordersRouter = require('./orders');
const cartsRouter = require('./carts');
const addressRouter = require('./address');
const paymentRouter = require('./payment');
const searchRouter = require('./search');
const settingRouter = require('./setting');

const productsController = require('../controllers/products');

const router = express.Router();

// Mount routes
router.use('/categories', categoriesRouter);
router.use('/products', productsRouter);
router.use('/search', searchRouter);
router.use('/users', usersRouter);
router.use('/upload', uploadRouter);
router.use('/orders', ordersRouter);
router.use('/cart', cartsRouter);
router.use('/address', addressRouter);
router.use('/payment', paymentRouter);
router.use('/settings', settingRouter);

// Related products
router.get('/related-products/:id', productsController.getRelatedProducts);

module.exports = router;
