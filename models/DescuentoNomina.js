const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DescuentoNomina = sequelize.define('DescuentoNomina', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    valor: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    fechaDescuento: {
        type: DataTypes.DATE,
        allowNull: false
    },
    idEmpleado: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}); 

module.exports = DescuentoNomina;