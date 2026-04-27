const express = require('express');
const router = express.Router();
const { getProvinces, getWardsByProvince } = require('../controllers/address');

router.get('/provinces', getProvinces);
router.get('/wards/:provinceCode', getWardsByProvince);

module.exports = router;
