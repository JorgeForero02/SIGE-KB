const {CierreDiario} = require('../models');
const ApiResponse = require('../utils/response');

class CierreDiarioController {
    async getAll(req, res) {
        try {
            const cierres = await CierreDiario.findAll({
                order: [['fecha', 'DESC']]
            });

            return ApiResponse.success(res, cierres, 'Cierres diarios obtenidos exitosamente');
        } catch (error) {
            console.error('Error al obtener cierres diarios:', error);
            return ApiResponse.error(res, 'Error al obtener cierres diarios', 500);
        }
    }

    async getById(req, res) {
        try {
            const { id } = req.params;
            const cierre = await CierreDiario.findByPk(id);
            if (!cierre) {
                return ApiResponse.notFound(res, 'Cierre diario no encontrado');
            }

            return ApiResponse.success(res, cierre, 'Cierre diario obtenido exitosamente');
        } catch (error) {
            console.error('Error al obtener cierre diario:', error);
            return ApiResponse.error(res, 'Error al obtener cierre diario', 500);
        }
    }

    async create(req, res) {
        try {
            const { fecha, total, observacion } = req.body; 
            const nuevoCierre = await CierreDiario.create({
                fecha,
                total,
                observacion
            });
            return ApiResponse.success(res, nuevoCierre, 'Cierre diario creado exitosamente', 201);
        } catch (error) {
            console.error('Error al crear cierre diario:', error);
            return ApiResponse.error(res, 'Error al crear cierre diario', 500);
        }
    }
}



module.exports = new CierreDiarioController();