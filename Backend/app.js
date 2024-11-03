// Component chính của web
const config = require('./utils/config')
const express = require('express')
require('express-async-error')
const app = express()
const cors = require('cors')
const usersRouter = require('./controllers/users')

const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const sequelize = require('./db')
const recipesRouter = require('./controllers/recipes')
const { setupGoogleAuth, setupFacebookAuth } = require('./auth/auth-setup');
const path = require('path');
const passport = require('passport')
const jwt = require('jsonwebtoken')
sequelize.authenticate()
    .then(() => {
        logger.info('Kết nối DB thành công!');
    })
    .catch(err => {
        logger.error('Kết nối DB thất bại:', err);
    });

logger.info('Kết nối db thành công!')
// Serve static files
app.use(express.static('public'));
// Phục vụ các file tĩnh từ thư mục hiện tại
app.use(express.static(path.join(__dirname)));

app.use(express.json())
app.use(cors())

app.use(middleware.requestLogger)
// Route cho xác thực Google
app.get('/auth/google', setupGoogleAuth);
// Route callback cho Google
app.get('/auth/google/callback', (req, res, next) => {
    passport.authenticate('google', { failureRedirect: '/login' }, (err, user) => {
        if (err || !user) {
            console.error('Google authentication error:', err || 'No user found');
            return res.redirect('/login'); // Chuyển hướng nếu có lỗi
        }
        const jwtToken = jwt.sign({ id: user.googleId }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', jwtToken, { httpOnly: true }); // Lưu token vào cookie
        return res.redirect('http://localhost:5173'); // Chuyển hướng về trang chủ
    })(req, res, next);
});
// Route cho xác thực Facebook
app.get('/auth/facebook', setupFacebookAuth);
// Route callback cho Facebook
app.get('/auth/facebook/callback', (req, res, next) => {
    passport.authenticate('facebook', { failureRedirect: '/login' }, (err, user) => {
        if (err || !user) {
            console.error('Facebook authentication error:', err || 'No user found');
            return res.redirect('/login'); // Chuyển hướng nếu có lỗi
        }
        const jwtToken = jwt.sign({ id: user.facebookId }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', jwtToken, { httpOnly: true }); // Lưu token vào cookie
        return res.redirect('http://localhost:5173'); // Chuyển hướng về trang chủ
    })(req, res, next);
});
app.use('/api/users', usersRouter)

app.use('/api/recipes', recipesRouter)


app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)


module.exports = app;
