const { DataTypes } = require('sequelize');
const sequelize = require('../db')
const User = require('./user')
const Recipe = require('./recipe')

const Favourites = sequelize.define('Favourites', {
    favouriteId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    recipeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Recipe, // Tên bảng mà recipeId tham chiếu đến
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User, // Tên bảng mà userId tham chiếu đến
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: 'favourites',
    timestamps: false, // Chỉ cần createdAt cho mục yêu thích
});

module.exports = Favourites;
