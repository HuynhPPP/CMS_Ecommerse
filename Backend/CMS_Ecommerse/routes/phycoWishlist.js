const express = require('express');
const router = express.Router();
const phycoWishlistController = require('../controllers/phycoWishlist');

// Wishlist routes
router.get('/api/phyco/wishlist', phycoWishlistController.getWishlist);
router.post('/api/phyco/wishlist/items', phycoWishlistController.addToWishlist);
router.delete(
  '/api/phyco/wishlist/items/:id',
  phycoWishlistController.removeFromWishlist
);
router.delete('/api/phyco/wishlist', phycoWishlistController.clearWishlist);

module.exports = router;
