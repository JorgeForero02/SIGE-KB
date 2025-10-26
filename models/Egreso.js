const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Egreso = sequelize.define('Egreso', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  fecha: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  categoria: {
    type: DataTypes.INTEGER,
    allowNull: false
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
  proveedor: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  estado: {
    type: DataTypes.TINYINT,
    defaultValue: 1
  }
}, {
  tableName: 'Egreso',
  timestamps: false
});

module.exports = Egreso;
