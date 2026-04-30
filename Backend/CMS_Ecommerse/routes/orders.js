const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/orders');
const { verifyToken, verifyAdmin } = require('../middlewares/auth');

router.post('/', verifyToken, ordersController.createOrder);
router.get('/', verifyAdmin, ordersController.getAllOrders); // Mới thêm cho Admin
router.get('/user/:userId', verifyToken, ordersController.getOrdersByUser);
router.get('/:id', verifyToken, ordersController.getOrderById);
router.patch('/:id', verifyAdmin, ordersController.updateOrderStatus);

module.exports = router;
