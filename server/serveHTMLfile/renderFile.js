const express = require('express');
const path = require('path');
const router = express.Router();

router.get("/dashboard", (req, res) => {
    return res.sendFile(path.join(__dirname, "../../client/dashboard.html"));
});

router.get("/product/:id", (req, res) => {
    return res.sendFile(path.join(__dirname, "../../client/product/view-product.html"));
});

router.get("/login", (req, res) => {
    return res.sendFile(path.join(__dirname, "../../client/user/login.html"));
});

router.get("/signup", (req, res) => {
    return res.sendFile(path.join(__dirname, "../../client/user/signup.html"));
});

router.get("/auth/verify/:token", (req, res) => {
    return res.sendFile(path.join(__dirname, "../../client/user/verify-email.html"));
});

router.get("/orders", (req, res) => {
    return res.sendFile(path.join(__dirname, "../../client/order/all-orders.html"));
});


module.exports = router;