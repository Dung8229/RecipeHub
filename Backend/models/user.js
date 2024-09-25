const { Sequelize, DataTypes } = require('sequelize')
const sequelize = require('../db')

// Định nghĩa model cho bảng users
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING(20),
    defaultValue: 'user',
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
  },
}, {
  tableName: 'users', // Tên bảng trong cơ sở dữ liệu
  timestamps: false, // Nếu bảng không có cột createdAt, updatedAt
});

module.exports = User