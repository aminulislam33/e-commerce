const express = require('express');
const verifyToken = require('../../user-mgmt/utils/verifyToken');
const { singleOrder, multipleOrder, updateOrderStatus, deleteOrder, placeOrder } = require('../controller/order');
const authorizeRoles = require('../../user-mgmt/middleware/auth');

const router = express.Router();

router.post('/', verifyToken, placeOrder);
router.get("/:id", verifyToken, singleOrder);
router.get("/user/:userId", verifyToken, multipleOrder);
router.put("/:id/status", verifyToken, authorizeRoles(['admin']), updateOrderStatus);
router.delete("/:id", verifyToken, deleteOrder);

module.exports = router;