const express = require('express');
const router = express.Router();
const cartsController = require('../controllers/carts');
const { verifyToken } = require('../middlewares/auth');

const cartValidator = require('../middlewares/cartValidator');

router.get('/:userId', verifyToken, cartValidator.validateGetCart, cartsController.getCart);
router.post('/', verifyToken, cartValidator.validateAddToCart, cartsController.addToCart);
router.delete('/deleteItem', verifyToken, cartValidator.validateDeleteItem, cartsController.deleteItem);
router.delete('/clear', verifyToken, cartValidator.validateClearCart, cartsController.clearCart);

module.exports = router;
