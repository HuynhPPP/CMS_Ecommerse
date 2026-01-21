const express = require('express');
const router = express.Router();
const phycoCartController = require('../controllers/phycoCart');

// Cart routes
router.get('/api/phyco/cart', phycoCartController.getCart);
router.post('/api/phyco/cart/items', phycoCartController.addToCart);
router.put('/api/phyco/cart/items/:id', phycoCartController.updateCartItem);
router.delete('/api/phyco/cart/items/:id', phycoCartController.removeFromCart);
router.delete('/api/phyco/cart', phycoCartController.clearCart);

// Coupon routes
router.post('/api/phyco/cart/apply-coupon', phycoCartController.applyCoupon);
router.delete('/api/phyco/cart/remove-coupon', phycoCartController.removeCoupon);

module.exports = router;

