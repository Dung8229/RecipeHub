const { DataTypes } = require('sequelize')
const sequelize = require('../db')
const User = require('./user')
const Recipe = require('./recipe')

const RecipeComment = sequelize.define('RecipeComment', {
    id: {
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
    commentText: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: 'recipe_comment',
    timestamps: true, // Sử dụng createdAt và updatedAt tự động
});

Recipe.hasMany(RecipeComment, { foreignKey: 'recipeId', onDelete: 'CASCADE' });
RecipeComment.belongsTo(Recipe, { foreignKey: 'recipeId' });

User.hasMany(RecipeComment, { foreignKey: 'userId', onDelete: 'CASCADE' });
RecipeComment.belongsTo(User, { foreignKey: 'userId' });

module.exports = RecipeComment;