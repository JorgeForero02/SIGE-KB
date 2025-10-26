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

// Relaciones Usuario - Rol
Rol.hasMany(Usuario, {
  foreignKey: 'rol',
  as: 'usuarios',
  constraints: true,
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

Usuario.belongsTo(Rol, {
  foreignKey: 'rol',
  as: 'rolInfo',
  constraints: true,
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

// Relaciones Servicio - Categoria
Categoria.hasMany(Servicio, { 
  foreignKey: 'categoria', 
  as: 'servicios' 
});

Servicio.belongsTo(Categoria, { 
  foreignKey: 'categoria', 
  as: 'categoriaInfo' 
});

// Relaciones Usuario - Categoria (muchos a muchos)
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

// Relaciones Egreso - CategoriaEgreso
CategoriaEgreso.hasMany(Egreso, { 
  foreignKey: 'categoria', 
  as: 'egresos' 
});

Egreso.belongsTo(CategoriaEgreso, { 
  foreignKey: 'categoria', 
  as: 'categoriaInfo' 
});

// Relaciones Cita - Cliente
Cliente.hasMany(Cita, { 
  foreignKey: 'cliente', 
  as: 'citas' 
});

Cita.belongsTo(Cliente, { 
  foreignKey: 'cliente', 
  as: 'clienteInfo' 
});

// Relaciones Cita - Usuario (encargado)
Usuario.hasMany(Cita, { 
  foreignKey: 'encargado', 
  as: 'citasAsignadas' 
});

Cita.belongsTo(Usuario, { 
  foreignKey: 'encargado', 
  as: 'encargadoInfo' 
});

// Relaciones Ingreso - Servicio
Servicio.hasMany(Ingreso, { 
  foreignKey: 'servicio', 
  as: 'ingresos' 
});

Ingreso.belongsTo(Servicio, { 
  foreignKey: 'servicio', 
  as: 'servicioInfo' 
});

// Relaciones Ingreso - Usuario (empleado)
Usuario.hasMany(Ingreso, { 
  foreignKey: 'empleado', 
  as: 'ingresos' 
});

Ingreso.belongsTo(Usuario, { 
  foreignKey: 'empleado', 
  as: 'empleadoInfo' 
});

// Relaciones Ingreso - Cita
Cita.hasMany(Ingreso, { 
  foreignKey: 'cita', 
  as: 'ingresos' 
});

Ingreso.belongsTo(Cita, { 
  foreignKey: 'cita', 
  as: 'citaInfo' 
});

// Relaciones HistorialTarifa - Servicio
Servicio.hasMany(HistorialTarifa, { 
  foreignKey: 'servicio', 
  as: 'historialTarifas' 
});

HistorialTarifa.belongsTo(Servicio, { 
  foreignKey: 'servicio', 
  as: 'servicioInfo' 
});

// Relaciones Nomina - Usuario
Usuario.hasMany(Nomina, { 
  foreignKey: 'empleado', 
  as: 'nominas' 
});

Nomina.belongsTo(Usuario, { 
  foreignKey: 'empleado', 
  as: 'empleadoInfo' 
});

module.exports = {
  sequelize,
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
