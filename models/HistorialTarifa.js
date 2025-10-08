const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const HistorialTarifa = sequelize.define('HistorialTarifa', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  servicio: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  fecha_inicio: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  fecha_fin: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  valor: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  }
}, {
  tableName: 'Historial_Tarifa',
  timestamps: false
});

module.exports = HistorialTarifa;
