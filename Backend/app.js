// Component chính của web
const config = require('./utils/config');
const express = require('express');
require('express-async-error');
const app = express();
const cors = require('cors');
const usersRouter = require('./controllers/users');
const competitionsRouter = require('./controllers/competitions');
const logger = require('./utils/logger');
const middleware = require('./utils/middleware');
const sequelize = require('./db');

const imageUploadRouter = require('./controllers/imageUpload')
const tokenRouter = require('./controllers/token')
const recipesRouter = require('./controllers/recipes')
const { setupGoogleAuth, setupFacebookAuth } = require('./auth/auth-setup');
const path = require('path');
const passport = require('passport')
const jwt = require('jsonwebtoken')

const recipeIngredientsRouter = require('./routes/recipeIngredient');
const recipeInstructionsRouter = require('./routes/recipeInstructions');
const recipeComment = require('./routes/recipeComment');
const recipeRouter = require('./routes/recipe');
const favouritesRouter = require('./routes/favourite');
const recipeRatings = require('./routes/recipeRating');

// Serve static files
app.use(express.static('public'));
// Phục vụ các file tĩnh từ thư mục hiện tại
app.use(express.static(path.join(__dirname)));

const userProfile = require('./routes/userProfile');
const myRecipes = require('./routes/myRecipes');
// Kết nối DB
sequelize.authenticate()
    .then(() => logger.info('Kết nối db thành công!'))
    .catch((err) => logger.error('Lỗi kết nối db:', err));

// Middleware
app.use(express.json());
app.use(cors());
app.use(middleware.requestLogger);

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

// Routes
app.use('/api/users', usersRouter);
app.use('/api/competitions', competitionsRouter);

app.use('/api/image', imageUploadRouter)
app.use('/api/token', tokenRouter)

app.use('/api/users', userProfile); // /api/users/:id
app.use('/api/users', myRecipes); // /api/users/:id/recipes
app.use('/api/users', favouritesRouter); // /api/favourites

app.use('/api/recipes', recipeIngredientsRouter); // /api/recipes/:id/ingredients
app.use('/api/recipes', recipeInstructionsRouter); // /api/recipes/:id/instructions
app.use('/api/recipes', recipeComment); // /api/recipes/:id/comments
app.use('/api/recipes', recipeRouter); // /api/recipes
app.use('/api/recipes', recipeRatings); // /api/recipeRatings

// Middleware xử lý lỗi
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;