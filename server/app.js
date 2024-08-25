const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const connectDB = require('./user-mgmt/config/db');

const app = express();

connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../client')));

app.use('/api/auth', require('./user-mgmt/router/auth'));
app.use('/api/product', require('./product-mgmt/route/product'));
app.use('/api/order', require('./order-mgmt/route/order'));
app.use('/api/admin', require('./admin-mgmt/route/auth'));

app.use('/admin', require('./admin-mgmt/route/serveHTMLfile'));
app.use('/user', require('./serveHTMLfile/user'));
app.get('/', (req,res)=>{return res.redirect('/user/dashboard')});

module.exports = app;