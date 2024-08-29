const express = require('express');
const { handleNewAddress, getAllAddressOfUser, updateAddressExistingAddress, deleteAddress } = require('../controller/addressController');
const verifyToken = require('../../user-mgmt/utils/verifyToken');
const router = express.Router();

router.post('/', verifyToken, handleNewAddress);
router.get('/user/:userId', verifyToken, getAllAddressOfUser);
router.put('/:id', verifyToken, updateAddressExistingAddress);
router.delete('/:id', verifyToken, deleteAddress);

module.exports = router;