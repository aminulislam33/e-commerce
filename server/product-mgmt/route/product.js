const express = require('express');
const { getAllProduct, createProduct, getSingleProduct, updateSingleProduct, deleteSingleProduct } = require('../controller/product');
const verifyToken = require('../../user-mgmt/utils/verifyToken');
const authorizeRoles = require('../../user-mgmt/middleware/auth');
const router = express.Router();

router.post('/products', verifyToken, authorizeRoles(['admin']), createProduct);
router.put('/products/:id', verifyToken, authorizeRoles(['admin']), updateSingleProduct);
router.delete('/products/:id', verifyToken, authorizeRoles(['admin']), deleteSingleProduct);
router.get('/products', getAllProduct);
router.get('/products/:id', getSingleProduct);

module.exports = router;