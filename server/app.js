const express = require('express');
const connectDB = require('./user-mgmt/config/db');
const path = require('path');

const app = express();

connectDB();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'client')));

app.use('/api/auth', require('./user-mgmt/router/auth'));
app.use('/api/product', require('./product-mgmt/route/product'));
app.use('/api/order', require('./order-mgmt/route/order'));
app.use('/user', require('./user-mgmt/router/staticRouter'));
app.use('/dashboard', require('./user-mgmt/router/dashboard'));
app.use('/product', require('./product-mgmt/route/staticRouter'));


app.get('/', (req, res) => { return res.redirect("/dashboard") });

module.exports = app;