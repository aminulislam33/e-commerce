const express = require('express');
const verifyToken = require('../../user-mgmt/utils/verifyToken');
const { handleAddToCart, getAllCartProductsOfUser } = require('../controller/addToCart');
const router = express.Router();

router.post('/add', verifyToken, handleAddToCart);
router.get('/:userId', verifyToken, getAllCartProductsOfUser);

module.exports = router;