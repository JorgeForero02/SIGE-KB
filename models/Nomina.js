const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Nomina = sequelize.define('Nomina', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  fecha_inicio: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  fecha_fin: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  empleado: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  }
}, {
  tableName: 'Nomina',
  timestamps: false
});

module.exports = Nomina;
