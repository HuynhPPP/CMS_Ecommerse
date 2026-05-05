const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/orders');
const { verifyToken, verifyAdmin } = require('../middlewares/auth');

const orderValidator = require('../middlewares/orderValidator');

router.post('/', verifyToken, orderValidator.validateCreateOrder, ordersController.createOrder);
router.get('/', verifyAdmin, ordersController.getAllOrders); // Mới thêm cho Admin
router.get('/user/:userId', verifyToken, orderValidator.validateUserId, ordersController.getOrdersByUser);
router.get('/:id', verifyToken, orderValidator.validateId, ordersController.getOrderById);
router.patch('/:id', verifyAdmin, orderValidator.validateUpdateStatus, ordersController.updateOrderStatus);

module.exports = router;
