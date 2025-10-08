const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UsuarioCategoria = sequelize.define('UsuarioCategoria', {
  id_usuario: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false
  },
  id_categoria: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false
  }
}, {
  tableName: 'Usuario_Categoria',
  timestamps: false
});

module.exports = UsuarioCategoria;
