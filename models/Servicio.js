const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Servicio = sequelize.define('Servicio', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  estado: {
    type: DataTypes.TINYINT,
    defaultValue: 1
  },
  duracion: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Duración en minutos'
  },
  categoria: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  precio: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  porcentaje: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true
  }
}, {
  tableName: 'Servicio',
  timestamps: false
});

module.exports = Servicio;
