const { DescuentoNomina, Usuario } = require('../models');
const apiResponse = require('../utils/response');
const { Op } = require('sequelize');

class DescuentoNominaController {
    // Crear un nuevo descuento de nómina
    async createDescuentoNomina(req, res) {
        try {
            const { descripcion, valor, fechaDescuento, idEmpleado } = req.body;
            const nuevoDescuento = await DescuentoNomina.create({
                descripcion,
                valor,
                fechaDescuento,
                idEmpleado
            });
            return apiResponse.successResponseWithData(res, 'Descuento de nómina creado exitosamente', nuevoDescuento);
        } catch (error) {
            return apiResponse.errorResponse(res, error.message);
        }
    }
    // Obtener todos los descuentos de nómina
    async getAllDescuentosNomina(req, res) {
        try {
            //filtrar por empleado considerando el token de autenticación
            const filtros = {};
            if (req.user.role !== 'admin' && req.user.role !== 'gerente') {
                filtros.idEmpleado = req.user.id;
            }
            const descuentos = await DescuentoNomina.findAll({ where: filtros, include: Usuario });

            return apiResponse.successResponseWithData(res, 'Descuentos de nómina obtenidos exitosamente', descuentos);
        } catch (error) {
            return apiResponse.errorResponse(res, error.message);
        }
    }

    // Obtener un descuento de nómina por ID
    async getDescuentoNominaById(req, res) {
        try {
        //filtrar por empleado considerando el token de autenticación
            const { id } = req.params;
            const filtros = { id };
            if (req.user.role !== 'admin' && req.user.role !== 'gerente') {
                filtros.idEmpleado = req.user.id;
            }
            const descuento = await DescuentoNomina.findOne({ where: filtros, include: Usuario });
            if (!descuento) {
                return apiResponse.notFoundResponse(res, 'Descuento de nómina no encontrado');
            }
            return apiResponse.successResponseWithData(res, 'Descuento de nómina obtenido exitosamente', descuento);
        } catch (error) {
            return apiResponse.errorResponse(res, error.message);
        }
    }
}

module.exports = new DescuentoNominaController();