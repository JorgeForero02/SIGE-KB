const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CierreDiario = sequelize.define('CierreDiario', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  fecha: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    unique: true
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  observacion: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'Cierre_Diario',
  timestamps: false
});

module.exports = CierreDiario;
