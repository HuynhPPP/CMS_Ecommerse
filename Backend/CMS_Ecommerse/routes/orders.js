const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/orders');

router.post('/', ordersController.createOrder);
router.get('/user/:userId', ordersController.getOrdersByUser);
router.get('/:id', ordersController.getOrderById);
router.put('/:id/status', ordersController.updateOrderStatus);

module.exports = router;
