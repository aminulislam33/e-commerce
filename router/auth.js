const express = require('express');
const { handleUserRegistration, handleUserLogin, getUserData, verifyEmail } = require('../controller/user');
const verifyToken = require('../utils/verifyToken');
const { handleSendPasswdResetEmail, handlePasswdReset } = require('../controller/passwdReset');
const authorizeRoles = require('../middleware/auth');

const router = express.Router();

router.post("/register", handleUserRegistration);
router.post("/login", handleUserLogin);
router.get("/user", verifyToken, getUserData);
router.get("/verify/:token", verifyEmail);
router.post('/forgot-password', handleSendPasswdResetEmail);
router.post('/reset/:token', handlePasswdReset);
router.get('/admin-only', verifyToken, authorizeRoles(['admin']), (req, res) => {
    res.status(200).json({ msg: 'Welcome, admin!' });
  });

module.exports = router;