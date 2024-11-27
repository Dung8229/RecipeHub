const { DataTypes } = require('sequelize')
const sequelize = require('../db')
const Competition = require('./competition')
const User = require('./user');
const Recipe = require('./recipe');

const CompetitionEntry = sequelize.define('CompetitionEntry', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  competitionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Competition, // Tên bảng tham chiếu
      key: 'id',
    },
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User, // Tên bảng tham chiếu
      key: 'id',
    },
  },
  submissionId: {
    type: DataTypes.INTEGER,
    references: {
      model: Recipe, // Tên bảng tham chiếu
      key: 'id',
    },
  },
  tieBreakerRank: {
    type: DataTypes.INTEGER,
  }
}, {
  tableName: 'competition_entry',
  timestamps: false, // Tự động thêm createdAt và updatedAt
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

CompetitionEntry.belongsTo(User, { foreignKey: 'userId' });
CompetitionEntry.belongsTo(Recipe, { foreignKey: 'submissionId'})
User.hasMany(CompetitionEntry, { foreignKey: 'userId' });
Recipe.hasMany(CompetitionEntry, { foreignKey: 'submissionId' });

module.exports = CompetitionEntry