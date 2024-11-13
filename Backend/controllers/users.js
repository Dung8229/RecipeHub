// api của user
const usersRouter = require('express').Router()
const sequelize = require('../db')
const logger = require('../utils/logger')
const middleware = require('../utils/middleware')
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const users = await User.findAll() // Lấy tất cả người dùng

  response.json(users)
})

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

//Lấy yêu thích
// usersRouter.get('/:userId/favourites', ')

// usersRouter.get('/:userId/favourutites/:recipeId') {
//   try {
//     const { userId, recipeId } = req.params;
//     const favourite = await Favourites.findOne({ where: { userId, recipeId } });
//     if (favourite) {
//         res.json({ isFavourite: true });
//     } else {
//         res.json({ isFavourite: false });
//     }
// } catch (error) {
//     res.status(500).json({ error: 'Something went wrong' });
// }
// }

module.exports = usersRouter