const express = require('express');
const PhycoCouponsController = require('../controllers/phycoCoupons');
const router = express.Router();

// Get all coupons
router.get('/api/phyco/coupons', PhycoCouponsController.getCoupons);

// Get coupon by id
router.get('/api/phyco/coupons/:id', PhycoCouponsController.getCouponById);

// Create coupon
router.post('/api/phyco/coupons', PhycoCouponsController.createCoupon);

// Update coupon
router.put('/api/phyco/coupons/:id', PhycoCouponsController.updateCoupon);

// Delete coupon
router.delete('/api/phyco/coupons/:id', PhycoCouponsController.deleteCoupon);

// Toggle coupon status
router.patch(
  '/api/phyco/coupons/:id/toggle',
  PhycoCouponsController.toggleCouponStatus
);

module.exports = router;
