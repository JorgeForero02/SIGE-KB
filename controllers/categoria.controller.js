const { Categoria, Servicio } = require('../models');
const ApiResponse = require('../utils/response');
const AuditoriaService = require('../services/auditoria.service');
const { Op } = require('sequelize');

class CategoriaController {
    async getAll(req, res) {
        try {
            const { estado } = req.query;

            const where = {};
            if (estado !== undefined) where.estado = estado;

            const categorias = await Categoria.findAll({
                where,
                include: [{
                    model: Servicio,
                    as: 'servicios',
                    attributes: ['id', 'nombre', 'precio', 'estado']
                }],
                order: [['nombre', 'ASC']]
            });

            return ApiResponse.success(res, categorias, 'Categorías obtenidas exitosamente');
        } catch (error) {
            console.error('Error al obtener categorías:', error);
            return ApiResponse.error(res, 'Error al obtener categorías', 500);
        }
    }

    async getById(req, res) {
        try {
            const { id } = req.params;

            const categoria = await Categoria.findByPk(id, {
                include: [{
                    model: Servicio,
                    as: 'servicios'
                }]
            });

            if (!categoria) {
                return ApiResponse.notFound(res, 'Categoría no encontrada');
            }

            return ApiResponse.success(res, categoria, 'Categoría obtenida exitosamente');
        } catch (error) {
            console.error('Error al obtener categoría:', error);
            return ApiResponse.error(res, 'Error al obtener categoría', 500);
        }
    }

    async create(req, res) {
        try {
            const { nombre, descripcion } = req.body;

            // Verificar duplicado
            const existente = await Categoria.findOne({ where: { nombre } });
            if (existente) {
                return ApiResponse.error(res, 'Ya existe una categoría con ese nombre', 409);
            }

            const categoria = await Categoria.create({
                nombre,
                descripcion,
                estado: 1
            });

            await AuditoriaService.registrar(
                'Categoria',
                'Crear',
                `Categoría creada: ${nombre}`,
                req.user.id
            );

            return ApiResponse.success(res, categoria, 'Categoría creada exitosamente', 201);
        } catch (error) {
            console.error('Error al crear categoría:', error);
            return ApiResponse.error(res, 'Error al crear categoría', 500);
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const { nombre, descripcion, estado } = req.body;

            const categoria = await Categoria.findByPk(id);
            if (!categoria) {
                return ApiResponse.notFound(res, 'Categoría no encontrada');
            }

            // Verificar duplicado si se cambió el nombre
            if (nombre && nombre !== categoria.nombre) {
                const existente = await Categoria.findOne({
                    where: { nombre, id: { [Op.ne]: id } }
                });
                if (existente) {
                    return ApiResponse.error(res, 'Ya existe una categoría con ese nombre', 409);
                }
            }

            await categoria.update({
                nombre: nombre || categoria.nombre,
                descripcion: descripcion !== undefined ? descripcion : categoria.descripcion,
                estado: estado !== undefined ? estado : categoria.estado
            });

            await AuditoriaService.registrar(
                'Categoria',
                'Actualizar',
                `Categoría actualizada: ${categoria.nombre}`,
                req.user.id
            );

            return ApiResponse.success(res, categoria, 'Categoría actualizada exitosamente');
        } catch (error) {
            console.error('Error al actualizar categoría:', error);
            return ApiResponse.error(res, 'Error al actualizar categoría', 500);
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;

            const categoria = await Categoria.findByPk(id);
            if (!categoria) {
                return ApiResponse.notFound(res, 'Categoría no encontrada');
            }

            // Verificar si tiene servicios activos
            const serviciosActivos = await Servicio.count({
                where: { categoria: id, estado: 1 }
            });

            if (serviciosActivos > 0) {
                return ApiResponse.error(
                    res,
                    'No se puede eliminar la categoría porque tiene servicios activos asociados',
                    400
                );
            }

            // Soft delete
            await categoria.update({ estado: 0 });

            await AuditoriaService.registrar(
                'Categoria',
                'Eliminar',
                `Categoría eliminada: ${categoria.nombre}`,
                req.user.id
            );

            return ApiResponse.success(res, null, 'Categoría eliminada exitosamente');
        } catch (error) {
            console.error('Error al eliminar categoría:', error);
            return ApiResponse.error(res, 'Error al eliminar categoría', 500);
        }
    }
}

module.exports = new CategoriaController();
