const tokenRouter = require('express').Router();
const middleware = require('../utils/middleware');

// Route lấy thông tin user từ token
tokenRouter.get('/user-info', middleware.authenticateJWT, (req, res) => {
  // Trả thông tin từ token (id, username, role)
  const { id, username, role, image } = req.user;
  res.json({ id, username, role, image });
});

// Route check token có valid không
tokenRouter.get('/isValid', middleware.authenticateJWT, (req, res) => {
  return res.status(200).json({
    valid: true,
    user: req.user, // Thông tin người dùng từ token (nếu cần)
  })
})

module.exports = tokenRouter;