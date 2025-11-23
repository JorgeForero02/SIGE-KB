const { HistorialTarifa, Servicio } = require('../models');
const ApiResponse = require('../utils/response');
const { Op } = require('sequelize');

class HistorialTarifaController {
    async getAll(req, res) {
        try {
            const { servicio_id, activas } = req.query;
            const where = {};

            if (servicio_id) {
                where.servicio = servicio_id;
            }

            if (activas === 'true' || activas === '1') {
                where.fecha_fin = null;
            }

            const historial = await HistorialTarifa.findAll({
                where,
                include: [{
                    model: Servicio,
                    as: 'servicioInfo',
                    attributes: ['id', 'nombre', 'descripcion']
                }],
                order: [['fecha_inicio', 'DESC']]
            });

            return ApiResponse.success(res, historial, 'Historial de tarifas obtenido exitosamente');
        } catch (error) {
            console.error('Error al obtener historial de tarifas:', error);
            return ApiResponse.error(res, 'Error al obtener historial de tarifas', 500);
        }
    }

    // Obtener historial de un servicio específico
    async getByServicio(req, res) {
        try {
            const { id } = req.params;

            // Verificar que el servicio existe
            const servicio = await Servicio.findByPk(id);
            if (!servicio) {
                return ApiResponse.notFound(res, 'Servicio no encontrado');
            }

            // Obtener historial de tarifas
            const historial = await HistorialTarifa.findAll({
                where: { servicio: id },
                order: [['fecha_inicio', 'DESC']]
            });

            return ApiResponse.success(
                res,
                {
                    servicio: {
                        id: servicio.id,
                        nombre: servicio.nombre,
                        precio_actual: servicio.precio
                    },
                    historial
                },
                'Historial de tarifas del servicio obtenido exitosamente'
            );
        } catch (error) {
            console.error('Error al obtener historial del servicio:', error);
            return ApiResponse.error(res, 'Error al obtener historial del servicio', 500);
        }
    }

    // Obtener tarifa actual de un servicio
    async getTarifaActual(req, res) {
        try {
            const { id } = req.params;

            const tarifaActual = await HistorialTarifa.findOne({
                where: {
                    servicio: id,
                    fecha_fin: null
                },
                include: [{
                    model: Servicio,
                    as: 'servicioInfo',
                    attributes: ['id', 'nombre']
                }]
            });

            if (!tarifaActual) {
                return ApiResponse.notFound(res, 'No se encontró tarifa activa para este servicio');
            }

            return ApiResponse.success(res, tarifaActual, 'Tarifa actual obtenida exitosamente');
        } catch (error) {
            console.error('Error al obtener tarifa actual:', error);
            return ApiResponse.error(res, 'Error al obtener tarifa actual', 500);
        }
    }

    // Obtener resumen de cambios de tarifas
    async getResumen(req, res) {
        try {
            const { fecha_desde, fecha_hasta } = req.query;
            const where = {};

            // Filtrar por rango de fechas
            if (fecha_desde) {
                where.fecha_inicio = { [Op.gte]: fecha_desde };
            }
            if (fecha_hasta) {
                where.fecha_inicio = { [Op.lte]: fecha_hasta };
            }

            const historial = await HistorialTarifa.findAll({
                where,
                include: [{
                    model: Servicio,
                    as: 'servicioInfo',
                    attributes: ['id', 'nombre']
                }],
                order: [['fecha_inicio', 'DESC']]
            });

            // Agrupar cambios por servicio
            const resumen = historial.reduce((acc, tarifa) => {
                const servicioId = tarifa.servicio;
                if (!acc[servicioId]) {
                    acc[servicioId] = {
                        servicio: tarifa.servicioInfo,
                        cambios: []
                    };
                }
                acc[servicioId].cambios.push({
                    id: tarifa.id,
                    fecha_inicio: tarifa.fecha_inicio,
                    fecha_fin: tarifa.fecha_fin,
                    valor: tarifa.valor,
                    activa: tarifa.fecha_fin === null
                });
                return acc;
            }, {});

            return ApiResponse.success(
                res,
                Object.values(resumen),
                'Resumen de historial de tarifas obtenido exitosamente'
            );
        } catch (error) {
            console.error('Error al obtener resumen:', error);
            return ApiResponse.error(res, 'Error al obtener resumen', 500);
        }
    }
}

module.exports = new HistorialTarifaController();
