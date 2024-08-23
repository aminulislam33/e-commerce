const express = require('express');
const connectDB = require('./user-mgmt/config/db');

const app = express();

connectDB();

app.use(express.json());

app.use('/api/auth', require('./user-mgmt/router/auth'));
app.use('/api/product', require('./product-mgmt/route/product'));
app.use('/api/orders', require('./order-mgmt/route/order'));

module.exports = app;