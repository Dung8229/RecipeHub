const express = require('express');
const router = express.Router();
const User = require('../models/user');
const middleware = require('../utils/middleware')
// Route để lấy thông tin người dùng
router.get('/:userId', middleware.authenticateJWT, async (req, res) => {
    try {
        console.log(req.header('Authorization')); // Thêm dòng này để kiểm tra token nhận được
        const userId = req.params.userId;
        const user = await User.findByPk(userId, {
            attributes: ['username', 'email']
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

module.exports = router;