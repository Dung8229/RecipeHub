const { DataTypes } = require('sequelize')
const sequelize = require('../db')
const Recipe = require('./recipe');

const RecipeAverageRating = sequelize.define('RecipeAverageRating', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  recipeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Recipe, // Tên bảng tham chiếu
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  averageUserRating: {
    type: DataTypes.DECIMAL(3, 1),
    defaultValue: 0,
  },
  totalUserRatings: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  tableName: 'recipe_averagerating',
  timestamps: true, // Tự động thêm createdAt và updatedAt
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = RecipeAverageRating