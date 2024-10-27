const { DataTypes } = require('sequelize')
const sequelize = require('../db')
const Recipe = require('./recipe')

const RecipeInstruction = sequelize.define('RecipeInstruction', {
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
  stepNumber: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  tableName: 'recipe_instruction',
  timestamps: false
});

module.exports = RecipeInstruction