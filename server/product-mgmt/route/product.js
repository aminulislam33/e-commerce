const express = require('express');
const { getAllProduct, createProduct, getSingleProduct, updateSingleProduct, deleteSingleProduct, getSimilarProducts } = require('../controller/product');
const verifyToken = require('../../user-mgmt/utils/verifyToken');
const authorizeRoles = require('../../user-mgmt/middleware/auth');
const router = express.Router();

router.post('/add', verifyToken, authorizeRoles(['admin']), createProduct);
router.put('/update/:id', verifyToken, authorizeRoles(['admin']), updateSingleProduct);
router.delete('/delete/:id', verifyToken, authorizeRoles(['admin']), deleteSingleProduct);
router.get('/get-all-products', getAllProduct);
router.get('/:id', getSingleProduct);
router.get('/similar/:category', getSimilarProducts);

module.exports = router;