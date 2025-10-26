const { Egreso, CategoriaEgreso, CierreDiario } = require('../models');
const ApiResponse = require('../utils/response');
const AuditoriaService = require('../services/auditoria.service');
const { Op } = require('sequelize');

class EgresoController {
    async getAll(req, res) {
        try {
            const { fecha_inicio, fecha_fin, categoria } = req.query;

            const where = { estado: 1 };

            if (fecha_inicio && fecha_fin) {
                where.fecha = {
                    [Op.between]: [fecha_inicio, fecha_fin]
                };
            } else if (fecha_inicio) {
                where.fecha = { [Op.gte]: fecha_inicio };
            } else if (fecha_fin) {
                where.fecha = { [Op.lte]: fecha_fin };
            }

            if (categoria) where.categoria = categoria;

            const egresos = await Egreso.findAll({
                where,
                include: [{
                    model: CategoriaEgreso,
                    as: 'categoriaInfo',
                    attributes: ['id', 'nombre']
                }],
                order: [['fecha', 'DESC'], ['id', 'DESC']]
            });

            const total = egresos.reduce((sum, egr) => sum + parseFloat(egr.valor), 0);

            return ApiResponse.success(res, {
                egresos,
                total,
                cantidad: egresos.length
            }, 'Egresos obtenidos exitosamente');
        } catch (error) {
            console.error('Error al obtener egresos:', error);
            return ApiResponse.error(res, 'Error al obtener egresos', 500);
        }
    }

    async getById(req, res) {
        try {
            const { id } = req.params;

            const egreso = await Egreso.findByPk(id, {
                include: [{
                    model: CategoriaEgreso,
                    as: 'categoriaInfo'
                }]
            });

            if (!egreso) {
                return ApiResponse.notFound(res, 'Egreso no encontrado');
            }

            return ApiResponse.success(res, egreso, 'Egreso obtenido exitosamente');
        } catch (error) {
            console.error('Error al obtener egreso:', error);
            return ApiResponse.error(res, 'Error al obtener egreso', 500);
        }
    }

    async create(req, res) {
        try {
            const {
                fecha,
                categoria,
                valor,
                medio_pago,
                proveedor,
                descripcion
            } = req.body;

            // Validar que el valor sea positivo
            if (valor <= 0) {
                return ApiResponse.error(res, 'El valor del egreso debe ser positivo', 400);
            }

            // Validar que el día no esté cerrado
            const diaFecha = fecha || new Date().toISOString().split('T')[0];
            const cierreDia = await CierreDiario.findOne({
                where: { fecha: diaFecha }
            });

            if (cierreDia) {
                return ApiResponse.error(
                    res,
                    'No se pueden registrar egresos en un día que ya fue cerrado',
                    400
                );
            }

            // Validar que la categoría existe
            const categoriaExiste = await CategoriaEgreso.findOne({
                where: { id: categoria, estado: 1 }
            });
            if (!categoriaExiste) {
                return ApiResponse.error(res, 'La categoría especificada no existe o está inactiva', 400);
            }

            const egreso = await Egreso.create({
                fecha: diaFecha,
                categoria,
                valor,
                medio_pago,
                proveedor,
                descripcion,
                estado: 1
            });

            await AuditoriaService.registrar(
                'Egreso',
                'Crear',
                `Egreso registrado: ${categoriaExiste.nombre} - Valor: ${valor}${proveedor ? ` - Proveedor: ${proveedor}` : ''}`,
                req.user.id
            );

            const egresoCompleto = await Egreso.findByPk(egreso.id, {
                include: [{
                    model: CategoriaEgreso,
                    as: 'categoriaInfo'
                }]
            });

            return ApiResponse.success(res, egresoCompleto, 'Egreso registrado exitosamente', 201);
        } catch (error) {
            console.error('Error al crear egreso:', error);
            return ApiResponse.error(res, 'Error al crear egreso', 500);
        }
    }

    async getTotalDelDia(req, res) {
        try {
            const { fecha } = req.query;
            const fechaConsulta = fecha || new Date().toISOString().split('T')[0];

            const egresos = await Egreso.findAll({
                where: { fecha: fechaConsulta, estado: 1 },
                attributes: ['valor']
            });

            const total = egresos.reduce((sum, egr) => sum + parseFloat(egr.valor), 0);

            return ApiResponse.success(res, {
                fecha: fechaConsulta,
                total,
                cantidad: egresos.length
            }, 'Total del día obtenido');
        } catch (error) {
            console.error('Error al obtener total:', error);
            return ApiResponse.error(res, 'Error al obtener total del día', 500);
        }
    }
}

module.exports = new EgresoController();
