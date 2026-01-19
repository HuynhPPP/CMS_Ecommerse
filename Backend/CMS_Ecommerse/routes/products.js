const express = require('express');
const productsController = require('../controllers/products');
const router = express.Router();

router.post('/', productsController.createProduct);
router.get('/', productsController.getProducts);
// router.get('/:id');
router.put('/:id', productsController.updateProduct);
router.delete('/:id', productsController.deleteProduct);

module.exports = router;
