const { Ingreso, Servicio, Usuario, Nomina } = require('../models');
const ApiResponse = require('../utils/response');
const AuditoriaService = require('../services/auditoria.service');
const { Op } = require('sequelize');
const sequelize = require('../config/database');

class NominaController {
    // Calcular nómina automática por período
    async calcularNomina(req, res) {
        const transaction = await sequelize.transaction();
        try {
            const { empleado, fecha_inicio, fecha_fin, tipo_periodo } = req.body;

            // Validaciones
            if (!empleado || !fecha_inicio || !fecha_fin) {
                await transaction.rollback();
                return ApiResponse.error(res, 'Empleado, fecha de inicio y fecha fin son requeridos', 400);
            }

            // Verificar que el empleado existe
            const empleadoInfo = await Usuario.findByPk(empleado);
            if (!empleadoInfo) {
                await transaction.rollback();
                return ApiResponse.notFound(res, 'Empleado no encontrado');
            }

            // Verificar si ya existe nómina para este período
            const nominaExistente = await Nomina.findOne({
                where: {
                    empleado,
                    fecha_inicio,
                    fecha_fin
                }
            });

            if (nominaExistente) {
                await transaction.rollback();
                return ApiResponse.error(res, 'Ya existe una nómina para este empleado en este período', 400);
            }

            // Obtener todos los ingresos del empleado en el período
            const ingresos = await Ingreso.findAll({
                where: {
                    empleado,
                    fecha: {
                        [Op.between]: [fecha_inicio, fecha_fin]
                    }
                },
                include: [{
                    model: Servicio,
                    as: 'servicioInfo',
                    attributes: ['id', 'nombre', 'porcentaje']
                }],
                transaction
            });

            // Calcular el total de la nómina
            let totalNomina = 0;
            const detalleServicios = [];

            for (const ingreso of ingresos) {
                const porcentaje = ingreso.servicioInfo.porcentaje || 0;
                const comision = (ingreso.valor * porcentaje) / 100;
                totalNomina += comision;

                detalleServicios.push({
                    fecha: ingreso.fecha,
                    servicio: ingreso.servicioInfo.nombre,
                    valor_servicio: ingreso.valor,
                    porcentaje: porcentaje,
                    comision: comision
                });
            }

            // Crear registro de nómina
            const nomina = await Nomina.create({
                fecha_inicio,
                fecha_fin,
                empleado,
                total: totalNomina
            }, { transaction });

            await transaction.commit();

            // Registrar en auditoría
            await AuditoriaService.registrar(
                req.user.id,
                'Nómina calculada',
                'CREATE',
                `Nómina calculada para empleado ${empleadoInfo.nombre} ${empleadoInfo.apellido} del ${fecha_inicio} al ${fecha_fin}. Total: $${totalNomina}`
            );

            return ApiResponse.success(res, {
                nomina,
                detalle: detalleServicios,
                resumen: {
                    total_servicios: ingresos.length,
                    total_comisiones: totalNomina
                }
            }, 'Nómina calculada exitosamente', 201);

        } catch (error) {
            await transaction.rollback();
            console.error('Error al calcular nómina:', error);
            return ApiResponse.error(res, 'Error al calcular nómina', 500);
        }
    }

    // Obtener detalle de nómina por empleado y período
    async getDetalleNomina(req, res) {
        try {
            const { empleado, fecha_inicio, fecha_fin } = req.query;

            if (!empleado || !fecha_inicio || !fecha_fin) {
                return ApiResponse.error(res, 'Empleado, fecha de inicio y fecha fin son requeridos', 400);
            }

            // Obtener información del empleado
            const empleadoInfo = await Usuario.findByPk(empleado, {
                attributes: ['id', 'nombre', 'apellido', 'email']
            });

            if (!empleadoInfo) {
                return ApiResponse.notFound(res, 'Empleado no encontrado');
            }

            // Obtener todos los ingresos del período
            const ingresos = await Ingreso.findAll({
                where: {
                    empleado,
                    fecha: {
                        [Op.between]: [fecha_inicio, fecha_fin]
                    }
                },
                include: [{
                    model: Servicio,
                    as: 'servicioInfo',
                    attributes: ['id', 'nombre', 'porcentaje', 'precio']
                }],
                order: [['fecha', 'ASC']]
            });

            // Calcular detalle
            let totalComisiones = 0;
            const serviciosPrestados = ingresos.map(ingreso => {
                const porcentaje = ingreso.servicioInfo.porcentaje || 0;
                const comision = (ingreso.valor * porcentaje) / 100;
                totalComisiones += comision;

                return {
                    id: ingreso.id,
                    fecha: ingreso.fecha,
                    servicio: {
                        id: ingreso.servicioInfo.id,
                        nombre: ingreso.servicioInfo.nombre
                    },
                    valor_servicio: parseFloat(ingreso.valor),
                    porcentaje_comision: parseFloat(porcentaje),
                    comision_ganada: parseFloat(comision.toFixed(2)),
                    extra: parseFloat(ingreso.extra || 0),
                    medio_pago: ingreso.medio_pago,
                    descripcion: ingreso.descripcion
                };
            });

            return ApiResponse.success(res, {
                empleado: empleadoInfo,
                periodo: {
                    fecha_inicio,
                    fecha_fin
                },
                servicios_prestados: serviciosPrestados,
                resumen: {
                    total_servicios: ingresos.length,
                    total_comisiones: parseFloat(totalComisiones.toFixed(2))
                }
            }, 'Detalle de nómina obtenido exitosamente');

        } catch (error) {
            console.error('Error al obtener detalle de nómina:', error);
            return ApiResponse.error(res, 'Error al obtener detalle de nómina', 500);
        }
    }

    // Obtener todas las nóminas con filtros
    async getNominas(req, res) {
        try {
            const { empleado, fecha_inicio, fecha_fin } = req.query;
            const where = {};

            if (empleado) where.empleado = empleado;
            if (fecha_inicio && fecha_fin) {
                where.fecha_inicio = { [Op.gte]: fecha_inicio };
                where.fecha_fin = { [Op.lte]: fecha_fin };
            }

            const nominas = await Nomina.findAll({
                where,
                include: [{
                    model: Usuario,
                    as: 'empleadoInfo',
                    attributes: ['id', 'nombre', 'apellido', 'email']
                }],
                order: [['fecha_inicio', 'DESC']]
            });

            return ApiResponse.success(res, nominas, 'Nóminas obtenidas exitosamente');

        } catch (error) {
            console.error('Error al obtener nóminas:', error);
            return ApiResponse.error(res, 'Error al obtener nóminas', 500);
        }
    }

    // Obtener nómina por ID
    async getNominaById(req, res) {
        try {
            const { id } = req.params;

            const nomina = await Nomina.findByPk(id, {
                include: [{
                    model: Usuario,
                    as: 'empleadoInfo',
                    attributes: ['id', 'nombre', 'apellido', 'email']
                }]
            });

            if (!nomina) {
                return ApiResponse.notFound(res, 'Nómina no encontrada');
            }

            // Obtener detalle de servicios
            const ingresos = await Ingreso.findAll({
                where: {
                    empleado: nomina.empleado,
                    fecha: {
                        [Op.between]: [nomina.fecha_inicio, nomina.fecha_fin]
                    }
                },
                include: [{
                    model: Servicio,
                    as: 'servicioInfo',
                    attributes: ['id', 'nombre', 'porcentaje']
                }]
            });

            const detalleServicios = ingresos.map(ingreso => {
                const porcentaje = ingreso.servicioInfo.porcentaje || 0;
                const comision = (ingreso.valor * porcentaje) / 100;

                return {
                    fecha: ingreso.fecha,
                    servicio: ingreso.servicioInfo.nombre,
                    valor_servicio: parseFloat(ingreso.valor),
                    porcentaje_comision: parseFloat(porcentaje),
                    comision_ganada: parseFloat(comision.toFixed(2))
                };
            });

            return ApiResponse.success(res, {
                nomina,
                detalle: detalleServicios
            }, 'Nómina obtenida exitosamente');

        } catch (error) {
            console.error('Error al obtener nómina:', error);
            return ApiResponse.error(res, 'Error al obtener nómina', 500);
        }
    }
}

module.exports = new NominaController();
