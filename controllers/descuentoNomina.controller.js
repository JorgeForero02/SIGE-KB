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
            return ApiResponse.success(res, nuevoDescuento,'Descuento de nómina creado exitosamente');
        } catch (error) {
            return ApiResponse.error(res, error.message);
        }
    }

    async getAllDescuentosNomina(req, res) {
        try {
            const filtros = {};
            console.log(req.user);
            
            if (req.user.rolNombre !== 'Administrador' && req.user.rolNombre !== 'Gerente') {
                filtros.idEmpleado = req.user.id;
            }

            const descuentos = await DescuentoNomina.findAll({
                where: filtros,
                include: { 
                    model: Usuario, 
                    as: 'empleadoInfo',
                    attributes: ['id', 'nombre', 'apellido', 'documento', 'email', 'telefono']
                }
            });
            return ApiResponse.success(res, descuentos,'Descuentos de nómina obtenidos exitosamente');
        } catch (error) {
            return ApiResponse.error(res, error.message);
        }
    }

    async getDescuentoNominaById(req, res) {
        try {
            const { id } = req.params;
            const filtros = { id };
            
            if (req.user.rolNombre !== 'Administrador' && req.user.rolNombre !== 'Gerente') {
                filtros.idEmpleado = req.user.id;
            }

            const descuento = await DescuentoNomina.findOne({
                where: filtros,
                include: { 
                    model: Usuario, 
                    as: 'empleadoInfo',
                    attributes: ['id', 'nombre', 'apellido', 'documento', 'email', 'telefono']
                } 
            });
            
            if (!descuento) {
                return ApiResponse.notFound(res, 'Descuento de nómina no encontrado');
            }

            return ApiResponse.success(res, descuento,'Descuento de nómina obtenido exitosamente');
        } catch (error) {
            return ApiResponse.error(res, error.message);
        }
    }
}

module.exports = new DescuentoNominaController();
