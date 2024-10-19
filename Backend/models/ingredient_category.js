const { DataTypes } = require('sequelize')
const sequelize = require('../db')
const Ingredient = require('./ingredient')

const IngredientCategory = sequelize.define('IngredientCategory', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
  category: { type: DataTypes.STRING },
  ingredientId: { type: DataTypes.INTEGER, references: { model: Ingredient, key: 'id' } }
}, {
  tableName: 'ingredient_category', // Tên bảng trong cơ sở dữ liệu
  timestamps: false, // Nếu bảng không có cột createdAt, updatedAt
});

module.exports = IngredientCategory