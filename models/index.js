const sequelize = require('../config/database');
const Rol = require('./Rol');
const Usuario = require('./Usuario');
const Categoria = require('./Categoria');
const Servicio = require('./Servicio');
const CategoriaEgreso = require('./CategoriaEgreso');
const Egreso = require('./Egreso');
const Cliente = require('./Cliente');
const Cita = require('./Cita');
const HistorialTarifa = require('./HistorialTarifa');
const Ingreso = require('./Ingreso');
const Nomina = require('./Nomina');
const Auditoria = require('./Auditoria');
const CierreDiario = require('./CierreDiario');
const UsuarioCategoria = require('./UsuarioCategoria');

// Definir relaciones
Rol.hasMany(Usuario, { foreignKey: 'rol', as: 'usuarios' });
Usuario.belongsTo(Rol, { foreignKey: 'rol', as: 'rolInfo' });

Categoria.hasMany(Servicio, { foreignKey: 'categoria', as: 'servicios' });
Servicio.belongsTo(Categoria, { foreignKey: 'categoria', as: 'categoriaInfo' });

CategoriaEgreso.hasMany(Egreso, { foreignKey: 'categoria', as: 'egresos' });
Egreso.belongsTo(CategoriaEgreso, { foreignKey: 'categoria', as: 'categoriaInfo' });

Usuario.hasMany(Cita, { foreignKey: 'encargado', as: 'citasAsignadas' });
Cita.belongsTo(Usuario, { foreignKey: 'encargado', as: 'encargadoInfo' });

Cliente.hasMany(Cita, { foreignKey: 'cliente', as: 'citas' });
Cita.belongsTo(Cliente, { foreignKey: 'cliente', as: 'clienteInfo' });

Servicio.hasMany(HistorialTarifa, { foreignKey: 'servicio', as: 'historialTarifas' });
HistorialTarifa.belongsTo(Servicio, { foreignKey: 'servicio', as: 'servicioInfo' });

Servicio.hasMany(Ingreso, { foreignKey: 'servicio', as: 'ingresos' });
Ingreso.belongsTo(Servicio, { foreignKey: 'servicio', as: 'servicioInfo' });

Cita.hasMany(Ingreso, { foreignKey: 'cita', as: 'ingresos' });
Ingreso.belongsTo(Cita, { foreignKey: 'cita', as: 'citaInfo' });

Usuario.hasMany(Nomina, { foreignKey: 'empleado', as: 'nominas' });
Nomina.belongsTo(Usuario, { foreignKey: 'empleado', as: 'empleadoInfo' });

Usuario.belongsToMany(Categoria, {
  through: UsuarioCategoria,
  foreignKey: 'id_usuario',
  otherKey: 'id_categoria',
  as: 'categorias'
});

Categoria.belongsToMany(Usuario, {
  through: UsuarioCategoria,
  foreignKey: 'id_categoria',
  otherKey: 'id_usuario',
  as: 'usuarios'
});

const db = {
  sequelize,
  Sequelize: require('sequelize'),
  Rol,
  Usuario,
  Categoria,
  Servicio,
  CategoriaEgreso,
  Egreso,
  Cliente,
  Cita,
  HistorialTarifa,
  Ingreso,
  Nomina,
  Auditoria,
  CierreDiario,
  UsuarioCategoria
};

module.exports = db;
