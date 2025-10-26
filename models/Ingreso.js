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
  empleado: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Colaboradora que realizó el servicio'
  },
  extra: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  valor: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  medio_pago: {
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: 'Efectivo, Tarjeta, Transferencia, etc.'
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
