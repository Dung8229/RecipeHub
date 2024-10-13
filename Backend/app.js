// Component chính của web
const config = require('./utils/config');
const express = require('express');
require('express-async-errors');
const cors = require('cors');
const usersRouter = require('./controllers/users');
const logger = require('./utils/logger');
const middleware = require('./utils/middleware');
const sequelize = require('./db'); // Ensure Sequelize is set up properly
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt'); // Thêm bcrypt để mã hóa mật khẩu
const dotenv = require('dotenv');
const session = require('express-session');
const path = require('path'); 
dotenv.config(); // Load environment variables

const app = express();

// Kết nối đến MySQL
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// Tạo schema người dùng
const createUserTable = `CREATE TABLE IF NOT EXISTS userss (
    id INT AUTO_INCREMENT PRIMARY KEY,
    googleId VARCHAR(255),
    facebookId VARCHAR(255),
    displayName VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255), 
    role ENUM('user', 'admin') DEFAULT 'user',
    token VARCHAR(255),
    verified BOOLEAN DEFAULT FALSE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`;


db.query(createUserTable, (err) => {
    if (err) {
        logger.error('Error creating user table:', err);
        throw err;
    }
});

// Cấu hình Passport cho Google
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
    const jwtToken = jwt.sign({ id: profile.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    const user = {
        googleId: profile.id,
        displayName: profile.displayName,
        email: profile.emails[0].value,
        token: jwtToken,
    };

    db.query('INSERT INTO userss SET ? ON DUPLICATE KEY UPDATE ?', [user, user], (err, result) => {
        if (err) return done(err);
        return done(null, user);
    });
}));

// Cấu hình Passport cho Facebook
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: '/auth/facebook/callback',
    profileFields: ['id', 'displayName', 'email'],
}, async (accessToken, refreshToken, profile, done) => {
    const jwtToken = jwt.sign({ id: profile.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    const user = {
        facebookId: profile.id,
        displayName: profile.displayName,
        email: profile.emails[0].value,
        token: jwtToken,
    };

    db.query('INSERT INTO userss SET ? ON DUPLICATE KEY UPDATE ?', [user, user], (err, result) => {
        if (err) return done(err);
        return done(null, user);
    });
}));

// Khởi động Passport
passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((obj, done) => {
    done(null, obj);
});
// Sử dụng Passport với express-session
app.use(session({ secret: 'your secret key', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
// Phục vụ các file tĩnh từ thư mục hiện tại
app.use(express.static(path.join(__dirname)));

// Đường dẫn gốc để phục vụ file index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html')); // Đảm bảo tên file đúng
});	
// Middleware
app.use(express.json());
app.use(cors());
app.use(middleware.requestLogger);

// Kết nối đến DB và kiểm tra
sequelize.authenticate()
    .then(() => {
        logger.info('Kết nối DB thành công!');
    })
    .catch(err => {
        logger.error('Kết nối DB thất bại:', err);
    });

// Hàm kiểm tra độ mạnh của mật khẩu
function isPasswordStrong(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return (
        password.length >= minLength &&
        hasUpperCase &&
        hasLowerCase &&
        hasNumbers &&
        hasSpecialChars
    );
}

// Đăng ký người dùng mới
app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    // Kiểm tra email có trùng không
    db.query('SELECT * FROM userss WHERE email = ?', [email], async (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        if (results.length > 0) return res.status(400).json({ error: 'Email already exists' });

        // Kiểm tra độ mạnh của mật khẩu
        if (!isPasswordStrong(password)) {
            return res.status(400).json({ error: 'Password must be at least 8 characters long, include uppercase, lowercase, numbers, and special characters.' });
        }

        // Mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(password, 10);

        // Thêm người dùng mới
        const newUser = { displayName: username, email, password: hashedPassword, role: 'user', verified: false };
        db.query('INSERT INTO userss SET ?', newUser, (err) => {
            if (err) return res.status(500).json({ error: 'Failed to register user' });
            return res.status(201).json({ message: 'User registered successfully' });
        });
    });
});


// Đăng nhập và tạo token xác thực (JWT)
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    db.query('SELECT * FROM userss WHERE email = ?', [email], async (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        if (results.length === 0) return res.status(401).json({ error: 'Invalid email or password' });

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) return res.status(401).json({ error: 'Invalid email or password' });

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, user });
    });
});

// API thêm người dùng mới (cho admin)
app.post('/users', async (req, res) => {
    const { username, email, password } = req.body;

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { displayName: username, email, password: hashedPassword, role: 'admin', verified: true };

    db.query('INSERT INTO userss SET ?', newUser, (err) => {
        if (err) return res.status(500).json({ error: 'Failed to add user' });
        return res.status(201).json({ message: 'User added successfully' });
    });
});

// API xóa người dùng dựa trên ID
app.delete('/users/:id', (req, res) => {
    const { id } = req.params;

    db.query('DELETE FROM userss WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).json({ error: 'Failed to delete user' });
        return res.status(204).send(); // Trả về 204 No Content
    });
});

// Routes
app.use('/users', usersRouter); // Đây là router cho các API người dùng

// Google OAuth Route
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Callback sau khi Google xác thực
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
    res.json({ user: req.user, token: req.user.token });
});

// Facebook OAuth Route
app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));

// Callback sau khi Facebook xác thực
app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), (req, res) => {
    res.json({ user: req.user, token: req.user.token });
});

// Handle unknown endpoints
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
