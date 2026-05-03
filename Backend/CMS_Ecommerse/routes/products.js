const express = require('express');
const productsController = require('../controllers/products');
const { verifyAdmin } = require('../middlewares/auth');
const router = express.Router();

const productValidator = require('../middlewares/productValidator');

router.post('/', verifyAdmin, productValidator.validateProduct, productsController.createProduct);
router.get('/', productsController.getProducts);
router.get('/:id', productValidator.validateId, productsController.getProductById);
router.put('/:id', verifyAdmin, productValidator.validateId, productValidator.validateProduct, productsController.updateProduct);
router.delete('/:id', verifyAdmin, productValidator.validateId, productsController.deleteProduct);

module.exports = router;
