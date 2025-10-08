const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Ingreso = sequelize.define('Ingreso', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  fecha: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  servicio: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  cita: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  extra: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  valor: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'Ingreso',
  timestamps: false
});

module.exports = Ingreso;
