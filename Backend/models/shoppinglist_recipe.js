const { DataTypes } = require('sequelize')
const sequelize = require('../db')
const User = require('./user')
const Recipe = require('./recipe');

const ShoppinglistRecipe = sequelize.define('ShoppinglistRecipe', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User, // Tên bảng users
            key: 'id'
        }
    },
    recipeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Recipe, // Tên bảng recipes
            key: 'id'
        }
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    }
}, {
    tableName: 'shoppinglist_recipe',
    timestamps: false // Nếu bạn không cần các trường updatedAt
});

ShoppinglistRecipe.belongsTo(Recipe, { foreignKey: 'recipeId' });
Recipe.hasMany(ShoppinglistRecipe, { foreignKey: 'recipeId' });

module.exports = ShoppinglistRecipe
