const express = require('express');
const PhycoProductsController = require('../controllers/phycoProducts');
const router = express.Router();

// Create Phyco product
router.post('/api/phyco/products', PhycoProductsController.createPhycoProduct);

// Get Phyco products
router.get('/api/phyco/products', PhycoProductsController.getPhycoProducts);

// Get Phyco product by id
router.get(
  '/api/phyco/products/:id',
  PhycoProductsController.getPhycoProductById
);

// Update Phyco product
router.put(
  '/api/phyco/products/:id',
  PhycoProductsController.updatePhycoProduct
);

// Delete Phyco product
router.delete(
  '/api/phyco/products/:id',
  PhycoProductsController.deletePhycoProduct
);

module.exports = router;
