const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment');

// Endpoint nhận Webhook (Ví dụ: đặt tại /api/payment/webhook)
router.post('/webhook', paymentController.handleSePayWebhook);

module.exports = router;
