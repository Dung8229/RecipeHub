

const { Sequelize, DataTypes } = require('sequelize')
const sequelize = require('../db')
const db = require('../mysql');
// Định nghĩa model cho bảng users

const { verify } = require('jsonwebtoken');


const Recipe = require('./recipe');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('admin', 'user'),
    allowNull: false,
    defaultValue: 'user',
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  verified: {
    type: DataTypes.BOOLEAN
  },
  googleId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  facebookId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'users', // Tên bảng trong cơ sở dữ liệu
  timestamps: false
});

// User.hasMany(Recipe, { foreignKey: 'userId' });

module.exports = User;
