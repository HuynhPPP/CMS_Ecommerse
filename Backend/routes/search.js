const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');

// 1. Tìm kiếm tổng hợp (Sử dụng chính cho Frontend)
// GET /api/search?q=...&category=...&sort=...
router.get('/', searchController.searchAll);

// 2. Tìm kiếm chuyên biệt theo giá
// GET /api/search/price?min=100&max=500
router.get('/price', searchController.searchByPrice);

// 3. Tìm kiếm sản phẩm mới nhất
// GET /api/search/latest
router.get('/latest', searchController.searchByDate);

module.exports = router;
