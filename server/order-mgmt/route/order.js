const express = require('express');
const verifyToken = require('../../user-mgmt/utils/verifyToken');
const { singleOrder, multipleOrder, updateOrderStatus, deleteOrder, placeOrder, getAllOrders } = require('../controller/order');
const authorizeRoles = require('../../user-mgmt/middleware/auth');

const router = express.Router();

router.get("/orders", verifyToken, authorizeRoles(['admin']), getAllOrders);
router.post('/create', verifyToken, placeOrder); //to place order
router.get("/:id", verifyToken, singleOrder); //to view single order status and called by productId
router.get("/user/:userId", verifyToken, multipleOrder); //to view all orders of an user and called by userId
router.put("/update/:id", verifyToken, authorizeRoles(['admin']), updateOrderStatus);
router.delete("/delete/:id", verifyToken, deleteOrder);

module.exports = router;