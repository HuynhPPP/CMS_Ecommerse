const express = require('express');
const router = express.Router();
const cartsController = require('../controllers/carts');
const { verifyToken } = require('../middlewares/auth');

router.get('/:userId', verifyToken, cartsController.getCart);
router.post('/', verifyToken, cartsController.addToCart);
router.delete('/deleteItem', verifyToken, cartsController.deleteItem);
router.delete('/delete', verifyToken, cartsController.clearCart);

module.exports = router;
