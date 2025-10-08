const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Rol = sequelize.define('Rol', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(50),
    allowNull: false
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
  tableName: 'Rol',
  timestamps: false
});

module.exports = Rol;
