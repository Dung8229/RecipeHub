const { DataTypes } = require('sequelize')
const sequelize = require('../db')
const Ingredient = require('./ingredient')

const IngredientCaloricbreakdown = sequelize.define('IngredientCaloricbreakdown', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
  percentProtein: { type: DataTypes.FLOAT },
  percentFat: { type: DataTypes.FLOAT },
  percentCarbs: { type: DataTypes.FLOAT },
  ingredientId: { type: DataTypes.INTEGER, references: { model: Ingredient, key: 'id' } }
}, {
  tableName: 'ingredient_caloricbreakdown',
  timestamps: false
});

module.exports = IngredientCaloricbreakdown