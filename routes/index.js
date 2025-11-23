const express = require('express');
const router = express.Router();

// Importar todas las rutas
const authRoutes = require('./auth.routes');
const rolRoutes = require('./rol.routes');
const usuarioRoutes = require('./usuario.routes');
const categoriaRoutes = require('./categoria.routes');
const servicioRoutes = require('./servicio.routes');
const ingresoRoutes = require('./ingreso.routes');
const egresoRoutes = require('./egreso.routes');
const categoriaEgresoRoutes = require('./categoriaEgreso.routes');
const clienteRoutes = require('./cliente.routes');
const citaRoutes = require('./cita.routes');
const nominaRoutes = require('./nomina.routes');
const reporteRoutes = require('./reporte.routes');
const consultaRoutes = require('./consulta.routes');
const descuentoNominaRoutes = require('./descuentoNomina.routes');

// Montar rutas
router.use('/auth', authRoutes);
router.use('/roles', rolRoutes);
router.use('/usuarios', usuarioRoutes);
router.use('/categorias', categoriaRoutes);
router.use('/servicios', servicioRoutes);
router.use('/ingresos', ingresoRoutes);
router.use('/egresos', egresoRoutes);
router.use('/categorias-egreso', categoriaEgresoRoutes);
router.use('/clientes', clienteRoutes);
router.use('/citas', citaRoutes);
router.use('/nominas', nominaRoutes);
router.use('/reportes', reporteRoutes);
router.use('/consultas', consultaRoutes);
router.use('/descuentos-nomina', descuentoNominaRoutes);

module.exports = router;
