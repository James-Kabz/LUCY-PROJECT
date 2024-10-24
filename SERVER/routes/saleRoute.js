const express = require('express');
const salesController = require('../controller/salesController')
const router = express.Router();

router.post('/makeSale', salesController.makeSale)
router.get('/getAllSales', salesController.getAllSales)

module.exports = router;