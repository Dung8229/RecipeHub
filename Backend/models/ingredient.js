const { DataTypes, Model } = require('sequelize')
const sequelize = require('../db')

const Ingredient = sequelize.define('Ingredient', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false },
  image: { type: DataTypes.STRING }
}, {
  tableName: 'ingredient',
  timestamps: false
});

module.exports = Ingredient