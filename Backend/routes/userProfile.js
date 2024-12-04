const express = require('express');
const router = express.Router();
const User = require('../models/user');
const middleware = require('../utils/middleware')
const bcrypt = require('bcrypt');
// Route để lấy thông tin người dùng
router.get('/:userId', async (req, res) => {
    try {
        console.log(req.header('Authorization')); // Thêm dòng này để kiểm tra token nhận được
        const userId = req.params.userId;
        const user = await User.findByPk(userId, {
            attributes: ['username', 'email', 'password', 'googleId', 'facebookId', 'image', 'display_name']
        });
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
        console.log(error);
    }
});


// Route to update user's image URL
router.put('/:id/image', async (req, res) => {
    try {
        const { id } = req.params;
        const { imageUrl } = req.body;

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.image = imageUrl;
        await user.save();

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
        console.log(error);
    }
});

// Route to change user password
router.put('/:id/password', async (req, res) => {
    try {
        const { id } = req.params;
        const { currentPassword, newPassword } = req.body;

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Current password is incorrect' });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedNewPassword;
        await user.save();

        res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
        console.log(error);
    }
});

module.exports = router;