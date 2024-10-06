const { DataTypes, Model } = require('sequelize')
const sequelize = require('../db')

const Ingredient = sequelize.define('Ingredient', {
  id: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false },
  amount: { type: DataTypes.FLOAT, allowNull: false },
  unit: { type: DataTypes.STRING },
  image: { type: DataTypes.STRING }
});

module.exports = Ingredient