const express = require('express');
const itemController = require('../controller/ItemController')
const router = express.Router();

router.post('/addItem', itemController.addItem)
router.get('/getAllItems', itemController.getAllItems)
router.get('/getItem/:id', itemController.getItem)
router.patch('/updateItem/:id', itemController.updateItem)
router.delete('/deleteItem/:id', itemController.deleteItem)
module.exports = router;