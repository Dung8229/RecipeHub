const { DataTypes } = require('sequelize')
const sequelize = require('../db')
const Competition = requie('./competition')
const User = require('./user')

const CompetitionParticipant = sequelize.define('CompetitionParticipant', {
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
  submissionTime: {
    type: DataTypes.TIMESTAMP,
    allowNull: false,
  },
}, {
  tableName: 'competition_participant',
  timestamps: true, // Tự động thêm createdAt và updatedAt
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = CompetitionParticipant