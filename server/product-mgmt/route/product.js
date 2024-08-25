const express = require('express');
const { getAllProduct, createProduct, getSingleProduct, updateSingleProduct, deleteSingleProduct } = require('../controller/product');
const verifyToken = require('../../user-mgmt/utils/verifyToken');
const authorizeRoles = require('../../user-mgmt/middleware/auth');
const router = express.Router();

router.post('/add-product', verifyToken, authorizeRoles(['admin']), createProduct);
router.put('/:id', verifyToken, authorizeRoles(['admin']), updateSingleProduct);
router.delete('/:id', verifyToken, authorizeRoles(['admin']), deleteSingleProduct);
router.get('/get-all-products', getAllProduct);
router.get('/:id', getSingleProduct);

module.exports = router;