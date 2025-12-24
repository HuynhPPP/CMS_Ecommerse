const express = require('express');
const categoriesRouter = require('./categories');

const router = express.Router();

// Mount routes
router.use(categoriesRouter);

module.exports = router;
