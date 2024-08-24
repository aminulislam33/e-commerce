const express = require('express');
const path = require('path');

const router = express.Router();

router.get("/signup", (req, res) => {
    return res.sendFile(path.join(__dirname, "../../client/auth/signup.html"));
});
router.get("/login", (req, res) => {
    return res.sendFile(path.join(__dirname, "../../client/auth/login.html"));
});

router.get("/verify-email", (req,res)=>{
    return res.sendFile(path.join(__dirname, "../../client/auth/login.html"));
});

router.get("/forgot-password", (req,res)=>{
    return res.sendFile(path.join(__dirname, "../../client/auth/passwdReset.html"));
});

module.exports = router;