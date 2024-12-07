const { DataTypes } = require('sequelize')
const sequelize = require('../db')

const Competition = sequelize.define('Competition', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  detailDescription: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  prize: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  winnerSelectionStartDate: {
    type: DataTypes.DATE,
    allowNull: true, // Có thể null nếu không có giai đoạn này
  },
  prizeGiven: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  }
}, {
  tableName: 'competitions',
  timestamps: true, // Tự động thêm createdAt và updatedAt
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = Competition