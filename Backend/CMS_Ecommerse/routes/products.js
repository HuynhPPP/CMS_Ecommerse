const express = require('express');
const productsController = require('../controllers/products');
const router = express.Router();

router.post('/', productsController.createProduct);
// router.get('/');
// router.get('/:id');
// router.put('/:id');
// router.delete('/:id');

module.exports = router;
