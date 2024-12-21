const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { Op } = require('sequelize');
const bcrypt = require('bcrypt');

// Google Strategy Configuration
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const jwtToken = jwt.sign({ id: profile.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Kiểm tra email
        // const email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null;
        
        // Get email and avatar
        const email = profile.emails?.[0]?.value;
        const image = profile.photos?.[0]?.value;

        if (!email) {
            return done(new Error('No email found in profile'));
        }

        const existingUser = await User.findOne({ where: { email } });
        if (!existingUser) {
            const hashedPassword = await bcrypt.hash('defaultPassword', 10);

            const user = await User.create({
                googleId: profile.id,
                username: profile.displayName,
                email: email,
                password: hashedPassword,
                token: jwtToken,
                image: image || null,
                provider: 'google'
            });
            return done(null, user);
        } else {
            // Update existing user's avatar if it doesn't have one
            if (image && (!existingUser.image || existingUser.image !== image)) {
                await existingUser.update({ 
                    image: image,
                    googleId: profile.id,
                    provider: 'google'
                });
            }
            return done(null, existingUser);
        }
    } catch (error) {
        return done(error);
    }
}));

//Cấu hình Passport cho Facebook
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/auth/facebook/callback',
    profileFields: ['id', 'displayName', 'email', 'photos'],
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const jwtToken = jwt.sign({ id: profile.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Kiểm tra email
        // const email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null;
        
        // Get email and avatar
        const email = profile.emails?.[0]?.value;
        const avatar = profile.photos?.[0]?.value;

        if (!email) {
            return done(new Error('No email found in profile'));
        }

        const existingUser = await User.findOne({ 
            where: { [Op.or]: [{ facebookId: profile.id }, { email }] } 
        });
        
        if (!existingUser) {
            const hashedPassword = await bcrypt.hash('defaultPassword', 10);

            const user = await User.create({
                facebookId: profile.id,
                username: profile.displayName,
                email: email,
                password: hashedPassword,
                token: jwtToken,
                avatar: avatar || null, // Save avatar URL
                provider: 'facebook'
            });
            return done(null, user);
        } else {
            // Update existing user's avatar if it doesn't have one
            if (avatar && (!existingUser.avatar || existingUser.avatar !== avatar)) {
                await existingUser.update({
                    avatar: avatar,
                    facebookId: profile.id,
                    provider: 'facebook',
                });
            }            
            return done(null, existingUser);
        }
    } catch (error) {
        return done(error);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((obj, done) => {
    done(null, obj);
});

module.exports = {
    setupGoogleAuth: passport.authenticate('google', { scope: ['profile', 'email'] }),
    setupFacebookAuth: passport.authenticate('facebook', { scope: ['email', 'public_profile'] })
};
