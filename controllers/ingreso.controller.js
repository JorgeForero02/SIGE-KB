const { Ingreso, Servicio, Usuario, CierreDiario, Cita } = require('../models');
const ApiResponse = require('../utils/response');
const AuditoriaService = require('../services/auditoria.service');
const { Op } = require('sequelize');

class IngresoController {
    async getAll(req, res) {
        try {
            const { fecha_inicio, fecha_fin, empleado, servicio } = req.query;

            const where = {};

            if (fecha_inicio && fecha_fin) {
                where.fecha = {
                    [Op.between]: [fecha_inicio, fecha_fin]
                };
            } else if (fecha_inicio) {
                where.fecha = { [Op.gte]: fecha_inicio };
            } else if (fecha_fin) {
                where.fecha = { [Op.lte]: fecha_fin };
            }

            if (empleado) where.empleado = empleado;
            if (servicio) where.servicio = servicio;

            const ingresos = await Ingreso.findAll({
                where,
                include: [
                    {
                        model: Servicio,
                        as: 'servicioInfo',
                        attributes: ['id', 'nombre', 'precio']
                    },
                    {
                        model: Usuario,
                        as: 'empleadoInfo',
                        attributes: ['id', 'nombre', 'apellido']
                    },
                    {
                        model: Cita,
                        as: 'citaInfo',
                        required: false,
                        attributes: ['id', 'fecha', 'hora_inicio']
                    }
                ],
                order: [['fecha', 'DESC'], ['id', 'DESC']]
            });

            const total = ingresos.reduce((sum, ing) => sum + parseFloat(ing.valor), 0);

            return ApiResponse.success(res, {
                ingresos,
                total,
                cantidad: ingresos.length
            }, 'Ingresos obtenidos exitosamente');
        } catch (error) {
            console.error('Error al obtener ingresos:', error);
            return ApiResponse.error(res, 'Error al obtener ingresos', 500);
        }
    }

    async getById(req, res) {
        try {
            const { id } = req.params;

            const ingreso = await Ingreso.findByPk(id, {
                include: [
                    { model: Servicio, as: 'servicioInfo' },
                    { model: Usuario, as: 'empleadoInfo', attributes: ['id', 'nombre', 'apellido'] },
                    { model: Cita, as: 'citaInfo', required: false }
                ]
            });

            if (!ingreso) {
                return ApiResponse.notFound(res, 'Ingreso no encontrado');
            }

            return ApiResponse.success(res, ingreso, 'Ingreso obtenido exitosamente');
        } catch (error) {
            console.error('Error al obtener ingreso:', error);
            return ApiResponse.error(res, 'Error al obtener ingreso', 500);
        }
    }

    async create(req, res) {
        try {
            const {
                fecha,
                servicio,
                empleado,
                cita,
                extra,
                valor,
                medio_pago,
                descripcion
            } = req.body;

            // Validar que el día no esté cerrado
            const diaFecha = fecha || new Date().toISOString().split('T')[0];
            const cierreDia = await CierreDiario.findOne({
                where: { fecha: diaFecha }
            });

            if (cierreDia) {
                return ApiResponse.error(
                    res,
                    'No se pueden registrar ingresos en un día que ya fue cerrado',
                    400
                );
            }

            // Validar que el servicio existe y está activo
            const servicioExiste = await Servicio.findOne({
                where: { id: servicio, estado: 1 }
            });
            if (!servicioExiste) {
                return ApiResponse.error(res, 'El servicio especificado no existe o está inactivo', 400);
            }

            // Validar que el empleado existe y está activo
            const empleadoExiste = await Usuario.findOne({
                where: { id: empleado, estado: 1 }
            });
            if (!empleadoExiste) {
                return ApiResponse.error(res, 'El empleado especificado no existe o está inactivo', 400);
            }

            const ingreso = await Ingreso.create({
                fecha: diaFecha,
                servicio,
                empleado,
                cita: cita || null,
                extra: extra || 0,
                valor,
                medio_pago,
                descripcion
            });

            await AuditoriaService.registrar(
                'Ingreso',
                'Crear',
                `Ingreso registrado: ${servicioExiste.nombre} - Valor: ${valor} - Empleado: ${empleadoExiste.nombre} ${empleadoExiste.apellido}`,
                req.user.id
            );

            const ingresoCompleto = await Ingreso.findByPk(ingreso.id, {
                include: [
                    { model: Servicio, as: 'servicioInfo' },
                    { model: Usuario, as: 'empleadoInfo', attributes: ['id', 'nombre', 'apellido'] },
                    { model: Cita, as: 'citaInfo', required: false }
                ]
            });

            return ApiResponse.success(res, ingresoCompleto, 'Ingreso registrado exitosamente', 201);
        } catch (error) {
            console.error('Error al crear ingreso:', error);
            return ApiResponse.error(res, 'Error al crear ingreso', 500);
        }
    }

    async getTotalDelDia(req, res) {
        try {
            const { fecha } = req.query;
            const fechaConsulta = fecha || new Date().toISOString().split('T')[0];

            const ingresos = await Ingreso.findAll({
                where: { fecha: fechaConsulta },
                attributes: ['valor', 'extra']
            });

            const total = ingresos.reduce((sum, ing) =>
                sum + parseFloat(ing.valor) + parseFloat(ing.extra), 0
            );

            return ApiResponse.success(res, {
                fecha: fechaConsulta,
                total,
                cantidad: ingresos.length
            }, 'Total del día obtenido');
        } catch (error) {
            console.error('Error al obtener total:', error);
            return ApiResponse.error(res, 'Error al obtener total del día', 500);
        }
    }
}

module.exports = new IngresoController();
