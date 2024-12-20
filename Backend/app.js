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
const shoppinglistRouter = require('./controllers/shoppinglist')
const commentRouter = require('./controllers/commentController')
const recipesRouter = require('./controllers/recipes')
const { setupGoogleAuth, setupFacebookAuth } = require('./auth/auth-setup');
const path = require('path');
const passport = require('passport')
const jwt = require('jsonwebtoken')
const ingredientRouter = require('./controllers/ingredient')

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
        
        return res.redirect('/');
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
        
        return res.redirect('/');
    })(req, res, next);
});

// Routes
app.use('/api/users', usersRouter);
app.use('/api/competitions', competitionsRouter);
app.use('/api/shoppingList', shoppinglistRouter)

app.use('/api/image', imageUploadRouter)
app.use('/api/token', tokenRouter)

app.use('/api/users', userProfile); // /api/users/:id
app.use('/api/users', myRecipes); // /api/users/:id/recipes
app.use('/api/users', favouritesRouter); // /api/favourites
app.use('/api/shoppinglist', shoppinglistRouter)
app.use('/api/ingredient', ingredientRouter)
app.use('/api/comments', commentRouter)
// Sử dụng Express để phục vụ file tĩnh từ thư mục `uploads`
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/recipes', recipeComment); // /api/recipes/:id/comments
app.use('/api/recipes', recipeIngredientsRouter); // /api/recipes/:id/ingredients
app.use('/api/recipes', recipeInstructionsRouter); // /api/recipes/:id/instructions
app.use('/api/recipes', recipeRouter); // /api/recipes
app.use('/api/recipes', recipeRatings); // /api/recipeRatings
app.use('/api/recipes', recipesRouter)

// Đường dẫn tuyệt đối đến thư mục `dist`
const distPath = path.join(__dirname, 'dist');

// Sử dụng middleware để phục vụ file tĩnh
app.use(express.static(distPath));
// Trả về index.html cho tất cả các route khác
app.get('*', (req, res) => {
    console.log('This was called!')
    res.sendFile(path.join(distPath, 'index.html'));
});

// Middleware xử lý lỗi
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;