const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/orders');

router.post('/', ordersController.createOrder);
router.get('/', ordersController.getAllOrders); // Mới thêm cho Admin
router.get('/user/:userId', ordersController.getOrdersByUser);
router.get('/:id', ordersController.getOrderById);
router.patch('/:id', ordersController.updateOrderStatus);

module.exports = router;
