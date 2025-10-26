const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Usuario = sequelize.define('Usuario', {
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
  tipo_documento: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  documento: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: true,
    unique: true,
    validate: {
      isEmail: true
    }
  }, 
  telefono: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  estado: {
    type: DataTypes.TINYINT,
    defaultValue: 1
  },
  fecha_registro: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  fecha_salida: {
    type: DataTypes.DATE,
    allowNull: true
  },
  rol: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  contrasena: {
    type: DataTypes.STRING(255),
    allowNull: false
  }
}, {
  tableName: 'Usuario',
  timestamps: false
});

module.exports = Usuario;
