// index.js
const express = require('express');
const session = require('express-session');
const path = require('path');
const passport = require('passport');
const mysql = require('mysql');
const dotenv = require('dotenv');
const logger = require('./utils/logger'); // Import your logger
const app = require('./app'); // Đảm bảo import đúng file

dotenv.config();

// Kết nối đến MySQL
// const db = mysql.createConnection({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
// });

// Kiểm tra kết nối đến DB
// db.connect((err) => {
//     if (err) {
//         logger.error('Kết nối DB thất bại!');
//         throw err;
//     }
//     logger.info('Kết nối DB thành công!');
// });

// Thiết lập session
app.use(session({
    secret: process.env.SESSION_SECRET, 
    resave: false, 
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// Phục vụ các file tĩnh từ thư mục hiện tại
app.use(express.static(path.join(__dirname)));

// Thiết lập PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
});
