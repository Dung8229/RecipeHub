const { DataTypes } = require('sequelize')
const sequelize = require('../db')
const Competition = requie('./competition')
const User = require('./user')

const Judge = sequelize.define('Judge', {
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
  judge: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User, // Tên bảng tham chiếu
      key: 'id',
    },
  },
}, {
  tableName: 'judges',
  timestamps: true, // Tự động thêm createdAt và updatedAt
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = Judge