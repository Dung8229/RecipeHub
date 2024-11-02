// api của user
const usersRouter = require('express').Router()
const sequelize = require('../db')
const logger = require('../utils/logger')
const middleware = require('../utils/middleware')
const User = require('../models/user')

// Lấy danh sách người dùng
usersRouter.get('/', async (req, res) => {
  try {
      const users = await User.findAll();
      res.status(200).json(users);
  } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Failed to fetch users' });
  }
});

usersRouter.get('/:id', middleware.authenticateJWT, async (request, response) => {
  try {
    const { id } = request.params
    const user = await User.findOne({ where: { id } })

    if (!user) {
      return response.status(404).json({ error: 'User not found' })
    }

    response.json(user)
  } catch (error) {
    response.status(500).json({ error: 'An error occurred' })
  }
})

usersRouter.put('/:id', middleware.authenticateJWT, async (request, response) => {
  try {
    const { id } = request.params;
    const body = request.body;

    const user = await User.findOne({ where: { id } });
    if (!user) {
      return response.status(404).json({ error: 'User not found' });
    }

    // Tìm và cập nhật trực tiếp trong cơ sở dữ liệu
    await user.update(
      {
        username: body.username ?? user.username,
        email: body.email ?? user.email,
        password: body.password ?? user.password,
        role: body.role ?? user.role,
        verified: typeof body.verified !== 'undefined' ? body.verified : user.verified
      }
    )

    console.log('ok')

    // Tìm lại người dùng sau khi cập nhật để gửi về response
    const updatedUser = await User.findOne({ where: { id } });
    response.json({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    response.status(500).json({ error: 'An error occurred' });
  }
})

// Xóa người dùng (dành cho admin)
usersRouter.delete('/:userId', async (req, res) => {
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