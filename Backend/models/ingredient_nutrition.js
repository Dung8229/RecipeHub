const { DataTypes } = require('sequelize')
const sequelize = require('../db')
const Ingredient = require('./ingredient')

const IngredientNutrition = sequelize.define('IngredientNutrition', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
  name: { type: DataTypes.STRING },
  amount: { type: DataTypes.FLOAT },
  unit: { type: DataTypes.STRING },
  percentOfDailyNeeds: { type: DataTypes.FLOAT },
  servingAmount: { type: DataTypes.FLOAT }, // Lượng ingredient mà nutrition được tính trên
  servingUnit: { type: DataTypes.STRING },
  ingredientId: { type: DataTypes.INTEGER, references: { model: Ingredient, key: 'id' } }
}, {
  tableName: 'ingredient_nutrition', // Tên bảng trong cơ sở dữ liệu
  timestamps: false, // Nếu bảng không có cột createdAt, updatedAt
});

module.exports = IngredientNutrition
