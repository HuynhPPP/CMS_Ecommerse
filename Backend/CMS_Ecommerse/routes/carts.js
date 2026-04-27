const express = require('express');
const router = express.Router();
const cartsController = require('../controllers/carts');

router.get('/:userId', cartsController.getCart);
router.post('/', cartsController.addToCart);
router.delete('/deleteItem', cartsController.deleteItem);
router.delete('/delete', cartsController.clearCart);

module.exports = router;
