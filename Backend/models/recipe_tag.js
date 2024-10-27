const { DataTypes } = require('sequelize')
const sequelize = require('../db')
const Recipe = require('./recipe')

const RecipeTag = sequelize.define('RecipeTag', {
  recipe_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Recipe,
      key: 'id',
    },
  },
  tag: {
    type: DataTypes.STRING,
  },
}, {
  tableName: 'recipe_tag',
});

module.exports = RecipeTag