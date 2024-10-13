const { DataTypes } = require('sequelize')
const sequelize = require('../db')

// Định nghĩa model cho bảng users
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true, // Chấp nhận null
  },
  imageType: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  servings: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  readyInMinutes: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  glutenFree: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  diets: {
    type: DataTypes.ARRAY(DataTypes.STRING), // Mảng chứa string
    allowNull: true,
  },
  vegan: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  veryHealthy: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  veryPopular: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  dishTypes: {
    type: DataTypes.ARRAY(DataTypes.STRING), // Mảng chứa string
    allowNull: true,
  },
  summary: {
    type: DataTypes.TEXT, // Cho phép nhiều nội dung hơn STRING
    allowNull: true,
  },
}, {
  tableName: 'users', // Tên bảng trong cơ sở dữ liệu
  timestamps: false, // Nếu bảng không có cột createdAt, updatedAt
});

module.exports = User