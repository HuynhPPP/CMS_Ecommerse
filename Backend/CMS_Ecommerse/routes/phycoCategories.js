const express = require('express');
const PhycoCategoriesController = require('../controllers/phycoCategories');
const router = express.Router();

// Create Phyco category
router.post(
  '/api/phyco/categories',
  PhycoCategoriesController.createPhycoCategory
);

// Get Phyco categories
router.get(
  '/api/phyco/categories',
  PhycoCategoriesController.getPhycoCategories
);

// Get Phyco category by id
router.get(
  '/api/phyco/categories/:id',
  PhycoCategoriesController.getPhycoCategoryById
);

// Update Phyco category
router.put(
  '/api/phyco/categories/:id',
  PhycoCategoriesController.updatePhycoCategory
);

// Delete Phyco category
router.delete(
  '/api/phyco/categories/:id',
  PhycoCategoriesController.deletePhycoCategory
);

module.exports = router;
