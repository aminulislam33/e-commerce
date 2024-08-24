const express = require('express');
const path = require('path');

const router = express.Router();

router.get("/:id", (req,res)=>{
    return res.sendFile(path.join(__dirname, "../../client/product/get-single-product.html"));
});

module.exports = router;