const usersRouter = require('express').Router();
const db = require('../db');
const logger = require('../utils/logger');
const middleware = require('../utils/middleware');
const User = require('../models/user');
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

// Đăng ký người dùng mới
usersRouter.post('/register', async (req, res) => {
    const { username, email, password } = req.body; 

    try {
        // Kiểm tra email có trùng không
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) return res.status(400).json({ error: 'Email already exists' });

        // Mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(password, 10);

        // Thêm người dùng mới
        const newUser = await User.create({
            username, 
            email,
            password: hashedPassword,
            role: 'user',
            verified: false
        });

        return res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        logger.error('Error during user registration:', error); // Log lỗi
        return res.status(500).json({ error: 'Failed to register user' });
    }
});
// Đăng nhập và tạo token xác thực (JWT)
usersRouter.post('/login', async (req, res) => {

    const { email, password } = req.body;

    try {
        const userlogin = await User.findOne({ where: { email } });

        if (!userlogin) return res.status(401).json({ error: 'Invalid email or password' });

        const isMatch = await bcrypt.compare(password, userlogin.password);
        if (!isMatch) return res.status(401).json({ error: 'Invalid email or password' });

        const token = jwt.sign({ id: userlogin.id, role: userlogin.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, userlogin });
    } catch (error) {
        logger.error('Error during login:', error);
        return res.status(500).json({ error: 'Failed to log in' });
    }
});


// API thêm người dùng mới (cho admin)
usersRouter.post('/', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            username: username,
            email,
            password: hashedPassword,
            role: 'admin',
            verified: true
        });
        return res.status(201).json({ message: 'User added successfully', user: newUser });
    } catch (error) {
        logger.error('Error adding user:', error);
        return res.status(500).json({ error: 'Failed to add user' });
    }
});


// API xóa người dùng dựa trên ID
// usersRouter.delete('/:id', async (req, res) => {
//     const { id } = req.params;

//     try {
//         const deleted = await User.destroy({ where: { id } });
//         if (!deleted) return res.status(404).json({ error: 'User not found' });
//         return res.status(204).send(); // Trả về 204 No Content
//     } catch (error) {
//         logger.error('Error deleting user:', error);
//         return res.status(500).json({ error: 'Failed to delete user' });
//     }
// });

// Lấy tất cả người dùng
usersRouter.get('/', async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (error) {
        logger.error('Error fetching users:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// Lấy thông tin người dùng theo ID
usersRouter.get('/:id', middleware.authenticateJWT, async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findOne({ where: { id } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        logger.error('Error fetching user:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
});

// Cập nhật thông tin người dùng
usersRouter.put('/:id', middleware.authenticateJWT, async (req, res) => {
    const { id } = req.params;
    const body = req.body;
    if (req.user.role !== 'admin' && req.user.id !== parseInt(id)) {
        return res.status(403).json({ error: 'Not authorized' });
    }
    try {
        const user = await User.findOne({ where: { id } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Cập nhật thông tin
        const updatedUser = await user.update({
            username: body.username ?? user.username, // Sử dụng username
            email: body.email ?? user.email,
            password: body.password ? await bcrypt.hash(body.password, 10) : user.password, // Mã hóa lại mật khẩu nếu có thay đổi
            role: body.role ?? user.role,
            verified: typeof body.verified !== 'undefined' ? body.verified : user.verified
        });

        res.json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
        logger.error('Error updating user:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
});

// Xóa người dùng (dành cho admin)
usersRouter.delete('/:userId', middleware.authenticateJWT, middleware.authorizeAdmin, async (req, res) => {
  const { userId } = req.params;
  try {
      const user = await User.findByPk(userId);
      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }
      await user.destroy();
      res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ error: 'Failed to delete user' });
  }
});

module.exports = usersRouter
