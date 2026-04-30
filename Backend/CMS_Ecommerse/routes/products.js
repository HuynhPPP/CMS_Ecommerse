const express = require('express');
const productsController = require('../controllers/products');
const { verifyAdmin } = require('../middlewares/auth');
const router = express.Router();

router.post('/', verifyAdmin, productsController.createProduct);
router.get('/', productsController.getProducts);
router.get('/:id', productsController.getProductById);
router.put('/:id', verifyAdmin, productsController.updateProduct);
router.delete('/:id', verifyAdmin, productsController.deleteProduct);

module.exports = router;
