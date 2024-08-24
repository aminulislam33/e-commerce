const express = require('express');
const path = require('path');

const router = express.Router();

router.get("/", (req,res)=>{
    return res.sendFile(path.join(__dirname, "../../client/auth/dashboard.html"));
});

module.exports = router;