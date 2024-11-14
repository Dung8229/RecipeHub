const { DataTypes } = require('sequelize')
const sequelize = require('../db')
const Recipe = require('./recipe')
const User = require('./user')

const RecipeRating = sequelize.define('RecipeRating', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User, // Tên bảng tham chiếu
      key: 'id',
    },
  },
  recipeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Recipe, // Tên bảng tham chiếu
      key: 'id',
    },
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'recipe_rating',
  timestamps: true, // Tự động thêm createdAt và updatedAt
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});
// Thiết lập mối quan hệ giữa RecipeRating và Recipe
Recipe.hasMany(RecipeRating, { foreignKey: 'recipeId', onDelete: 'CASCADE' });
RecipeRating.belongsTo(Recipe, { foreignKey: 'recipeId' });

// Thiết lập mối quan hệ giữa RecipeRating và User
User.hasMany(RecipeRating, { foreignKey: 'userId', onDelete: 'CASCADE' });
RecipeRating.belongsTo(User, { foreignKey: 'userId' });
module.exports = RecipeRating