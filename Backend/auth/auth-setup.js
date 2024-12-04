const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { Op } = require('sequelize');

// Cấu hình Passport cho Google
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const jwtToken = jwt.sign({ id: profile.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Kiểm tra email
        const email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null;
        if (!email) {
            return done(new Error('No email found in profile'));
        }

        const existingUser = await User.findOne({ where: { email } });
        if (!existingUser) {
            const user = await User.create({
                googleId: profile.id,
                username: profile.displayName,
                email: email,
                password: 'defaultPassword', // Có thể bỏ qua nếu không cần
                token: jwtToken,
            });
            return done(null, user); // Trả về người dùng đã tạo
        } else {
            return done(null, existingUser); // Trả về người dùng đã tồn tại
        }
    } catch (error) {
        return done(error); // Xử lý lỗi
    }
}));

//Cấu hình Passport cho Facebook
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/auth/facebook/callback',
    profileFields: ['id', 'displayName', 'email'],
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const jwtToken = jwt.sign({ id: profile.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Kiểm tra email
        const email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null;
        if (!email) {
            return done(new Error('No email found in profile'));
        }

        const existingUser = await User.findOne({ where: { [Op.or]: [{ facebookId: profile.id }, { email }] } });
        if (!existingUser) {
            const user = await User.create({
                facebookId: profile.id,
                username: profile.displayName,
                email: email,
                password: 'defaultPassword', // Có thể bỏ qua nếu không cần
                token: jwtToken,
            });
            return done(null, user); // Trả về người dùng đã tạo
        } else {
            return done(null, existingUser); // Trả về người dùng đã tồn tại
        }
    } catch (error) {
        return done(error); // Xử lý lỗi
    }
}));

// Khởi động Passport
passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((obj, done) => {
    done(null, obj);
});

// Export setup functions
module.exports = {
    setupGoogleAuth: passport.authenticate('google', { scope: ['profile', 'email'] }),
    setupFacebookAuth: passport.authenticate('facebook', { scope: ['email'] })
};
