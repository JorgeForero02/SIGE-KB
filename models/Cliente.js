const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Cliente = sequelize.define('Cliente', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  apellido: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  telefono: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  tipo_documento: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  documento: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true
  }
}, {
  tableName: 'Cliente',
  timestamps: false
});

module.exports = Cliente;
