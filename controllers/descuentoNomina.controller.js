const { DescuentoNomina, Usuario } = require('../models');
const ApiResponse = require('../utils/response');
const { Op } = require('sequelize');
class DescuentoNominaController {

    async createDescuentoNomina(req, res) {
        try {
            const { descripcion, valor, fechaDescuento, idEmpleado } = req.body;
            const nuevoDescuento = await DescuentoNomina.create({
                descripcion,
                valor,
                fechaDescuento,
                idEmpleado
            });
            return ApiResponse.success(res, 'Descuento de nómina creado exitosamente', nuevoDescuento);
        } catch (error) {
            return ApiResponse.error(res, error.message);
        }
    }

    async getAllDescuentosNomina(req, res) {
        try {
            const filtros = {};
            if (req.user.role !== 'admin' && req.user.role !== 'gerente') {
                filtros.idEmpleado = req.user.id;
            }

            const descuentos = await DescuentoNomina.findAll({
                where: filtros,
                include: { model: Usuario, as: 'empleadoInfo' }
            });
            return ApiResponse.success(res, 'Descuentos de nómina obtenidos exitosamente', descuentos);
        } catch (error) {
            return ApiResponse.error(res, error.message);
        }
    }

    async getDescuentoNominaById(req, res) {
        try {
            const { id } = req.params;
            const filtros = { id };
            if (req.user.role !== 'admin' && req.user.role !== 'gerente') {
                filtros.idEmpleado = req.user.id;
            }

            const descuento = await DescuentoNomina.findOne({
                where: filtros,
                include: { model: Usuario, as: 'empleadoInfo' }
            });
            if (!descuento) {
                return ApiResponse.notFound(res, 'Descuento de nómina no encontrado');
            }

            return ApiResponse.success(res, 'Descuento de nómina obtenido exitosamente', descuento);
        } catch (error) {
            return ApiResponse.error(res, error.message);
        }
    }
}

module.exports = new DescuentoNominaController();
