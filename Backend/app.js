const config = require('./utils/config')
const express = require('express')
require('express-async-error')
const app = express()
const cors = require('cors')
const usersRouter = require('./controllers/users')
const shoppinglistRouter = require('./controllers/shoppinglist')
const commentRouter = require('./controllers/commentController')
const competitionsRouter = require('./controllers/competitions')
const imageUploadRouter = require('./controllers/imageUpload')
const tokenRouter = require('./controllers/token')
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
            return res.redirect('/login');
        }
        
        const jwtToken = jwt.sign({ id: user.id, username: user.username, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        
        // Set cookie và log token
        res.cookie('token', jwtToken, { 
            httpOnly: false, // Cho phép JavaScript đọc cookie
            secure: process.env.NODE_ENV === 'production', // Chỉ dùng HTTPS trong production
            sameSite: 'lax',
            maxAge: 3600000 // 1 giờ
        });
        
        console.log('Setting token:', jwtToken); // Log token được tạo
        
        return res.redirect('http://localhost:5173');
    })(req, res, next);
});
// Route cho xác thực Facebook
app.get('/auth/facebook', setupFacebookAuth);
// Route callback cho Facebook
app.get('/auth/facebook/callback', (req, res, next) => {
    passport.authenticate('facebook', { failureRedirect: '/login' }, (err, user) => {
        if (err || !user) {
            console.error('Facebook authentication error:', err || 'No user found');
            return res.redirect('/login');
        }
        
        const jwtToken = jwt.sign({ id: user.id, username: user.username, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        
        // Set cookie và log token
        res.cookie('token', jwtToken, { 
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 3600000
        });
        
        console.log('Setting token:', jwtToken);
        
        return res.redirect('http://localhost:5173');
    })(req, res, next);
});

app.use('/api/users', usersRouter)
app.use('/api/recipes', recipesRouter)
app.use('/api/shoppinglist', shoppinglistRouter)
app.use('/api/competitions', competitionsRouter)
app.use('/api/image', imageUploadRouter)
app.use('/api/token', tokenRouter)
app.use('/api/comments', commentRouter)
// Sử dụng Express để phục vụ file tĩnh từ thư mục `uploads`
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)


module.exports = app;
