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
    comment: 'Duración en minutos'
  },
  encargado: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  cliente: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'Cita',
  timestamps: false
});

module.exports = Cita;
