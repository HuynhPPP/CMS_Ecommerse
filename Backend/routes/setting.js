const express = require('express');
const router = express.Router();
const { getSettings, updateSettings } = require('../controllers/settingController');

router.get('/', getSettings);
router.post('/', updateSettings); // Should add admin middleware later if needed

module.exports = router;
