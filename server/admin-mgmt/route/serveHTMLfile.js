const express = require('express');
const path = require('path');
const adminAuth = require('../middleware/adminAuth');
const router = express.Router();

router.get('/login', (req,res)=>{
    return res.sendFile(path.join(__dirname, "../../../client/admin/admin-login.html"));
});

router.get('/dashboard', adminAuth, (req,res)=>{
    return res.sendFile(path.join(__dirname, "../../../client/admin/admin-dashboard.html"));
});

router.get('/products', adminAuth, (req,res)=>{
    return res.sendFile(path.join(__dirname, "../../../client/admin/products.html"));
});

module.exports = router;