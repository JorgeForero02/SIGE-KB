const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CategoriaEgreso = sequelize.define('CategoriaEgreso', {
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
  }
}, {
  tableName: 'Categoria_Egreso',
  timestamps: false
});

module.exports = CategoriaEgreso;
