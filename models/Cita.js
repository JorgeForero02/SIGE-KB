const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Cita = sequelize.define('Cita', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  fecha: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  hora_inicio: {
    type: DataTypes.TIME,
    allowNull: false
  },
  hora_fin: {
    type: DataTypes.TIME,
    allowNull: false
  },
  duracion: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Duraci�n en minutos'
  },
  encargado: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  cliente: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  servicio: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  estado: {
    type: DataTypes.ENUM('pendiente', 'confirmada', 'completada', 'cancelada'),
    allowNull: false,
    defaultValue: 'pendiente',
    comment: 'Estado de la cita',
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    onUpdate: DataTypes.NOW,
  }
}, {
  tableName: 'Cita',
  timestamps: false
});

module.exports = Cita;
