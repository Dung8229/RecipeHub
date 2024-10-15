const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const db = require('../mysql');
const jwt = require('jsonwebtoken');

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

    db.query('INSERT INTO users SET ? ON DUPLICATE KEY UPDATE ?', [user, user], (err, result) => {
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

    db.query('INSERT INTO users SET ? ON DUPLICATE KEY UPDATE ?', [user, user], (err, result) => {
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

// Export setup functions
module.exports = {
    setupGoogleAuth: passport.authenticate('google', { scope: ['profile', 'email'] }),
    setupFacebookAuth: passport.authenticate('facebook', { scope: ['email'] })
};
