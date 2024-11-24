const tokenRouter = require('express').Router();
const middleware = require('../utils/middleware');
const User = require('../models/user');
const bcrypt = require('bcrypt');

// Route lấy thông tin user từ token
tokenRouter.get('/user-info', middleware.authenticateJWT, (req, res) => {
  // Trả thông tin từ token (id, username, role)
  const { id, username, role } = req.user;
  res.json({ id, username, role });
});

module.exports = tokenRouter;