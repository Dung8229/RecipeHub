const { DataTypes } = require('sequelize')
const sequelize = require('../db')

const Recipes = sequelize.define('Recipes', {
  recipe_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  recipe_image: {
    type: DataTypes.STRING,
  },
  recipe_image_type: {
    type: DataTypes.STRING,
  },
  summary: {
    type: DataTypes.TEXT,
  },
  readyInMinutes: {
    type: DataTypes.INTEGER,
  },
  servings: {
    type: DataTypes.INTEGER,
  },
  recipe_created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  recipe_updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  isSubmission: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  recipe_tag_id: {
    type: DataTypes.INTEGER,
  },
  tag_recipe_id: {
    type: DataTypes.INTEGER,
  },
  tag: {
    type: DataTypes.STRING,
  },
  tag_created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  tag_updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  recipe_ingredient_id: {
    type: DataTypes.INTEGER,
  },
  ingredient_recipe_id: {
    type: DataTypes.INTEGER,
  },
  ingredientId: {
    type: DataTypes.INTEGER,
  },
  amount: {
    type: DataTypes.FLOAT,
  },
  unit: {
    type: DataTypes.STRING,
  },
  original: {
    type: DataTypes.STRING,
  },
  ingredient_id: {
    type: DataTypes.INTEGER,
  },
  ingredient_name: {
    type: DataTypes.STRING,
  },
  ingredient_image: {
    type: DataTypes.STRING,
  },
}, {
  tableName: 'recipes_all',
});

module.exports = Recipes
