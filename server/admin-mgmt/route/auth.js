const express = require('express');
const handleAdminLogin = require('../controller/login');
const router = express.Router();

router.post('/login', handleAdminLogin);

module.exports = router;