const { DataTypes } = require('sequelize')
const sequelize = require('../db')

const Recipe = sequelize.define('Recipe', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false, // Bắt buộc phải có
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true, // Có thể để trống
  },
  imageType: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  summary: {
    type: DataTypes.TEXT, // Sử dụng TEXT để lưu trữ nhiều nội dung hơn
    allowNull: true,
  },
  readyInMinutes: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  servings: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW, // Tự động lấy thời gian hiện tại khi tạo
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW, // Tự động cập nhật thời gian khi sửa đổi
  },
}, {
  timestamps: true, // Sử dụng timestamps để tự động thêm createdAt và updatedAt
  createdAt: 'created_at', // Tùy chỉnh tên cột createdAt
  updatedAt: 'updated_at', // Tùy chỉnh tên cột updatedAt
  tableName: 'recipes', // Đảm bảo tên bảng là 'recipes'
});

module.exports = Recipe