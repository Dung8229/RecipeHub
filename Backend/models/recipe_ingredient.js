const { DataTypes } = require('sequelize')
const sequelize = require('../db')
const Recipe = require('./recipe');
const Ingredient = require('./ingredient');

const RecipeIngredient = sequelize.define('RecipeIngredient', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  recipeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Recipe,
      key: 'id',
    },
  },
  ingredientId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Ingredient,
      key: 'id',
    },
  },
  amount: { 
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  unit: { 
    type: DataTypes.STRING,
    allowNull: false,
  },
  original: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'recipe_ingredient',
  timestamps: false
});

RecipeIngredient.belongsTo(Ingredient, { foreignKey: 'ingredientId' });
Ingredient.hasMany(RecipeIngredient, { foreignKey: 'ingredientId' });
RecipeIngredient.belongsTo(Recipe, { foreignKey: 'recipeId' })
Recipe.hasMany(RecipeIngredient, { foreignKey: 'recipeId' })

module.exports = RecipeIngredient