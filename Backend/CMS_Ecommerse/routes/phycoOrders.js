const express = require('express');
const PhycoOrdersController = require('../controllers/phycoOrders');
const router = express.Router();

// Create Phyco order
router.post('/api/phyco/orders', PhycoOrdersController.createPhycoOrder);

// Get Phyco orders
router.get('/api/phyco/orders', PhycoOrdersController.getPhycoOrders);

// Get Phyco order by id
router.get('/api/phyco/orders/:id', PhycoOrdersController.getPhycoOrderById);

// Update Phyco order status
router.patch(
  '/api/phyco/orders/:id/status',
  PhycoOrdersController.updatePhycoOrderStatus
);

// Cancel Phyco order
router.post(
  '/api/phyco/orders/:id/cancel',
  PhycoOrdersController.cancelPhycoOrder
);

module.exports = router;
