const express = require('express');
const app = express();

const config = require('./utils/config');
const logger = require('./utils/logger');
const middleware = require('./utils/middleware');
const sequelize = require('./db'); // Ensure Sequelize is set up properly
const db = require('./mysql'); // MySQL connection
const path = require('path'); 
const usersRouter = require('./controllers/users');
const { setupGoogleAuth, setupFacebookAuth } = require('./auth/auth-setup'); // Sử dụng các file config Passport

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(require('cors')());
app.use(middleware.requestLogger);

// Kết nối đến DB và kiểm tra
sequelize.authenticate()
    .then(() => {
        logger.info('Kết nối DB thành công!');
    })
    .catch(err => {
        logger.error('Kết nối DB thất bại:', err);
    });

// Serve static files
app.use(express.static('public'));
// Phục vụ các file tĩnh từ thư mục hiện tại
app.use(express.static(path.join(__dirname)));

// Đường dẫn gốc để phục vụ file index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html')); // Đảm bảo tên file đúng
}); 
app.use('/', usersRouter)
// Routes
app.use('/users', usersRouter);

// Google OAuth Route
app.get('/auth/google', setupGoogleAuth);

// Facebook OAuth Route
app.get('/auth/facebook', setupFacebookAuth);

// Handle unknown endpoints
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
