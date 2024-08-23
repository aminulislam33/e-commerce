const express = require('express');
const connectDB = require('./config/db');

const app = express();

connectDB();

app.use(express.json());

app.use('/api/auth', require('./router/auth'));

module.exports = app;