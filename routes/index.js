const express = require('express');
const router = express.Router();

// Importar rutas
const rolRoutes = require('./rol.routes');
const usuarioRoutes = require('./usuario.routes');
const categoriaRoutes = require('./categoria.routes');
const servicioRoutes = require('./servicio.routes');
const categoriaEgresoRoutes = require('./categoriaegreso.routes');
const egresoRoutes = require('./egreso.routes');
const clienteRoutes = require('./cliente.routes');
const citaRoutes = require('./cita.routes');
const historialTarifaRoutes = require('./historialtarifa.routes');
const ingresoRoutes = require('./ingreso.routes');
const nominaRoutes = require('./nomina.routes');
const auditoriaRoutes = require('./auditoria.routes');
const cierreDiarioRoutes = require('./cierrediario.routes');

// Usar rutas
router.use('/roles', rolRoutes);
router.use('/usuarios', usuarioRoutes);
router.use('/categorias', categoriaRoutes);
router.use('/servicios', servicioRoutes);
router.use('/categorias-egreso', categoriaEgresoRoutes);
router.use('/egresos', egresoRoutes);
router.use('/clientes', clienteRoutes);
router.use('/citas', citaRoutes);
router.use('/historial-tarifas', historialTarifaRoutes);
router.use('/ingresos', ingresoRoutes);
router.use('/nominas', nominaRoutes);
router.use('/auditorias', auditoriaRoutes);
router.use('/cierres-diarios', cierreDiarioRoutes);

module.exports = router;
